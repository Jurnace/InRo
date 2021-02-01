import React from "react";

import { StyleSheet, SafeAreaView, Modal, Alert, View, RefreshControl } from "react-native";
import { Container, Content, Header, Title, Body, Spinner, Button, Icon, Text } from "native-base";
import { NavigationEvents } from "react-navigation";
import { SwipeListView } from "react-native-swipe-list-view";
import NotificationItem from "../../NotificationItem";

import { connect } from "react-redux";
import { setNumberofNotifications } from "../../reducers/NotificationAction";

import { IP } from "../../Constants";
import axios from "axios";

import firebase from "react-native-firebase";

class NotificationsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            done: false,
            notifications: [],
            loading: false,
            refreshing: false
        };
    }

    loadData = async (showLoading) => {
        if(showLoading) {
            this.setState({ done: false });
        }

        try {
            await firebase.notifications().removeAllDeliveredNotifications();
            const response = await axios.post(IP + "/notification/list", {
                userId: this.props.userId
            }, {
                headers: { Authorization: this.props.token }
            });

            let unreadNot = 0;

            if(response.status === 200) {
                for(const not of response.data.notifications) {
                    not.key = not.notId,toString();
                    if(not.read) {
                        not.rightOpenValue = -60;
                        not.stopRightSwipe = -60;
                    } else {
                        unreadNot++;
                    }
                }

                this.setState({
                    done: true,
                    notifications: response.data.notifications
                });

                this.props.setNumberofNotifications(unreadNot);
            } else {
                Alert.alert("Error", "Unable to retrive notification list.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrieve notification list. Check your internet connection and try again later.");
        }
    };

    async componentDidUpdate(prevProps) {
        if(this.props.noNotifications !== prevProps.noNotifications) {
            this.setState({ done: false });
            await this.loadData();
        }
    }

    onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.loadData();
        this.setState({ refreshing: false });
    };

    renderHiddenItem = (notId, rowMap) => {
        return (
            <View style={styles.hidden}>
                <Button style={styles.button} onPress={async () => await this.onPressRead(notId, rowMap)} success><Icon name="md-checkmark" /></Button>
                <Button style={styles.button} onPress={async () => await this.onPressDelete(notId)} danger><Icon name="md-trash" /></Button>
            </View>
        );
    };

    onPressRead = async (notId, rowMap) => {
        this.setState({ loading: true });
        try {
            const response = await axios.post(IP + "/notification/read", {
                userId: this.props.userId,
                notId: notId
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                await this.loadData();
                rowMap[notId.toString()].closeRow();
                this.setState({ loading: false });
            } else {
                Alert.alert("Error", "Unable to set notification as read.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to set notification as read. Check your internet connection and try again later.");
        }
    };

    onPressDelete = async (notId) => {
        this.setState({ loading: true });
        try {
            const response = await axios.post(IP + "/notification/delete", {
                userId: this.props.userId,
                notId: notId
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                await this.loadData();
                this.setState({ loading: false });
            } else {
                Alert.alert("Error", "Unable to delete notification.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to delete notification. Check your internet connection and try again later.");
        }
    };

    EmptyList = () => {
        return (
            <View style={styles.empty}>
                <Text style={styles.textEmpty}>You have no notifications</Text>
            </View>
        );
    };

    render() {
        if (!this.state.done) {
            return (
                <Container>
                    <Header noLeft>
                        <Body>
                            <Title>Notifications</Title>
                        </Body>
                    </Header>
                    <Content refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                        <NavigationEvents onDidFocus={this.loadData} />
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Content>
                </Container>
            );
        }

        return (
            <Container>
                <Header noLeft>
                    <Body>
                        <Title>Notifications</Title>
                    </Body>
                </Header>
                <SafeAreaView style={styles.content}>
                    <NavigationEvents onDidFocus={this.loadData} />
                    <Modal visible={this.state.loading} transparent animationType="none">
                        <Spinner size="large" color="blue" />
                    </Modal>
                    <View style={styles.list}>
                        <SwipeListView data={this.state.notifications.sort((a, b) => b.notId - a.notId)} renderItem={item => <NotificationItem data={item.item} navigation={this.props.navigation} refreshing={this.state.refreshing} />} renderHiddenItem={(item, rowMap) => this.renderHiddenItem(item.item.notId, rowMap)} keyExtractor={item => {return item.notId.toString()}} rightOpenValue={-120} stopRightSwipe={-120} disableRightSwipe closeOnRowPress refreshing={this.state.refreshing} onRefresh={this.onRefresh} ListEmptyComponent={<this.EmptyList />} />
                    </View>
                </SafeAreaView>
            </Container>
        );
    };
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 56
    },
    hidden: {
        flex: 1,
        flexDirection: "row",
        alignSelf: "flex-end"
    },
    button: {
        height: "100%",
        width: 60,
        justifyContent: "center",
        borderRadius: 0
    },
    list: {
        height: "100%"
    },
    empty: {
        marginTop: 10,
        marginLeft: 7,
        marginRight: 7
    },
    textEmpty: {
        textAlign: "center"
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId,
        noNotifications: state.notificationReducer.noNotifications
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setNumberofNotifications: (noNotifications) => dispatch(setNumberofNotifications(noNotifications))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);