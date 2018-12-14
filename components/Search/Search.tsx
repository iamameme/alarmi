import React, { Component } from 'react';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';

export default class Search extends React.Component {
    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" />
                        <Icon name="ios-people" />
                    </Item>

                </Header>
                <Button onPress={() => this.props.navigation.goBack()} transparent>
                    <Text>Search</Text>
                </Button>
            </Container>
        );
    }
}