import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Button, CheckBox, Text, Icon } from 'native-base';
import styles from './DayPicker.styles';
import DayButton from '../DayButton/DayButton';
import { DayMap } from '../Alarms/Alarms.types';

const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Props {
    timeCardId: number;
    doesRepeat?: boolean;
    activeDayMap?: DayMap;
}

export default class RepeatPicker extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    onRepeatPress = () => {
        // eslint-disable-next-line
        //this.props.dispatchTimeRepeatPressed(this.props.timeCardId)
    }

    render() {
        return (
            
        )
    }
}

