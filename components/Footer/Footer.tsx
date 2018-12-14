import React from 'react';
import {
    Container, Button, Text, Content, Header, View,
    Footer, Left, Body, Title, Icon, Right, FooterTab
} from 'native-base';

export default class FooterView extends React.Component {
    render() {
        return (
            <View>
                <Button
                    vertical
                    onPress={() => this.props.navigation.navigate("Comments")}>
                    <Icon name="bowtie" />
                    <Text>Comments</Text>
                </Button>
                <Button
                    vertical
                    onPress={() => this.props.navigation.navigate("Settings")}>
                    <Icon name="briefcase" />
                    <Text>Settings</Text>
                </Button>
                <Button
                    vertical
                    onPress={() => this.props.navigation.navigate("Search")}>
                    <Icon name="headset" />
                    <Text>Search</Text>
                </Button>
            </View>
        );
    }
}