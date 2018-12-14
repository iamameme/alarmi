import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import styles from './DayButton.styles';

interface DayButtonProps {
    parentId: number;
    dayKey: string;
    text: string;
    onPress: Function;
    active?: boolean;
    isLast?: boolean;
    disabled: boolean;
}

export default class DayButton extends React.Component<DayButtonProps> {
    constructor(props: DayButtonProps) {
        super(props)
    }

    render() {
        const {
            dayKey,
            text,
            parentId,
            active,
            isLast,
            disabled
        } = this.props;
        const marginStyle = isLast ? null : styles.margin;
        const activeStyle = active ? styles.active : null;
        const textColor = active ? 'blue' : 'pink';
        const overlay = (disabled) ? (
            <View style={[styles.circularContainer, marginStyle, activeStyle,
            { backgroundColor: 'black', position: 'absolute', opacity: 0.6 }
            ]} />
        ) : undefined;
        const onPress = (disabled) ? function () { } : this.props.onPress;
        const pointerEvents = (disabled) ? "none" : "auto";
        return (
            <TouchableOpacity
                hitSlop={styles.hitSlop}
                onPress={() => onPress(parentId, dayKey)}
                delayPressIn={0}
                delayPressOut={0}
            >
                <View pointerEvents={pointerEvents} style={[styles.circularContainer, marginStyle, activeStyle]}>
                    <Text style={{ color: textColor }}>
                        {text}
                    </Text>
                </View>
                {overlay}
            </TouchableOpacity>
        )
    }
}
