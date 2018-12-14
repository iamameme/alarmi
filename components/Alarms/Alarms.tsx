import React from 'react';
import { Alert, AsyncStorage, Platform, ImageBackground, WebView, Vibration } from 'react-native';
import { Container, Grid, Col, View, Fab, Icon, Button, Content } from 'native-base';
import TimeCard from '../TimeCard/TimeCard';
import FooterView from '../Footer/Footer';
import { AlarmViewProps, AlarmViewState } from './Alarms.types';
import moment from 'moment';
import * as _ from 'lodash';
import DateTimePicker from 'react-native-modal-datetime-picker';
import NotificationService from '../../utils/NotificationService';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import MyWebView from 'react-native-webview-autoheight';
var RNFS = require('react-native-fs');

const defaultDays = {
    Sun: false,
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false
}

export const idConstant = 999999;

export default class AlarmView extends React.Component<AlarmViewProps, AlarmViewState> {
    webref: any;
    constructor(props: AlarmViewProps) {
        super(props);
        this.state = {
            alarms: [],
            alarmCount: 0,
            showTimePicker: false,
            nextTime: moment().add(1, 'hour'),
            indexToMutate: 0,
        };

        this.getURI = this.getURI.bind(this);
        //this.getURI();

        this.getInitialStore = this.getInitialStore.bind(this);
        this.onPickerPress = this.onPickerPress.bind(this);
        this.onSwitchPress = this.onSwitchPress.bind(this);
        this.onRepeatPress = this.onRepeatPress.bind(this);
        this.onDeletePress = this.onDeletePress.bind(this);
        this.onDayPress = this.onDayPress.bind(this);
        this.onTimePress = this.onTimePress.bind(this);
        this.stateDispatcher = this.stateDispatcher.bind(this);
        this.handleTimePicked = this.handleTimePicked.bind(this);
        this.hideTimePicker = this.hideTimePicker.bind(this);
        this.deleteAllAlarms = this.deleteAllAlarms.bind(this);
        this.generateJSFunction = this.generateJSFunction.bind(this);

        this.notificationService = new NotificationService(this.onRegister.bind(this), this.onReceiveNotification.bind(this));

        this.getInitialStore();
    }

    async getURI() {
        if (Platform.OS === 'ios') {
            const results = await RNFS.readDir(RNFS.MainBundlePath);
            const webFolder = results.filter(f => f.name == 'DayNightBackground');
            this.setState({
                backgroundURI: 'file://' + webFolder[0].path + '/index.html'
            });
        }
    }

    async componentDidMount() {
        try {
            let initValue = await AsyncStorage.getItem('@AppStore:configured');
            if (!initValue) {
                // this.props.navigation.navigate('Intro'); TODO: INTRO
            }
        } catch (error) {
            console.error('Mounting errror! ' + error);
        }
    }

    async componentDidUpdate() {
        let alarms = this.state.alarms.slice();
        for (var i in alarms) {
            let alarm = Object.assign({}, alarms[i]);
            alarm.time = moment(alarms[i].time).toDate();
            alarms[i] = alarm;
        }
        try {
            await AsyncStorage.setItem('@AppStore:alarms', JSON.stringify(alarms));
        } catch (error) {
            console.error('cant save alarms :(');
        }
    }

    async getInitialStore() {
        try {
            let initValue = await AsyncStorage.getItem('@AppStore:alarms');
            if (initValue !== null) {
                let value = JSON.parse(initValue);
                value = _.without(value, null);
                if (value && value.length && value.length > 0) {
                    let lastIndex = value[0].id;
                    for (var i in value) {
                        let momentTime = moment(value[i].time);
                        let day = momentTime.day(),
                            hour = momentTime.hours(),
                            minutes = momentTime.minutes(),
                            newTime = moment().hour(hour).minute(minutes);
                        if (newTime.isBefore(moment())) {
                            newTime = newTime.add(1, 'day');
                        }
                        value[i].time = newTime;
                        if (value[i].id > lastIndex) lastIndex = value[i].id;
                    }
                    this.setState({
                        alarms: value,
                        alarmCount: lastIndex + 1
                    });
                }
            }
        } catch (error) {
            console.error('error retrieving store' + error)
        }
    }

    onRegister(token) {
        // Alert.alert("Registered !", JSON.stringify(token));
        this.setState({
            registerToken: token.token,
        });
    }

