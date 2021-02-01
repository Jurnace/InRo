import React from "react";
import { StyleSheet, Modal, Alert, View, Linking } from "react-native";
import { Container, Header, Left, Right, Body, Button, Icon, Title, Content, Text, Spinner, Item, Input, Textarea } from "native-base";
import TaskPerson from "../TaskPerson";

import { connect } from "react-redux";

import { IP } from "../Constants";
import axios from "axios";

import { getName } from "../TaskHelper";


class TaskInfoScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            done: false,
            loading: false,
            taskInfo: null,
            userInfos: []
        };
    }

    async componentDidMount() {
        await this.loadData();
    }

    loadData = async () => {
        try {
            const response = await axios.post(IP + "/task/info", {
                taskId: this.props.navigation.state.params.taskId
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                const userInfos = [];

                const responseInfo = await axios.post(IP + "/user/info", {
                    userId: response.data.ownerId
                }, {
                    headers: { Authorization: this.props.token }
                });

                userInfos[response.data.ownerId] = responseInfo.data;

                for(user of response.data.accepted) {
                    const responseI = await axios.post(IP + "/user/info", {
                        userId: user
                    }, {
                        headers: { Authorization: this.props.token }
                    });

                    userInfos[user] = responseI.data;
                }

                for(user of response.data.applied) {
                    const responseI = await axios.post(IP + "/user/info", {
                        userId: user
                    }, {
                        headers: { Authorization: this.props.token }
                    });

                    userInfos[user] = responseI.data;
                }

                for(user of response.data.rejected) {
                    const responseI = await axios.post(IP + "/user/info", {
                        userId: user
                    }, {
                        headers: { Authorization: this.props.token }
                    });

                    userInfos[user] = responseI.data;
                }

                for(user of response.data.completed) {
                    const responseI = await axios.post(IP + "/user/info", {
                        userId: user
                    }, {
                        headers: { Authorization: this.props.token }
                    });

                    userInfos[user] = responseI.data;
                }

                this.setState({
                    done: true,
                    taskInfo: response.data,
                    userInfos: userInfos
                });
            } else {
                Alert.alert("Error", "Unable to retrieve task information.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrive task information. Check your internet connection and try again later.");
        }
    };

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressDelete = () => {
        Alert.alert("Delete this task", "Are you sure you want to delete this task?", [{
            text: "No",
        }, {
            "text": "Yes",
            onPress: async () => {
                this.setState({ loading: true });
                try {
                    const response = await axios.post(IP + "/task/remove", {
                        taskId: this.state.taskInfo.taskId,
                        userId: this.props.userId
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });

                    if(response.status === 200) {
                        this.props.navigation.goBack();
                    } else {
                        Alert.alert("Error", "Unable to delete this task.");
                    }
                } catch(err) {
                    Alert.alert("Error", "Unable to delete this task. Check your internet connection and try again later.");
                }
            }
        }], { cancelable: false });
    };

    onPressApply = () => {
        Alert.alert("Apply for this task", "Are you sure you want to apply for this task?", [{
            text: "No",
        }, {
            "text": "Yes",
            onPress: async () => {
                this.setState({ loading: true });
                try {
                    const response = await axios.post(IP + "/task/apply", {
                        taskId: this.state.taskInfo.taskId,
                        userId: this.props.userId
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });

                    if(response.status === 200) {
                        await this.loadData();
                        this.setState({ loading: false });
                    } else {
                        Alert.alert("Error", "Unable to apply for this task.");
                    }
                } catch(err) {
                    Alert.alert("Error", "Unable to apply for this task. Check your internet connection and try again later.");
                }
            }
        }], { cancelable: false });
    };

    onPressComplete = () => {
        Alert.alert("Task completed", "Are you sure you want set this task as completed?", [{
            text: "No",
        }, {
            "text": "Yes",
            onPress: async () => {
                this.setState({ loading: true });
                try {
                    const response = await axios.post(IP + "/task/completed", {
                        taskId: this.state.taskInfo.taskId,
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });

                    if(response.status === 200) {
                        await this.loadData();
                        this.setState({ loading: false });
                    } else {
                        Alert.alert("Error", "Unable to set this task as completed.");
                    }
                } catch(err) {
                    Alert.alert("Error", "Unable to set this task as completed. Check your internet connection and try again later.");
                }
            }
        }], { cancelable: false });
    };

    onPressContact = async () => {
        await Linking.openURL("sms:" + this.state.userInfos[this.state.taskInfo.ownerId].phone);
    };

    onPressRate = () => {
        this.props.navigation.navigate("Rating", {
            taskId: this.state.taskInfo.taskId,
            targetId: this.state.taskInfo.ownerId
        });
    };

    onPressLocation = async () => {
        if(this.state.taskInfo.address) {
            await Linking.openURL("geo:0,0?q=" + this.state.taskInfo.location + ", " + this.state.taskInfo.address);
        } else {
            await Linking.openURL("geo:0,0?q=" + this.state.taskInfo.location);
        }
    };

    render() {
        if (!this.state.done) {
            return (
                <Container>
                    <Header>
                        <Left>
                            <Button onPress={this.onPressBack} transparent rounded>
                                <Icon name="md-arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Loading...</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content>
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Content>
                </Container>
            );
        }

        let comp = null;
        if(this.state.taskInfo.ownerId === this.props.userId) {
            let sectionApplied = (
                <View style={styles.empty}>
                    <Text style={styles.textEmpty}>List is empty</Text>
                </View>
            );

            let sectionAccepted = (
                <View style={styles.empty}>
                    <Text style={styles.textEmpty}>List is empty</Text>
                </View>
            );

            let sectionRejected = (
                <View style={styles.empty}>
                    <Text style={styles.textEmpty}>List is empty</Text>
                </View>
            );

            let sectionCompleted = (
                <View style={styles.empty}>
                    <Text style={styles.textEmpty}>List is empty</Text>
                </View>
            );

            if(this.state.taskInfo.applied.length) {
                sectionApplied = this.state.taskInfo.applied.map(item => {
                    return <TaskPerson title="Applied person" userInfo={this.state.userInfos[item]} taskId={this.state.taskInfo.taskId} refresh={this.loadData} navigation={this.props.navigation} key={this.state.userInfos[item].userId + "ap"} />;
                });
            }

            if(this.state.taskInfo.accepted.length) {
                sectionAccepted = this.state.taskInfo.accepted.map(item => {
                    return <TaskPerson title="Accepted person" userInfo={this.state.userInfos[item]} taskId={this.state.taskInfo.taskId} refresh={this.loadData} navigation={this.props.navigation} key={this.state.userInfos[item].userId + "ac"}  />;
                });
            }

            if(this.state.taskInfo.rejected.length) {
                sectionRejected = this.state.taskInfo.rejected.map(item => {
                    return <TaskPerson title="Rejected person" userInfo={this.state.userInfos[item]} taskId={this.state.taskInfo.taskId} refresh={this.loadData} navigation={this.props.navigation} key={this.state.userInfos[item].userId + "re"} />;
                });
            }

            if(this.state.taskInfo.completed.length) {
                sectionCompleted = this.state.taskInfo.completed.map(item => {
                    return <TaskPerson title="Completed person" userInfo={this.state.userInfos[item]} taskId={this.state.taskInfo.taskId} refresh={this.loadData} navigation={this.props.navigation} key={this.state.userInfos[item].userId + "co"} taskInfo={this.state.taskInfo} />;
                });
            }

            if(!this.state.taskInfo.isCompleted) {
                const disabled = this.state.taskInfo.accepted.length > 0 || this.state.taskInfo.completed > 0;
                const btnCompleted = this.state.taskInfo.completed.length > 1 && this.state.taskInfo.accepted.length === 0 ? <Button style={styles.btn} onPress={this.onPressComplete} block warning><Text>Task Completed</Text></Button> : null;

                let status = null;
                if(new Date(this.state.taskInfo.expire) <= new Date()) {
                    status = <Button style={styles.btn} block disabled><Text>Status: Expired</Text></Button>;
                }

                if(this.state.taskInfo.isCompleted) {
                    status = <Button style={styles.btn} block disabled><Text>Status: Completed</Text></Button>
                }

                comp = (
                    <View>
                        <View style={styles.header}>
                            <Text>Applied person</Text>
                        </View>
                        {sectionApplied}
                        <View style={styles.header}>
                            <Text>Accepted person</Text>
                        </View>
                        {sectionAccepted}
                        <View style={styles.header}>
                            <Text>Rejected person</Text>
                        </View>
                        {sectionRejected}
                        <View style={styles.header}>
                            <Text>Completed person</Text>
                        </View>
                        {sectionCompleted}

                        {disabled ? null : <Button style={styles.btn} onPress={this.onPressDelete} block danger><Text>Delete this task</Text></Button>}
                        {btnCompleted}
                        {status}
                    </View>
                );
            } else {
                comp = (
                    <View>
                        <View style={styles.header}>
                            <Text>Applied person</Text>
                        </View>
                        {sectionApplied}
                        <View style={styles.header}>
                            <Text>Accepted person</Text>
                        </View>
                        {sectionAccepted}
                        <View style={styles.header}>
                            <Text>Rejected person</Text>
                        </View>
                        {sectionRejected}
                        <View style={styles.header}>
                            <Text>Completed person</Text>
                        </View>
                        {sectionCompleted}
                        <Button style={styles.btn} block warning disabled><Text>Task is completed</Text></Button>
                    </View>
                );
            }
        } else {
            let btn = null;
            let btnContact = null;
            let btnRating = null;
            if(this.state.taskInfo.rejected.includes(this.props.userId)) {
                btn = <Button style={styles.btn} disabled block><Text>You are rejected</Text></Button>;
            } else if(this.state.taskInfo.applied.includes(this.props.userId)) {
                btn = <Button style={styles.btn} disabled block><Text>You have applied for this task</Text></Button>;
            } else if(this.state.taskInfo.accepted.includes(this.props.userId)) {
                btn = <Button style={styles.btn} disabled block><Text>You have been accepted for this task</Text></Button>;
                btnContact = <Button style={styles.btn} onPress={this.onPressContact} block><Text>Contact</Text></Button>;
            } else if(this.state.taskInfo.completed.includes(this.props.userId)) {
                btn = <Button style={styles.btn} disabled block><Text>You have completed this task</Text></Button>;
                btnRating = <Button style={styles.btn} onPress={this.onPressRate} block><Text>Rate this user</Text></Button>;
            } else {
                btn = <Button style={styles.btn} onPress={this.onPressApply} block><Text>Apply for this task</Text></Button>;
            }
            comp = (
                <View >
                    <TaskPerson title="Info" userInfo={this.state.userInfos[this.state.taskInfo.ownerId]} navigation={this.props.navigation} />
                    {btn}
                    {btnContact}
                    {btnRating}
                </View>
            );
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <Button onPress={this.onPressBack} transparent rounded>
                            <Icon name="md-arrow-back" />
                        </Button>
                    </Left>
                    <Body style={styles.body}>
                        <Title>{this.state.taskInfo.title}</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <Text style={styles.title}>{this.state.taskInfo.title}</Text>
                    <Text style={styles.description}>{this.state.taskInfo.description}</Text>
                    <View style={styles.item}>
                        <Icon style={styles.iconItem} name="md-grid" />
                        <Text style={styles.textItem}>{getName(this.state.taskInfo.category)}</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconItem} name="md-pin" />
                        <Text style={styles.textItemLocation} onPress={this.onPressLocation}>{this.state.taskInfo.location}</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconItem} name="md-time" />
                        <Text style={styles.textItem}>{this.state.taskInfo.time}</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconItem} type="MaterialCommunityIcons" name="cash-usd" />
                        <Text style={styles.textItem}>{this.state.taskInfo.price}</Text>
                    </View>
                    <View style={styles.itemLast}>
                        <Icon style={styles.iconItem} name="md-people" />
                        <Text style={styles.textItem}>{`${this.state.taskInfo.applied.length} applied, ${this.state.taskInfo.accepted.length + this.state.taskInfo.completed.length} accepted, looking for ${this.state.taskInfo.looking}`}</Text>
                    </View>
                    {comp}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 3
    },
    content: {
        padding: 8
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    title: {
        fontWeight: "bold",
        fontSize: 20
    },
    description: {
        fontSize: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
        paddingBottom: 8,
        marginBottom: 8
    },
    item: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5
    },
    itemLast: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 8,
        marginBottom: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
    },
    iconItem: {
        width: 26,
        textAlign: "center",
        alignSelf: "stretch"
    },
    textItem: {
        marginLeft: 3,
        fontSize: 20,
        flex: 1,
        alignSelf: "stretch"
    },
    textItemLocation: {
        marginLeft: 3,
        fontSize: 20,
        flex: 1,
        alignSelf: "stretch",
        textDecorationLine: "underline"
    },
    empty: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 7,
        paddingRight: 7,
        borderBottomWidth: 0.5,
        borderColor: "#DDD",
    },
    textEmpty: {
        textAlign: "center"
    },
    header: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 7,
        paddingRight: 7,
        borderBottomWidth: 0.5,
        borderColor: "#DDD",
    },
    btn: {
        marginTop: 8
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

export default connect(mapStateToProps)(TaskInfoScreen);
