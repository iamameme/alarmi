import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 320,
    }
});

const slides = [
    {
        key: 'somethun',
        title: 'Title 1',
        text: 'Description.\nSay something cool',
        //image: require('./assets/1.jpg'),
        //imageStyle: styles.image,
        backgroundColor: '#59b2ab',
    },
    {
        key: 'somethun-dos',
        title: 'Title 2',
        text: 'Other cool stuff',
        backgroundColor: '#febe29',
    },
    {
        key: 'somethun1',
        title: 'Rocket guy',
        text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
        backgroundColor: '#22bcb5',
    }
];

export default class Intro extends React.Component {
    constructor(props) {
        super(props);

        this.onDone = this.onDone.bind(this);
    }

    async onDone() {
        try {
            await AsyncStorage.setItem('@AppStore:configured', 'true');
            this.props.navigation.goBack();
        } catch (error) {
            console.error('cant save configured :(' + error);
        }
    }

    render() {
        return <AppIntroSlider slides={slides} onDone={() => this.onDone()} />;
    }
}