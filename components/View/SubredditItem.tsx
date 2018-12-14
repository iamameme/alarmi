import React from 'react';
import { ItemProps, ItemState, ModalType } from './View.types';
import queryString from 'query-string';
import { Modal, TouchableOpacity } from 'react-native';
import {
    Container, Button, Text, Content, Header, Badge, View, Fab, Grid, Col, Row,
    Footer, Left, Body, Title, Icon, Right, Card, CardItem, Form, Item, Picker, List,
    ListItem, Thumbnail, Separator, Spinner, Toast
} from 'native-base';
import LinkPreview from 'react-native-link-preview';
import { FullPost } from '../../utils/Utils.types';

export default class SubredditItem extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props);
        this.state = {
            clicked: false,
            thumbnail: undefined,
            fullData: undefined,
            score: undefined,
            modalType: undefined,
            modalUrl: undefined,
            extraData: undefined,
            extraThumbnail: undefined,
        };
        this.getInitialData = this.getInitialData.bind(this);
    }

    componentDidMount() {
        this.getInitialData();
    }

    checkIfImage(url) {
        return (url.match(/\.(jpeg|jpg|png)$/) != null);
    }

    getRedditData(id: string, subreddit: string) {
        try {
            fetch('https://api.reddit.com/r/' + subreddit + "/comments/" + id).then(resp => {
                if (resp.ok) return resp.json();
                if (!resp.ok) console.error(resp);
            }).then(values => {
                const details = values[0]["data"]["children"][0]["data"],
                    comments = values[1],
                    fullData: FullPost = { details: details, comments: comments };
                this.setState({
                    fullData: fullData,
                    score: details.score
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    upvoteUp() {

    }

    upvoteDown() {

    }

    getInitialData() {
        const { item, showModal } = this.props;
        var left = undefined, right = undefined, body = undefined,
            url = item.url,
            modalType, modalUrl, extraData, thumbnail;
        if (this.state.fullData === undefined) this.getRedditData(item.id, item.subreddit);
        console.log('### renderrow')

        //console.error(item.preview.images[0].source.url);
        if (this.checkIfImage(url)) {
            modalType = ModalType.IMAGE;
            modalUrl = url;
        } else if (url.match(/\.(gif)$/) != null) {
            thumbnail = undefined;
        } else if (item.url.substr(0, 14) === 'https://v.redd') {
            modalType = ModalType.VIDEO;
            modalUrl = item.url + "/DASH_1_2_M";
        } else if (url.match(/\.(gifv)$/) != null) {
            modalType = ModalType.VIDEO;
            modalUrl = item.url.substr(0, item.url.length - 4) + "mp4";
        } else if (item.domain === 'i.reddituploads.com') {
            modalType = ModalType.IMAGE;
            modalUrl = item.preview.images[0].source.url;
            // console.error(item.title)
        } else if (item.domain === 'imgur.com') {
            modalType = ModalType.IMAGE;
            modalUrl = 'https://i.imgur.com' + item.url.substr(item.url.lastIndexOf("/"), item.url.length) + ".png"
        } else if (item.domain === 'youtube.com' || item.domain === 'youtu.be') {
            let tempURL = url.substr(url.indexOf("?"), url.length)
            let vID = queryString.parse(tempURL).v;
            if (item.domain === 'youtu.be') vID = url.substr(url.lastIndexOf("/") + 1, url.length);
            modalType = ModalType.YOUTUBE;
            thumbnail = 'https://img.youtube.com/vi/' + vID + '/mqdefault.jpg';
            extraData = vID;
            modalUrl = item.url;
        } else {
            // Loophole for some images
            if (item.preview && item.preview.images) {
                modalUrl = item.preview.images[0].source.url;
                if (modalUrl.indexOf("?") !== -1)
                    modalUrl = modalUrl.substr(0, modalUrl.indexOf("?"));
            }

            modalType = ModalType.WEBVIEW;
        }

        var badthumbnails = ['default', 'image', 'self', 'nsfw'];
        if (!thumbnail && item.thumbnail && badthumbnails.indexOf(item.thumbnail) === -1)
            thumbnail = item.thumbnail;

        var linkPosts = ['default', 'image'];
        if (!modalUrl) {
            if (item.preview && item.preview.images[0].source.url)
                modalUrl = item.preview.images[0].source.url;
            if (linkPosts.indexOf(item.thumbnail) !== -1) {
                //console.error(item.url)
                LinkPreview.getPreview(item.url)
                    .then(data => {
                        this.setState({
                            extraThumbnail: data.images[0]
                        })
                    });
            }
        }

        if (!modalUrl) modalUrl = item.url;

        // Default thumbnails
        if (!thumbnail) {
            if (modalType === 'VIDEO') {
                thumbnail = 'https://premium.wpmudev.org/blog/wp-content/uploads/2014/05/youtube-missing-icon.jpg';
            } else {
                thumbnail = (modalUrl) ? modalUrl : 'https://via.placeholder.com/200x200';
            }
        }

        this.setState({
            modalType,
            modalUrl,
            extraData,
            thumbnail,
        });
    }

    render() {
        const { item, showModal } = this.props;
        var left = undefined, right = undefined, body = undefined,
            url = item.url,
            modalType = this.state.modalType,
            modalUrl = this.state.modalUrl,
            extraData = this.state.extraData,
            thumbnail = this.state.thumbnail;

        if (this.checkIfImage(item.thumbnail)) thumbnail = item.thumbnail;
        if (this.state.extraThumbnail) thumbnail = this.state.extraThumbnail;

        var finalThumbnail = <Thumbnail square source={{ uri: thumbnail }} />;
        if (item.author_flair_type === 'text' && item.is_self) {
            modalType = ModalType.WEBVIEW;
            finalThumbnail = <Icon name="list" style={{ fontSize: 50, width: 40 }}></Icon>
        }

        right = (
            <TouchableOpacity key={item.id} onPress={() => showModal(modalUrl, modalType, extraData)}>
                {finalThumbnail}
            </TouchableOpacity>
        );

        return (
            <ListItem thumbnail>
                <Body>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Comments', {
                            fullData: this.state.fullData
                        })}
                    >
                        <View style={{
                            paddingRight: '5%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap',
                            flex: 1,
                        }}>
                            <View style={{
                                display: 'flex', position: 'absolute', left: -30, width: '18%',
                                alignItems: 'center', flexDirection: 'column', alignSelf: 'center'
                            }}>
                                <Icon onPress={() => this.upvoteUp()} name="arrow-up" style={{ textAlign: 'center', fontSize: 26 }}></Icon>
                                <Text style={{ textAlign: 'center', fontSize: 16 }}>{this.state.score}</Text>
                                <Icon onPress={() => this.upvoteDown()} name="arrow-down" style={{ textAlign: 'center', fontSize: 26 }}></Icon>
                            </View>
                            <View style={{ width: '88%', left: 27 }}>
                                <Text numberOfLines={4}>{item.title}</Text>
                                <Text note numberOfLines={1}>{item.subreddit}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Body>
                <Right style={{ width: '15%' }}>
                    {right}
                </Right>
            </ListItem>
        );
    }
}
