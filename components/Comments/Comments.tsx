// use accordions (check custom header and content)
import * as React from 'react';
import { ScrollView } from 'react-native';
import {
    Container, Button, Text, Content, Header, Badge, View, Fab, Grid, Col, Row
} from 'native-base';
import { FullPost, PostComment, CommentData, CommentBase } from '../../utils/Utils.types';
import Accordion from 'react-native-collapsible/Accordion';
import * as _ from 'lodash';
import styles from './Comments.styles';

interface NestedListViewProps {
    comments: any;
}

interface NestedListViewState {
    activeSections: number[];
}

class NestedListView extends React.Component<NestedListViewProps, NestedListViewState> {
    constructor(props: NestedListViewProps) {
        super(props);
        let items = this.props.comments,
            activeSections = [];
        if (items.data) {
            items = items.data;
        }
        for (var i = 0; i < items.length; i++) {
            activeSections.push(i);
        }
        this.state = {
            activeSections: activeSections
        };
    }

    renderRow(itemData: CommentData) {
        const isSubmitter = itemData.is_submitter,
            edited = itemData.edited,
            score = itemData.score,
            body = itemData.body,
            timeCreated = itemData.created,
            author = itemData.author;
        let content = [];

        if (itemData.replies && itemData.replies.data && itemData.replies.data.children) {
            const replies = itemData.replies.data.children;
            let dataArray = [];
            for (var i in replies) {
                dataArray.push({
                    title: replies[i].data.author,
                    content: this.renderRow(replies[i].data)
                });
            }
            return (
                <React.Fragment>
                    <Text>{_.unescape(body)}</Text>
                    <NestedListView comments={replies} />
                </React.Fragment>
            );
        } else {
            return (
                <Text>{_.unescape(body)}</Text>
            );
        }
    }

    renderSectionTitle = section => {
        return (
            <View style={styles.content}>

            </View>
        );
    };

    renderHeader = section => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{section.title}</Text>
            </View>
        );
    };

    renderContent = section => {
        return (
            <View style={styles.content}>
                {section.content}
            </View>
        );
    };

    onChange = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        let items = this.props.comments;
        if (items.data) {
            items = items.data;
        }
        let dataArray = [];
        for (var i in items) {
            let itemData = items[i].data;
            dataArray.push({
                title: itemData.author,
                content: this.renderRow(itemData)
            });
        }
        return (
            <Accordion
                sections={dataArray}
                activeSections={this.state.activeSections}
                renderSectionTitle={this.renderSectionTitle}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                onChange={this.onChange}
                expandMultiple={true}
            />
        );
    }
}

export default class CommentView extends React.Component {
    render() {
        const fullData: FullPost = this.props.navigation.getParam('fullData', 'some default value');
        const comments = fullData.comments;
        return (
            <Container>
                {/*<HeaderView setRandomDay={this.setRandomDay} navigation={this.props.navigation} />*/}
                <Grid>
                    <Row>
                        
                    </Row>
                    <Row>
                        <ScrollView style={{ backgroundColor: '#eaf2ff' }}>
                            <NestedListView
                                comments={comments.data.children}
                            />
                        </ScrollView>
                    </Row>
                </Grid>
            </Container>
        )
    }
}
