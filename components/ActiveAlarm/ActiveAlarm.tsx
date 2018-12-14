import React from 'react';
import { Platform, Linking, Image } from 'react-native';
import { View, Text, Button } from 'native-base';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import NFCClient from '../../utils/NFCManager';
import { material } from 'react-native-typography';

export default class ModalScreen extends React.Component {
    NFCClient: any;
    supported: boolean;
    enabled: boolean;
    isWriting: boolean;
    urlToWrite: string;
    rtdType: any;
    parsedText: string;
    tag: any;

    constructor(props) {
        super(props);

        const startDetection = this.startDetection;
        const { startNfc } = this;
        this.supported = true;
        this.enabled = false;
        this.isWriting = false;
        this.urlToWrite = 'https://www.google.com';
        this.rtdType = RtdType.URL;
        this.parsedText = null;
        this.tag = {};
        this.NFCClient = new NFCClient();

        NfcManager.isSupported().then(supported => {
            if (supported) {
                console.log(supported);
                startNfc();
            } else {
                this.supported = false;
                console.warn('nfc not supported :(')
            }
        });

        this.onPressDismiss = this.onPressDismiss.bind(this);
        this.startNfc = this.startNfc.bind(this);
        this.parseUri = this.parseUri.bind(this);
        this.parseText = this.parseText.bind(this);
        this.startDetection = this.startDetection.bind(this);
    }

    onPressDismiss() {
        if (this.supported) {
            this.startDetection();
        } else {
            const deleteAlarm = this.props.navigation.getParam('deleteAlarm', 'NO-delete-alarm?');
            deleteAlarm();
            this.props.navigation.goBack();
        }
    }

    startNfc() {
        NfcManager.start({
            onSessionClosedIOS: () => {
                console.log('ios session closed');
            }
        })
            .then(result => {
                console.log('start OK', result);
            })

        if (Platform.OS === 'android') {
            NfcManager.getLaunchTagEvent()
                .then(tag => {
                    console.log('launch tag', tag);
                    if (tag) {
                        this.tag = tag;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.isEnabled()
                .then(enabled => {
                    this.enabled = enabled;
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.onStateChanged(
                event => {
                    if (event.state === 'on') {
                        this.enabled = true;
                    } else if (event.state === 'off') {
                        this.enabled = false;
                    } else if (event.state === 'turning_on') {
                        // do whatever you want
                    } else if (event.state === 'turning_off') {
                        // do whatever you want
                    }
                }
            )
                .then(sub => {
                    /*this._stateChangedSubscription = sub;
                    // remember to call this._stateChangedSubscription.remove()
                    // when you don't want to listen to this anymore*/
                })
                .catch(err => {
                    console.warn(err);
                })
        }
    }

    onTagDiscovered = tag => {
        console.log('Tag Discovered', tag);
        /*this.tag = tag;
        let url = this.parseUri(tag);
        if (url) {
            Linking.openURL(url)
                .catch(err => {
                    console.warn(err);
                })
        }

        let text = this.parseText(tag);
        this.parsedText = text;*/
        this.stopDetection();
        const deleteAlarm = this.props.navigation.getParam('deleteAlarm', 'NO-delete-alarm?');
        deleteAlarm();
        this.props.navigation.goBack();
    }

    requestFormat = () => {
        let { isWriting } = this;
        if (isWriting) {
            return;
        }

        this.isWriting = true;
        NfcManager.requestNdefWrite(null, { format: true })
            .then(() => console.log('format completed'))
            .catch(err => console.warn(err))
            .then(() => isWriting = false);
    }

    requestNdefWrite = () => {
        let { isWriting, urlToWrite, rtdType } = this;
        if (isWriting) {
            return;
        }

        let bytes;

        if (rtdType === RtdType.URL) {
            bytes = buildUrlPayload(urlToWrite);
        } else if (rtdType === RtdType.TEXT) {
            bytes = buildTextPayload(urlToWrite);
        }

        isWriting = true;
        NfcManager.requestNdefWrite(bytes)
            .then(() => console.log('write completed'))
            .catch(err => console.warn(err))
            .then(() => isWriting = false);
    }

    cancelNdefWrite = () => {
        this.isWriting = false;
        NfcManager.cancelNdefWrite()
            .then(() => console.log('write cancelled'))
            .catch(err => console.warn(err))
    }

    startDetection = () => {
        NfcManager.registerTagEvent(this.onTagDiscovered, 'Hold your device to cancel the alarm :D', true)
            .then(result => {
                console.log('registerTagEvent OK', result)
            })
            .catch(error => {
                console.warn('registerTagEvent fail', error)
            })
    }

    stopDetection = () => {
        NfcManager.unregisterTagEvent()
            .then(result => {
                console.log('unregisterTagEvent OK', result)
            })
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }

    parseUri = (tag) => {
        try {
            if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
                return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    parseText = (tag) => {
        try {
            if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
                return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../images/MorningGradient.jpg')} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                <Text style={{ color: 'white', fontSize: 30 }}>It's Time to Wake Up!</Text>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Button style={{ width: '90%', marginTop: 100, margin: 20 }}
                        onPress={() => this.onPressDismiss()} >
                        <Text style={{ fontSize: 20 }}>Dismiss</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const RtdType = {
    URL: 0,
    TEXT: 1,
};

function buildUrlPayload(valueToWrite) {
    return Ndef.encodeMessage([
        Ndef.uriRecord(valueToWrite),
    ]);
}

function buildTextPayload(valueToWrite) {
    return Ndef.encodeMessage([
        Ndef.textRecord(valueToWrite),
    ]);
}