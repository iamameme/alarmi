// components/Hello.tsx
import React from "react";
import { Modal, TouchableOpacity } from 'react-native';
import {
    Container, Button, Text, Content, Header, Badge, View, Fab, Grid, Col, Row,
    Footer, Left, Body, Title, Icon, Right, Card, CardItem, Form, Item, Picker, List,
    ListItem, Thumbnail, Separator, Spinner, Toast
} from 'native-base';
import moment from 'moment';
import * as _ from 'lodash';
import ImageViewer from 'react-native-image-zoom-viewer';
import VideoPlayer from 'react-native-video-controls'; // is react-native-video
import { Thumbnail as VideoThumbnail } from 'react-native-thumbnail-video';
import YouTube from 'react-native-youtube';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import MyWebView from 'react-native-webview-autoheight';

import styles from "./View.styles";
import { ViewProps, State, ModalType } from './View.types';
import { ENDPOINT, getSubredditDayInfo, getDefaultFrontPage, getTopCommentsTEMP } from '../../utils/Utils';
import { API, Post } from '../../utils/Utils.types';
import HeaderView from '../Header/Header';
import FooterView from '../Footer/Footer';
import SubredditItem from './SubredditItem';
import TimeCard from '../TimeCard/TimeCard';

export default class Hello extends React.Component<ViewProps, State> {
    constructor(props: ViewProps) {
        super(props);
        this.state = {
            isLoading: true,
            frontPage: undefined,
            showModal: false,
            modalContent: { url: undefined, type: undefined }
        };

        this.setRandomDay = this.setRandomDay.bind(this);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async componentDidMount() {
        //let f = await getTopCommentsTEMP(moment().subtract(7, 'days'));
        let frontPage = await getDefaultFrontPage(moment().subtract(7, 'days'));
        this.setState({
            isLoading: false,
            frontPage: frontPage
        });
    }

    async setRandomDay() {
        var daySubtract = Math.random() * 1000;
        this.setState({
            isLoading: true
        });
        let frontPage = await getDefaultFrontPage(moment().subtract(daySubtract, 'days'));
        this.setState({
            isLoading: false,
            frontPage: frontPage
        });
    }

    checkIfImage(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    showModal(url: string, type: ModalType, extraData?: string) {
        if (this.state.modalContent.url !== url) {
            this.setState({
                modalContent: { url: url, type: type, extraData: extraData },
                showModal: true
            });
        } else if (!this.state.showModal) {
            this.setState({
                showModal: true
            });
        }
    }

    closeModal() {
        this.setState({
            showModal: false,
            modalContent: { url: undefined, type: undefined }
        });
    }

    renderList(data: Post[]) {
        return (
            <List
                dataArray={data}
                renderRow={(item: Post, b, i) => {
                    if (!item || !item.subreddit) console.error(item);
                    return <SubredditItem item={item} showModal={this.showModal} navigation={this.props.navigation} />
                }}>
            </List>
        );
    }

    getFrontPage(frontPage, index): Post[] {
        var keys = Object.keys(frontPage),
            final = [];
        for (var i in keys) {
            final.push(frontPage[keys[i]][index]);
            if (!frontPage[keys[i]][index]) console.error(keys[i])
        }
        final = final.sort(function (a, b) {
            return a.real_score - b.real_score;
        });
        return final;
    }

    render() {
        var content, modalContent;
        if (this.state.isLoading) {
            content = (
                <Text>Loading</Text>
            );
        } else {
            var posts: Post[] = this.getFrontPage(this.state.frontPage, 0);
            content = this.renderList(posts);
        }
        if (this.state.modalContent.type === 'IMAGE') {
            modalContent = <ImageViewer
                imageUrls={[{ url: this.state.modalContent.url, props: {} }]}
                onCancel={this.closeModal}
                onSwipeDown={this.closeModal}
                enableImageZoom={true}
                enableSwipeDown={true}
            />;
        }
        if (this.state.modalContent.type === 'YOUTUBE') {
            modalContent = (
                <View>
                    <Header>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.closeModal()}>
                                <Text>Done</Text>
                            </Button>
                        </Left>
                    </Header>
                    <YouTube
                        apiKey={'AIzaSyCgkPCF-p4ixnzfsAUdxWr7vSrvFF2m_iA'}
                        videoId={this.state.modalContent.extraData}
                        play={true}             // control playback of video with true/false
                        fullscreen={true}       // control whether the video should play in fullscreen or inline
                        loop={true}             // control whether the video should loop when ended
                        controls={1}

                        // onReady={e => console.error(e)}
                        //onChangeState={e => this.setState({ status: e.state })}
                        //onChangeQuality={e => this.setState({ quality: e.quality })}
                        // onError={e => console.error(e)}
                        onChangeFullscreen={e => {
                            if (!e.isFullscreen) {
                                this.closeModal()
                            }
                        }}
                        style={{ alignSelf: 'stretch', height: '92%' }}
                    />
                </View>
            );
        }
        if (this.state.modalContent.type === 'WEBVIEW') {
            modalContent = (
                <View>
                    <Header>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.closeModal()}>
                                <Text>Done</Text>
                            </Button>
                        </Left>
                    </Header>
                    <View style={{ height: '100%' }}>
                        <MyWebView
                            source={{ uri: this.state.modalContent.url }}
                            startInLoadingState={true}
                            mixedContentMode={'always'}
                            scalesPageToFit
                        // renderLoading={} Component for loading
                        />
                    </View>
                </View>
            );
        }
        if (this.state.modalContent.type === 'VIDEO') {
            // console.error(this.state.modalContent.url + "/DASH_1_2_M")
            modalContent = (
                <Grid>
                    <Col>
                        <VideoPlayer
                            source={{ uri: this.state.modalContent.url }}   // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref

                            }}                                      // Store reference
                            onBuffer={function () {
                                //this.player.presentFullscreenPlayer()
                            }}
                            onBack={this.closeModal}
                            // onEnd={}                      // Callback when playback finishes
                            // onError={}               // Callback when video cannot be loaded
                            style={styles.backgroundVideo}
                        />
                    </Col>
                </Grid>
            );
        }
        return (
            <Container>
                <Modal visible={this.state.showModal} transparent={true}>
                    {modalContent}
                </Modal>
                {/*<HeaderView setRandomDay={this.setRandomDay} navigation={this.props.navigation} />*/}
                <Grid>
                    <Col style={{ backgroundColor: '#eaf2ff' }}>
                        <TimeCard
                            id={1} // used for identification when dispatching from this component
                            enabled={true}
                            time={'12-12-12'}
                            nextAlarmText='nextalarmtext'
                            doesRepeat={true}
                            activeDayMap={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                        />
                    </Col>
                </Grid>
                <FooterView navigation={this.props.navigation} />
            </Container>
        )
    }
}