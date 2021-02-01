import React from "react";

import { StyleSheet, TouchableNativeFeedback, View, Alert } from "react-native";
import { Text } from "native-base";

import { connect } from "react-redux";
import { setNumberofNotifications } from "./reducers/NotificationAction";

import { IP } from "./Constants";
import axios from "axios";

class NotificationItem extends React.Component {
    onPressItem = async () => {
        if(!this.props.data.read) {
            try {
                await axios.post(IP + "/notification/read", {
                    userId: this.props.userId,
                    notId: this.props.data.notId
                }, {
                    headers: { Authorization: this.props.token }
                });
                this.props.setNumberofNotifications(this.props.noNotifications - 1);
            } catch(err) {
                Alert.alert("Error", "Something went wrong...");
            }
        }

        this.props.navigation.navigate("TaskInfo", {
            taskId: this.props.data.taskId
        });
    };

    formatTime = () => {
        const now = new Date();
        const date = new Date(this.props.data.time);

        if(now - date >= 86400000) {
            return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).substring(2)}`;
        }

        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        let hours = date.getHours() % 12;
        hours = hours ? hours : 12;

        return `${String(hours).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")} ${ampm}`;
    };

    render() {
        return (
            <TouchableNativeFeedback onPress={this.onPressItem} disabled={this.props.data.refreshing}>
                <View style={this.props.data.read ? styles.listItemRead : styles.listItem}>
                    <View style={styles.row}>
                        <View style={styles.colLeft}>
                            <Text style={this.props.data.read ? styles.titleRead : styles.title}>{this.props.data.title}</Text>
                        </View>
                        <View style={styles.colRight}>
                            <Text note>{this.formatTime()}</Text>
                        </View>
                    </View>
                    <Text style={styles.message}>{this.props.data.message}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomWidth: 0.5,
        borderColor: "#DDD",
        backgroundColor: "#fff"
    },
    listItemRead: {
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomWidth: 0.5,
        borderColor: "#DDD",
        backgroundColor: "#eee"
    },
    row: {
        flex: 1,
        flexDirection: "row",
        marginLeft: 8,
        marginRight: 8
    },
    colLeft: {
        flex: 1,
        flexGrow: 4
    },
    colRight: {
        flex: 1,
        alignItems: "flex-end"
    },
    title: {
        fontWeight: "bold",
        fontSize: 18
    },
    titleRead: {
        fontSize: 18
    },
    message: {
        marginLeft: 8,
        marginRight: 8
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationItem);