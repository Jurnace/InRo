import React from "react";

import { StyleSheet, View, Alert, Linking, TouchableNativeFeedback } from "react-native";
import { Thumbnail, Text, Button, Icon } from "native-base";

import { connect } from "react-redux";

import { IP } from "./Constants";
import axios from "axios";

class TaskPerson extends React.Component {
    onPressAccept = () => {
        Alert.alert("Accept this person", "Are you sure you want to accept " + this.props.userInfo.username + " to do your task?", [{
            text: "No",
        }, {
            "text": "Yes",
            onPress: async () => {
                try {
                    const response = await axios.post(IP + "/task/accept", {
                        taskId: this.props.taskId,
                        personId: this.props.userInfo.userId
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });

                    if(response.status === 200) {
                        this.props.refresh();
                    } else {
                        Alert.alert("Error", "Unable to accept the person.");
                    }
                } catch(err) {
                    Alert.alert("Error", "Unable to accept the person. Check your internet connection and try again later.");
                }
            }
        }], { cancelable: false });
    };

    onPressReject = () => {
        Alert.alert("Reject this person", "Are you sure you want to reject " + this.props.userInfo.displayName + "?", [{
            text: "No",
        }, {
            "text": "Yes",
            onPress: async () => {
                try {
                    const response = await axios.post(IP + "/task/reject", {
                        taskId: this.props.taskId,
                        personId: this.props.userInfo.userId
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });

                    if(response.status === 200) {
                        this.props.refresh();
                    } else {
                        Alert.alert("Error", "Unable to reject the person.");
                    }
                } catch(err) {
                    Alert.alert("Error", "Unable to reject the person. Check your internet connection and try again later.");
                }
            }
        }], { cancelable: false });
    };

    onPressContact = async () => {
        await Linking.openURL("sms:" + this.props.userInfo.phone);
    };

    onPressComplete = () => {
        Alert.alert("Task completed", "Are you sure " + this.props.userInfo.username + " has completed the task?", [{
            text: "No",
        }, {
            "text": "Yes",
            onPress: async () => {
                try {
                    const response = await axios.post(IP + "/task/complete", {
                        taskId: this.props.taskId,
                        personId: this.props.userInfo.userId
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });

                    if(response.status === 200) {
                        this.props.refresh();
                    } else {
                        Alert.alert("Error", "Unable to mark the person has completed the task.");
                    }
                } catch(err) {
                    Alert.alert("Error", "Unable to mark the person has completed the task. Check your internet connection and try again later.");
                }
            }
        }], { cancelable: false });
    };

    onPressCancel = () => {
        Alert.alert("Cancel task", "Are you sure you want to remove " + this.props.userInfo.username + "?", [{
            text: "No",
        }, {
            "text": "Yes",
            onPress: async () => {
                try {
                    const response = await axios.post(IP + "/task/cancel", {
                        taskId: this.props.taskId,
                        personId: this.props.userInfo.userId
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });

                    if(response.status === 200) {
                        this.props.refresh();
                    } else {
                        Alert.alert("Error", "Unable to remove the person.");
                    }
                } catch(err) {
                    Alert.alert("Error", "Unable to remove the person. Check your internet connection and try again later.");
                }
            }
        }], { cancelable: false });
    };

    onPressProfile1 = () => {
        this.props.navigation.navigate("ViewProfile", {
            userId: this.props.userInfo.userId,
            showNumber: true
        });
    };

    onPressProfile2 = () => {
        this.props.navigation.navigate("ViewProfile", {
            userId: this.props.userInfo.userId,
            showNumber: false
        });
    };

    onPressRate = () => {
        this.props.navigation.navigate("Rating", {
            taskId: this.props.taskInfo.taskId,
            targetId: this.props.userInfo.userId
        });
    };

