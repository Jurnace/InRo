import React from "react";

import { StyleSheet, View, SectionList, SafeAreaView, Alert, RefreshControl } from "react-native";
import { Container, Content, Header, Spinner, Text, Body, Title, Fab, Icon } from "native-base";
import { NavigationEvents } from "react-navigation";
import TaskItem from "../../TaskItem";

import { connect } from "react-redux";

import { IP } from "../../Constants";
import axios from "axios";

class TasksScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            tasks: [],
            refreshing: false
        };
    }

    loadData = async () => {
        try {
            const response = await axios.post(IP + "/task/list", {
                type: 1,
                userId: this.props.userId
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                const data = [{
                    title: "Active tasks",
                    data: response.data.tasksActive
                }, {
                    title: "Created tasks",
                    data: response.data.tasksCreated
                }, {
                    title: "Applied tasks",
                    data: response.data.tasksApplied
                }, {
                    title: "Completed tasks",
                    data: response.data.tasksCompleted
                }, {
                    title: "Rejected tasks",
                    data: response.data.tasksRejected
                }];

                this.setState({
                    loading: false,
                    tasks: data,
                });
            } else {
                Alert.alert("Error", "Unable to retrive task lists.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrive task lists.");
        }
    };

    onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.loadData();
        this.setState({ refreshing: false });
    };

    renderHeader = info => {
        return (
            <View style={styles.title}>
                <Text>{info.section.title}</Text>
            </View>
        );
    };

    renderFooter = info => {
        if(info.section.data.length === 0) {
            return (
                <View style={styles.empty}>
                    <Text style={styles.textEmpty}>List is empty</Text>
                </View>
            );
        }
    };

    onPressNew = () => {
        this.props.navigation.navigate("TNewTask");
    };

    render() {
        if(this.state.loading) {
            return (
                <Container>
                    <Header noLeft>
                        <Body>
                            <Title>My Tasks</Title>
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
                        <Title>My Tasks</Title>
                    </Body>
                </Header>
                <SafeAreaView style={styles.content}>
                    <NavigationEvents onDidFocus={this.loadData} />
                    <SectionList sections={this.state.tasks} keyExtractor={(item, index) => item.taskId.toString() + index} renderItem={item => <TaskItem task={item.item} navigation={this.props.navigation} refreshing={this.state.refreshing} title={item.section.title} />} renderSectionHeader={this.renderHeader} renderSectionFooter={this.renderFooter} onRefresh={this.onRefresh} refreshing={this.state.refreshing} />
                </SafeAreaView>
                <Fab style={styles.fab} onPress={this.onPressNew}><Icon name="md-add" /></Fab>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 56
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    title: {
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 7,
        paddingRight: 7,
        borderBottomWidth: 0.5,
        borderColor: "#DDD",
    },
    empty: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 7,
        paddingRight: 7,
        borderBottomWidth: 0.5,
        borderColor: "#DDD",
    },
    textEmpty: {
        textAlign: "center"
    },
    fab: {
        backgroundColor: "#5cb85c"
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

export default connect(mapStateToProps)(TasksScreen);