    onReceiveNotification(notif) {
        //console.warn('notif id: ' + notif.data.id);
        Vibration.vibrate(500, false);
        const passedThis = this;
        this.props.navigation.navigate('ActiveAlarm', {
            deleteAlarm: function () {
                const id = notif.data.id,
                    id2 = id + idConstant;
                let nextAlarms = passedThis.state.alarms.slice(),
                    indexToMutate = _.findIndex(nextAlarms, ['id', id]),
                    alarm = Object.assign({}, nextAlarms[indexToMutate]);
                alarm.active = false;
                nextAlarms[indexToMutate] = alarm;
                passedThis.notificationService.cancelClusterNotif(id);
                passedThis.notificationService.cancelNotif(id2);

                passedThis.setState({
                    alarms: nextAlarms
                });
            }
        });
    }

    createAlarm() {
        let nextAlarms = this.state.alarms.slice();
        nextAlarms.push({
            id: this.state.alarmCount,
            active: false,
            time: moment().add(1, 'hour'),
            doesRepeat: false,
            days: defaultDays,
            minutesBeforeAlarm: 5
        });
        this.setState({
            alarms: nextAlarms,
            alarmCount: this.state.alarmCount + 1
        });
    }

    onRepeatPress(id: number) {
        this.stateDispatcher(id, 'doesRepeat');
    }

