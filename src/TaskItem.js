import React from "react";

import { StyleSheet, View, TouchableNativeFeedback } from "react-native";
import { Icon, Text, Thumbnail } from "native-base";

import * as TaskHelper from "./TaskHelper";

export default class TaskItem extends React.Component {
    onPressItem = () => {
        this.props.navigation.navigate("TaskInfo", {
            taskId: this.props.task.taskId
        });
    };

    render() {
        let style = null;
        if(this.props.title === "Created tasks") {
            if(new Date(this.props.task.expire) <= new Date()) {
                style = styles.bgExpire;
            }

            if(this.props.task.isCompleted) {
                style = styles.bgCompleted;
            }
        }

        return (
            <TouchableNativeFeedback onPress={this.onPressItem} disabled={this.props.refreshing}>
                <View style={style}>
                    <View style={styles.listItem}>
                        <View style={styles.row}>
                            <View style={styles.colCategory}>
                                <Thumbnail style={styles.imgCategory} square source={TaskHelper.getImage(this.props.task.category)} />
                                <Text style={styles.textCategory} numberOfLines={1}>{TaskHelper.getName(this.props.task.category)}</Text>
                            </View>
                            <View style={styles.colDescription}>
                                <Text style={styles.textTitle} numberOfLines={1}>{this.props.task.title}</Text>
                                <Text style={styles.textDescription} numberOfLines={3}>{this.props.task.description}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.colLeft}>
                                <View style={styles.item}>
                                    <Icon style={styles.iconItemLeft} name="md-pin" />
                                    <Text style={styles.textItemLeft} numberOfLines={1}>{this.props.task.location + "  "}</Text>
                                </View>
                                <View style={styles.item}>
                                    <Icon style={styles.iconItemLeft} name="md-time" />
                                    <Text style={styles.textItemLeft} numberOfLines={1}>{this.props.task.time + "  "}</Text>
                                </View>
                                <View style={styles.item}>
                                    <Icon style={styles.iconItemLeft} type="MaterialCommunityIcons" name="cash-usd" />
                                    <Text style={styles.textItemLeft} numberOfLines={1}>{this.props.task.price + "  "}</Text>
                                </View>
                            </View>
                            <View style={styles.colRight}>
                                <View style={styles.item}>
                                    <Text style={styles.textItemRight1}>Looking for {this.props.task.looking}</Text>
                                    <Icon style={styles.iconItemRight} name="md-people" />
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.textItemRight1}>{this.props.task.applied.length}</Text>
                                    <Icon style={styles.iconItemRight} name="md-people" />
                                    <Text style={styles.textItemRight2}>applied</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.textItemRight1}>{this.props.task.accepted.length + this.props.task.completed.length}</Text>
                                    <Icon style={styles.iconItemRight} name="md-people" />
                                    <Text style={styles.textItemRight2}>accepted</Text>
                                </View>
                            </View>
                        </View>
                    </View>
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
        borderColor: "#DDD"
    },
    row: {
        flex: 1,
        flexDirection: "row",
        marginLeft: 8,
        marginRight: 8
    },
    colCategory: {
        flex: 1,
        alignItems: "flex-start",
        flexGrow: 1,
    },
    colDescription: {
        flex: 1,
        flexGrow: 3
    },
    textCategory: {
        marginTop: 8,
        fontSize: 13,
        marginLeft: -8,
        textAlign: "center",
        alignSelf: "stretch"
    },
    imgCategory: {
        alignSelf: "center"
    },
    textTitle: {
        textAlign: "left",
        alignSelf: "stretch",
        fontWeight: "bold"
    },
    textDescription: {
        textAlign: "left",
        alignSelf: "stretch"
    },
    colLeft: {
        flex: 1,
        flexGrow: 1.4,
        alignItems: "flex-start",
    },
    colRight: {
        flex: 1,
        flexGrow: 1,
        alignItems: "flex-end",
    },
    item: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    iconItemLeft: {
        fontSize: 20,
        width: 20,
        textAlign: "center",
        alignSelf: "stretch",
    },
    iconItemRight: {
        fontSize: 18
    },
    textItemLeft: {
        marginLeft: 3,
        flex: 1,
        alignSelf: "stretch"
    },
    textItemRight1: {
        marginRight: 3
    },
    textItemRight2: {
        marginLeft: 3
    },
    bgCompleted: {
        backgroundColor: "#59FF7A"
    },
    bgExpire: {
        backgroundColor: "#ffffa1"
    }
});