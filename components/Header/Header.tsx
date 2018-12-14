import React from 'react';
import {
    Container, Button, Text, Content, Header,
    Footer, Left, Body, Title, Icon, Right,
    Segment,
} from 'native-base';

interface Props {
    setRandomDay: (() => void);
}

export default class HeaderView extends React.Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name="menu" />
                    </Button>
                </Left>
                <Body>
                    <Segment>
                        <Button first><Text>Puppies</Text></Button>
                        <Button last active><Text>Cubs</Text></Button>
                    </Segment>
                </Body>
                <Right>
                    <Button
                        transparent
                        onPress={() => this.props.setRandomDay()}>
                        <Icon name="dice-multiple" type={"MaterialCommunityIcons"} />
                    </Button>
                </Right>
            </Header>
        );
    }
}