    render() {
        const avatarPath = this.props.userInfo.avatar ? { uri: IP + "/assets/" + this.props.userInfo.avatar } : require("./assets/default_avatar.png");
        if(this.props.title === "Applied person") {
            return (
                <View style={styles.item}>
                    <TouchableNativeFeedback onPress={this.onPressProfile1}>
                        <View style={styles.row1}>
                            <Thumbnail small source={avatarPath} />
                            <View style={styles.info}>
                                <Text numberOfLines={1}>{this.props.userInfo.username}</Text>
                                <Text numberOfLines={1} note>{this.props.userInfo.shortDescription}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={styles.row2}>
                        <Button style={styles.btn} onPress={this.onPressAccept} success iconLeft>
                            <Icon name="md-checkmark" />
                            <Text uppercase={false}>Accept</Text>
                        </Button>
                        <Button style={styles.btn} onPress={this.onPressReject} danger iconLeft>
                            <Icon name="md-close" />
                            <Text uppercase={false}>Reject</Text>
                        </Button>
                    </View>
                </View>
            );
        } else if(this.props.title === "Accepted person") {
            return (
                <View style={styles.item}>
                    <TouchableNativeFeedback onPress={this.onPressProfile1}>
                        <View style={styles.row1}>
                            <Thumbnail small source={avatarPath} />
                            <View style={styles.info}>
                                <Text numberOfLines={1}>{this.props.userInfo.username}</Text>
                                <Text numberOfLines={1} note>{this.props.userInfo.shortDescription}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={styles.row2}>
                        <Button style={styles.btn} onPress={this.onPressContact} info iconLeft>
                            <Icon name="md-mail" />
                            <Text uppercase={false}>Contact</Text>
                        </Button>
                        <Button style={styles.btn} onPress={this.onPressComplete} success iconLeft>
                            <Icon name="md-checkmark" />
                            <Text uppercase={false}>Complete</Text>
                        </Button>
                        <Button style={styles.btn} onPress={this.onPressCancel} danger iconLeft>
                            <Icon name="md-close" />
                            <Text uppercase={false}>Remove</Text>
                        </Button>
                    </View>
                </View>
            );
        } else if(this.props.title === "Rejected person") {
            return (
                <View style={styles.item}>
                    <TouchableNativeFeedback onPress={this.onPressProfile2}>
                        <View style={styles.row}>
                            <Thumbnail small source={avatarPath} />
                            <View style={styles.info}>
                                <Text numberOfLines={1}>{this.props.userInfo.username}</Text>
                                <Text numberOfLines={1} note>{this.props.userInfo.shortDescription}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            );
        } else if(this.props.title === "Completed person") {
            return (
                <View style={styles.item}>
                    <TouchableNativeFeedback onPress={this.onPressProfile1}>
                        <View style={styles.row1}>
                            <Thumbnail small source={avatarPath} />
                            <View style={styles.info}>
                                <Text numberOfLines={1}>{this.props.userInfo.username}</Text>
                                <Text numberOfLines={1} note>{this.props.userInfo.shortDescription}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                    <Button style={styles.btn} onPress={this.onPressRate} success iconLeft>
                        <Icon name="md-thumbs-up" />
                        <Text uppercase={false}>Rate</Text>
                    </Button>
                </View>
            );
        }
        else {
            return (
                <View style={styles.item}>
                    <TouchableNativeFeedback onPress={this.onPressProfile2}>
                        <View style={styles.row1}>
                            <Thumbnail small source={avatarPath} />
                            <View style={styles.info}>
                                <Text numberOfLines={1}>{this.props.userInfo.username}</Text>
                                <Text numberOfLines={1} note>{this.props.userInfo.shortDescription}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    item: {
        paddingBottom: 5,
        borderBottomWidth: 0.5,
        borderColor: "#DDD",
    },
    row1: {
        paddingTop: 5,
        flex: 1,
        flexDirection: "row"
    },
    row2: {
        flex: 1,
        flexDirection: "row"
    },
    info: {
        flex: 1,
        paddingLeft: 4,
        flexDirection: "column",
        marginBottom: 3
    },
    btn: {
        flex: 1,
        borderRadius: 0,
        justifyContent: "center"
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

export default connect(mapStateToProps)(TaskPerson);

