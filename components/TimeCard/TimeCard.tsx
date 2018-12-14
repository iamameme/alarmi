import React, { Component } from 'react';
import { TouchableOpacity, View, Switch, Alert } from 'react-native';
import styles from './TimeCard.styles';
import {
    Card, Text, Icon, Grid, Row, Col, Container,
    Header, Footer, H1, H2, H3, CheckBox, Form, Picker
} from 'native-base';
import DayPicker from '../DayPicker/DayPicker';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { DayMap, Alarm } from '../Alarms/Alarms.types';
import DayPickerStyles from './DayPicker.styles';
import DayButton from '../DayButton/DayButton';
import moment from 'moment';
const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface TimeCardProps {
    onPickerPress: Function;
    onSwitchPress: Function;
    onRepeatPress: Function;
    onDeletePress: Function;
    onDayPress: Function;
    onTimePress: Function;
    alarmData: Alarm;
}

interface TimeCardState {
    isCollapsed: boolean;
}

export default class TimeCard extends React.Component<TimeCardProps, TimeCardState> {
    constructor(props: TimeCardProps) {
        super(props);
        this.state = {
            isCollapsed: false
        };

        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    toggleCollapse(isCollapsed: boolean) {
        this.setState({
            isCollapsed: isCollapsed
        });
    }

    render() {
        const {
            onPickerPress,
            onSwitchPress,
            onRepeatPress,
            onDeletePress,
            onDayPress,
            onTimePress,
            alarmData
        } = this.props;
        const {
            isCollapsed
        } = this.state;
        const {
            id,
            active,
            time,
            doesRepeat,
            days,
            minutesBeforeAlarm
        } = alarmData;
        const parsedTime = moment(time).format('h:mm'),
            parsedAMPM = moment(time).format('A');

        return (
            <Card style={{ borderRadius: 15 }}>
                <Collapse isCollapsed={isCollapsed} onToggle={this.toggleCollapse} style={{ padding: 10 }}>
                    <CollapseHeader>
                        <View style={styles.horizontalContainer}>
                            <TouchableOpacity style={styles.timeContainer} onPress={() => onTimePress(id, time)}>
                                <Text style={styles.timeText}>{parsedTime}</Text>
                                <Text>{parsedAMPM}</Text>
                            </TouchableOpacity>
                            <Switch
                                value={active}
                                onValueChange={(bool) => onSwitchPress(id, bool)}
                            />
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <View const style={DayPickerStyles.horizontalStart}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                <TouchableOpacity
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                    onPress={() => onRepeatPress(id)}
                                >
                                    <CheckBox
                                        checked={doesRepeat}
                                    />
                                    <Text>{'    Repeat?'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => onDeletePress(id)}>
                                    <Icon name="trash" />
                                </TouchableOpacity>
                            </View>
                            <View style={DayPickerStyles.horizontalContainer}>
                                {
                                    dayKeys.map(
                                        (dayKey, i) => <DayButton
                                            parentId={id}
                                            key={dayKey}
                                            dayKey={dayKey}
                                            text={dayKey[0]}
                                            onPress={onDayPress}
                                            active={days[dayKey]}
                                            isLast={i === dayKeys.length - 1}
                                            disabled={!doesRepeat}
                                        />,
                                    )
                                }
                            </View>
                            <Form>
                                <Picker
                                    mode="dropdown"
                                    iosHeader="How many minutes before would you like to wake up?"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    // style={{ color: 'black' }}
                                    selectedValue={minutesBeforeAlarm}
                                    onValueChange={(val) => onPickerPress(id, val)}
                                >
                                    <Picker.Item label="1 Minute Before" value={1} />
                                    <Picker.Item label="5 Minute Before" value={5} />
                                    <Picker.Item label="10 Minute Before" value={10} />
                                    <Picker.Item label="20 Minute Before" value={20} />
                                    <Picker.Item label="40 Minute Before" value={40} />
                                </Picker>
                            </Form>
                        </View>
                    </CollapseBody>
                </Collapse>
            </Card>
        );
    }
}