    onDeletePress(id: number) {
        Alert.alert(
            'Delete?',
            'Are You Sure You Want to Delete This Alarm?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => this.deleteAlarm(id) },
            ],
            { cancelable: false }
        )
    }

    onDayPress(id: number, day: string) {
        let nextAlarms = this.state.alarms.slice(),
            indexToMutate = _.findIndex(nextAlarms, ['id', id]);
        nextAlarms[indexToMutate].days[day] = !nextAlarms[indexToMutate].days[day];

        this.setState({
            alarms: nextAlarms
        });
    }

    onTimePress(id: number, date: Moment) {
        let nextAlarms = this.state.alarms.slice(),
            indexToMutate = _.findIndex(nextAlarms, ['id', id]);

        this.setState({
            nextTime: date,
            indexToMutate: indexToMutate,
            showTimePicker: true
        });
    }

    onSwitchPress(id: number, active: boolean) {
        let nextAlarms = this.state.alarms.slice(),
            indexToMutate = _.findIndex(nextAlarms, ['id', id]),
            alarm = Object.assign({}, nextAlarms[indexToMutate]);
        alarm.active = !alarm.active;
        nextAlarms[indexToMutate] = alarm;

        let id2 = id + idConstant,
            time2 = moment(nextAlarms[indexToMutate].time).subtract(nextAlarms[indexToMutate].minutesBeforeAlarm, 'minutes');

        this.setState({
            alarms: nextAlarms
        }, () => {
            if (active) {
                this.notificationService.cancelClusterNotif(id);
                this.notificationService.cancelNotif(id2);
                this.notificationService.clusterNotif(moment(nextAlarms[indexToMutate].time), id, 'Title', 'body', nextAlarms[indexToMutate])
                this.notificationService.scheduleNotif(time2, id2, 'Title', 'body', nextAlarms[indexToMutate])
            } else {
                this.notificationService.cancelClusterNotif(id);
                this.notificationService.cancelNotif(id2);
            }
        });
    }

    onPickerPress(id: number, newMinutes: number) {
        let nextAlarms = this.state.alarms.slice(),
            indexToMutate = _.findIndex(nextAlarms, ['id', id]);
        nextAlarms[indexToMutate].minutesBeforeAlarm = newMinutes;

        this.setState({
            alarms: nextAlarms
        });
    }

    deleteAlarm(id: number) {
        let nextAlarms = this.state.alarms.slice(),
            indexToMutate = _.findIndex(nextAlarms, ['id', id]);
        if (nextAlarms[indexToMutate].active) {
            const id2 = id + idConstant;
            this.notificationService.cancelClusterNotif(id);
            this.notificationService.cancelNotif(id2);
        }
        delete nextAlarms[indexToMutate];

        this.setState({
            alarms: nextAlarms
        });
    }

    deleteAllAlarms() {
        this.state.alarms.slice().forEach(alarm => {
            let id = alarm.id;
            const id2 = id + idConstant;
            this.notificationService.cancelClusterNotif(id);
            this.notificationService.cancelNotif(id2);
        });

        this.setState({
            alarms: []
        });
    }

    stateDispatcher(id: number, variable: string) {
        let nextAlarms = this.state.alarms.slice(),
            indexToMutate = _.findIndex(nextAlarms, ['id', id]),
            alarm = Object.assign({}, nextAlarms[this.state.indexToMutate]);
        alarm[variable] = !alarm[variable];
        nextAlarms[indexToMutate] = alarm;

        this.setState({
            alarms: nextAlarms
        })
    }

    handleTimePicked(time: Date) {
        let nextAlarms = this.state.alarms.slice(),
            momentTime = moment(time),
            alarm = Object.assign({}, nextAlarms[this.state.indexToMutate]);
        alarm.time = momentTime;
        nextAlarms[this.state.indexToMutate] = alarm;

        if (alarm.active) {
            const id2 = alarm.id + idConstant,
                time2 = moment(alarm.time).subtract(alarm.minutesBeforeAlarm, 'minutes');
            this.notificationService.cancelClusterNotif(alarm.id);
            this.notificationService.cancelNotif(id2);
            this.notificationService.clusterNotif(moment(alarm.time), alarm.id, 'Title', 'body', alarm)
            this.notificationService.scheduleNotif(time2, id2, 'Title', 'body', alarm)
        }

        this.setState({
            alarms: nextAlarms,
            showTimePicker: false
        });
    }

    hideTimePicker() {
        this.setState({
            showTimePicker: false
        })
    }

    onMessage(event) {
        //Prints out data that was passed.
        console.error(event.nativeEvent.data);
    }

    generateJSFunction() {
        let hour = 12 - moment().hour(),
            percent = (hour < 0) ? -hour * 0.042 : (hour) * 0.042;
        return `const percent = ${percent};
        const classes = ["eclipse", "canvas", "cloud", "land", "star", "tree", "wind", "sun", "moon", "a", "b", "c", "d"];
        for (var clas in classes) {
            var elements = document.getElementsByClassName(classes[clas]);
            for (var i in elements) {
                if (elements.hasOwnProperty(i)) {
                    let styles = window.getComputedStyle(elements[i]),
                        duration = styles.animationDuration.substr(0, styles.animationDuration.length - 1);
                    if (duration && duration > 0) {
                        elements[i].style.animationDelay = '-' + Math.floor(duration * percent) + "s";
                    }
                }
            }
        }`
    }

    render() {
        const {
            alarms,
            showTimePicker,
            nextTime
        } = this.state;
        const alarmCards = alarms.map((alarm, i) => {
            return (
                <TimeCard
                    onPickerPress={this.onPickerPress}
                    onSwitchPress={this.onSwitchPress}
                    onRepeatPress={this.onRepeatPress}
                    onDeletePress={this.onDeletePress}
                    onDayPress={this.onDayPress}
                    onTimePress={this.onTimePress}
                    alarmData={alarm}
                    key={alarm.id}
                />
            );
        });

        return (
            <Container>
                <Grid>
                    <WebView source={require('../../DayNightBackground/index.html')}
                        style={{ zIndex: 99999, position: 'absolute', width: '100%', height: '100%' }}
                        ref={c => this.webref = c}
                        onMessage={m => this.onMessage(m)}
                        injectedJavaScript={this.generateJSFunction()}
                    />
                    <Col style={{ position: 'absolute', width: '100%' }}>
                        <Content style={{ top: 30, padding: 10 }}>
                            {alarmCards}
                        </Content>
                    </Col>
                </Grid>
                <View>
                    <Fab
                        active={false}
                        style={{ backgroundColor: '#5067FF' }}
                        position="bottomRight"
                        onPress={() => this.createAlarm()}
                    >
                        <Icon name="add" />
                    </Fab>
                    <Fab
                        active={false}
                        style={{ backgroundColor: '#5067FF' }}
                        position="bottomLeft"
                        onPress={() => this.deleteAllAlarms()}
                    >
                        <Icon name="trash" />
                    </Fab>
                </View>
                <DateTimePicker
                    isVisible={showTimePicker}
                    onConfirm={this.handleTimePicked}
                    onCancel={this.hideTimePicker}
                    date={moment(nextTime).toDate()}
                    mode={'time'}
                />

            </Container>
        );
    }
}
