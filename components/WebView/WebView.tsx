import React from 'react';
import { Modal, TouchableOpacity, WebView, Dimensions } from 'react-native';
import {
    Container, Button, Text, Content, Header, Badge, View, Fab, Grid, Col, Row,
    Footer, Left, Body, Title, Icon, Right, Card, CardItem, Form, Item, Picker, List,
    ListItem, Thumbnail, Separator, Spinner, Toast
} from 'native-base';
import { WebViewProps } from './WebView.types';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import MyWebView from 'react-native-webview-autoheight';

class WebViewView extends React.Component<WebViewProps> {
    constructor(props: WebViewProps) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Text>Done</Text>
                        </Button>
                    </Left>
                </Header>
                <Content>
                    <MyWebView
                        source={{ uri: this.props.url }}
                        startInLoadingState={true}
                        mixedContentMode={'always'}
                        scalesPageToFit
                    // renderLoading={} Component for loading
                    />
                </Content>
            </Container>
        );
    }
}
export default withMappedNavigationProps()(WebViewView);