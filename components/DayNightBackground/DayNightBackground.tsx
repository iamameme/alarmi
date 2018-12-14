import React from 'react';
import { View, Text } from 'native-base';
import { StyleSheet } from 'react-native';

export default class DayNightBackground extends React.Component {
    render() {


    }
}

/*
export default class DayNightBackground extends React.Component {
    render() {
        return(
            <View class="canvas">
                <View class="cloud"></View>
                <View class="cloud a"></View>
                <View class="cloud b"></View>
                <View class="cloud c"></View>
                <View class="land">
                    <View class="tree"></View>
                    <View class="tree a"></View>
                    <View class="tree b"></View>
                    <View class="tree c"></View>
                    <View class="tree d"></View>
                </View>
                <View class="star"></View>
                <View class="star a"></View>
                <View class="star b"></View>
                <View class="star c"></View>
                <View class="star d"></View>
                <View class="wind"></View>
                <View class="eclipse">
                    <View class="sun"></View>
                    <View class="sun a"></View>
                    <View class="moon"></View>
                    <View class="moon a"></View>
                </View>
            </View>
        );
    }
}

function generateStar(individualStyle: {}) {
    const styles = StyleSheet.create({
        star: individualStyle,
        starBefore: {

        },
        starAfter: {

        },
    });
    return (
        <React.Fragment>
            <View style={styles.starBefore} />
            <View style={styles.star} />
            <View style={styles.starAfter} />
        </React.Fragment>
    )
}
*/