import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    TouchableOpacity,
    Linking,
    TextInput,
    ScrollView,
} from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';

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

export default class NFCClient {
    supported: boolean;
    enabled: boolean;
    isWriting: boolean;
    urlToWrite: string;
    rtdType: any;
    parsedText: string;
    tag: any;

    constructor() {
        this.supported = true;
        this.enabled = false;
        this.isWriting = false;
        this.urlToWrite = 'https://www.google.com';
        this.rtdType = RtdType.URL;
        this.parsedText = null;
        this.tag = {};
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        let { supported, enabled, tag, isWriting, urlToWrite, parsedText, rtdType } = this;
        return (
            <ScrollView style={{ flex: 1 }}>
                {Platform.OS === 'ios' && <View style={{ height: 60 }} />}

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{`Is NFC supported ? ${supported}`}</Text>
                    <Text>{`Is NFC enabled (Android only)? ${enabled}`}</Text>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={this._startDetection}>
                        <Text style={{ color: 'blue' }}>Start Tag Detection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={this._stopDetection}>
                        <Text style={{ color: 'red' }}>Stop Tag Detection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={this._clearMessages}>
                        <Text>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={this._goToNfcSetting}>
                        <Text >(android) Go to NFC setting</Text>
                    </TouchableOpacity>

                    {
                        <View style={{ padding: 10, marginTop: 20, backgroundColor: '#e0e0e0' }}>
                            <Text>(android) Write NDEF Test</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ marginRight: 15 }}>Types:</Text>
                                {
                                    Object.keys(RtdType).map(
                                        key => (
                                            <TouchableOpacity
                                                key={key}
                                                style={{ marginRight: 10 }}
                                                onPress={() => this.setState({ rtdType: RtdType[key] })}
                                            >
                                                <Text style={{ color: rtdType === RtdType[key] ? 'blue' : '#aaa' }}>
                                                    {key}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    )
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={{ width: 200 }}
                                    value={urlToWrite}
                                    onChangeText={urlToWrite => this.setState({ urlToWrite })}
                                />
                            </View>

                            <TouchableOpacity
                                style={{ marginTop: 20, borderWidth: 1, borderColor: 'blue', padding: 10 }}
                                onPress={isWriting ? this._cancelNdefWrite : this._requestNdefWrite}>
                                <Text style={{ color: 'blue' }}>{`(android) ${isWriting ? 'Cancel' : 'Write NDEF'}`}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginTop: 20, borderWidth: 1, borderColor: 'blue', padding: 10 }}
                                onPress={isWriting ? this._cancelNdefWrite : this._requestFormat}>
                                <Text style={{ color: 'blue' }}>{`(android) ${isWriting ? 'Cancel' : 'Format'}`}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginTop: 20, borderWidth: 1, borderColor: 'blue', padding: 10 }}
                                onPress={isWriting ? this._cancelAndroidBeam : this._requestAndroidBeam}>
                                <Text style={{ color: 'blue' }}>{`${isWriting ? 'Cancel ' : ''}Android Beam`}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <Text style={{ marginTop: 20 }}>{`Current tag JSON: ${JSON.stringify(tag)}`}</Text>
                    {parsedText && <Text style={{ marginTop: 10, marginBottom: 20, fontSize: 18 }}>{`Parsed Text: ${parsedText}`}</Text>}
                </View>
            </ScrollView>
        )
    }

    _requestFormat = () => {
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

    _requestNdefWrite = () => {
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

    _cancelNdefWrite = () => {
        this.isWriting = false;
        NfcManager.cancelNdefWrite()
            .then(() => console.log('write cancelled'))
            .catch(err => console.warn(err))
    }

    _requestAndroidBeam = () => {
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
        NfcManager.setNdefPushMessage(bytes)
            .then(() => console.log('beam request completed'))
            .catch(err => console.warn(err))
    }

    _cancelAndroidBeam = () => {
        this.isWriting = false;
        NfcManager.setNdefPushMessage(null)
            .then(() => console.log('beam cancelled'))
            .catch(err => console.warn(err))
    }

    startNfc() {
        NfcManager.start({
            onSessionClosedIOS: () => {
                console.log('ios session closed');
            }
        })
            .then(result => {
                console.log('start OK', result);
                this._startDetection();
            })
            .catch(error => {
                console.warn('start fail', error);
                this.supported = false;
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

    _onTagDiscovered = tag => {
        console.log('Tag Discovered', tag);
        this.tag = tag;
        let url = this._parseUri(tag);
        if (url) {
            Linking.openURL(url)
                .catch(err => {
                    console.warn(err);
                })
        }

        let text = this._parseText(tag);
        this.parsedText = text;
        this._stopDetection();
    }

    _startDetection = () => {
        NfcManager.registerTagEvent(this._onTagDiscovered)
            .then(result => {
                console.error('registerTagEvent OK', result)
            })
            .catch(error => {
                console.warn('registerTagEvent fail', error)
            })
    }

    _stopDetection = () => {
        NfcManager.unregisterTagEvent()
            .then(result => {
                console.log('unregisterTagEvent OK', result)
            })
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }

    _clearMessages = () => {
        this.tag = null;
    }

    _goToNfcSetting = () => {
        if (Platform.OS === 'android') {
            NfcManager.goToNfcSetting()
                .then(result => {
                    console.log('goToNfcSetting OK', result)
                })
                .catch(error => {
                    console.warn('goToNfcSetting fail', error)
                })
        }
    }

    _parseUri = (tag) => {
        try {
            if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
                return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    _parseText = (tag) => {
        try {
            if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
                return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }
}
