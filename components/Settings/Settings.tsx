// use accordions (check custom header and content)
import React from 'react';
import { Container, Text, Content, Button, ActionSheet } from 'native-base';

var BUTTONS = ["Option 0", "Option 1", "Option 2", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

export default class CommentView extends React.Component {
    render() {
        return (
            <Container>
                <Content padder>
                    <Button
                        onPress={() =>
                            ActionSheet.show(
                                {
                                    options: BUTTONS,
                                    cancelButtonIndex: CANCEL_INDEX,
                                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                                    title: "Testing ActionSheet"
                                },
                                buttonIndex => {
                                    // this.setState({ clicked: BUTTONS[buttonIndex] });
                                }
                            )}
                    >
                        <Text>Actionsheet</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}