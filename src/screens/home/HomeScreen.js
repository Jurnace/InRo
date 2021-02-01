import React from "react";

import { StyleSheet, View, SectionList, SafeAreaView, Alert, RefreshControl } from "react-native";
import { Container, Content, Header, Item, Icon, Input, Spinner, Picker, Text, Button } from "native-base";
import { NavigationEvents } from "react-navigation";
import TaskItem from "../../TaskItem";

import { connect } from "react-redux";
import { setNumberofNotifications } from "../../reducers/NotificationAction";

import { IP } from "../../Constants";
import axios from "axios";

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            category: 0,
            tasks: [],
            tasksData: [],
            refreshing: false,
            searchTerm: ""
        };
    }

    loadData = async () => {
        try {
            const response = await axios.post(IP + "/task/list", {
                type: 0,
                userId: this.props.userId
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                const tasksData = [{
                    title: "Recommended for you",
                    data: response.data.recommendedList
                }, {
                    title: "All tasks",
                    data: response.data.tasksList
                }];

                const data = JSON.parse(JSON.stringify(tasksData));

                if(this.state.searchTerm) {
                    const newData = data[1].data.filter(d => {
                        return d.title.includes(this.state.searchTerm) || d.description.includes(this.state.searchTerm);
                    });

                    data[1].data = newData;
                }

                if(this.state.category !== 0) {
                    const newData = data[1].data.filter(d => {
                        return d.category === this.state.category;
                    });

                    data[1].data = newData;
                }

                const unreadNot = await axios.post(IP + "/notification/unread", {
                    userId: this.props.userId
                }, {
                    headers: { Authorization: this.props.token }
                });

                this.setState({
                    loading: false,
                    tasks: data,
                    tasksData: tasksData
                });

                if(unreadNot.status === 200) {
                    this.props.setNumberofNotifications(unreadNot.data.unread);
                }
            } else {
                Alert.alert("Error", "Unable to retrieve task list.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrieve task list. Check your internet connection and try again later.");
        }
    };

    onChangeSearch = text => {
        const term = text.trim();
        if(term) {
            const data = JSON.parse(JSON.stringify(this.state.tasksData));
            const newData = data[1].data.filter(d => {
                return d.title.includes(term) || d.description.includes(term);
            });

            data[1].data = newData;

            this.setState({
                tasks: data,
                searchTerm: term
            });
        } else {
            this.setState({
                tasks: this.state.tasksData,
                searchTerm: ""
            });
        }
    }

    onChangeCategory = value => {
        if(value === 0) {
            if(this.state.searchTerm) {
                const data = JSON.parse(JSON.stringify(this.state.tasksData));
                const newData = data[1].data.filter(d => {
                    return d.title.includes(this.state.searchTerm) || d.description.includes(this.state.searchTerm);
                });

                data[1].data = newData;

                this.setState({
                    tasks: data,
                    category: value
                });
            } else {
                this.setState({
                    tasks: this.state.tasksData,
                    category: value
                });
            }
        } else {
            if(this.state.searchTerm) {
                const data = JSON.parse(JSON.stringify(this.state.tasksData));
                const newData = data[1].data.filter(d => {
                    return d.category === value && (d.title.includes(term) || d.description.includes(this.state.searchTerm));
                });

                data[1].data = newData;

                this.setState({
                    tasks: data,
                    category: value
                });
            } else {
                const data = JSON.parse(JSON.stringify(this.state.tasksData));
                const newData = data[1].data.filter(d => {
                    return d.category === value;
                });

                data[1].data = newData;

                this.setState({
                    tasks: data,
                    category: value
                });
            }
        }
    };

    onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.loadData();
        this.setState({ refreshing: false });
    };

    renderHeader = info => {
        if(info.section.title === "Recommended for you") {
            return (
                <View style={styles.title}>
                    <Text>{info.section.title}</Text>
                </View>
            );
        }

        return (
            <View style={styles.pickerView}>
                <Text style={styles.pickerText}>Showing category:</Text>
                <Picker style={styles.picker} mode="dialog" selectedValue={this.state.category} onValueChange={this.onChangeCategory}>
                    <Picker.Item label="All" value={0} />
                    <Picker.Item label="Dispatch" value={1} />
                    <Picker.Item label="Food/Shopping" value={2} />
                    <Picker.Item label="Event Crew" value={3} />
                    <Picker.Item label="Flyering" value={4} />
                    <Picker.Item label="Promoter" value={5} />
                    <Picker.Item label="Academic" value={6} />
                    <Picker.Item label="Daycare" value={7} />
                    <Picker.Item label="Housekeeping" value={8} />
                    <Picker.Item label="Cooking" value={9} />
                </Picker>
            </View>
        );
    };

    renderFooter = info => {
        if(info.section.title === "Recommended for you") {
            if(this.state.tasks[0].data.length === 0) {
                return (
                    <View style={styles.empty}>
                        <Text style={styles.textEmpty}>Recommendation list is empty. Please accept more tasks so that InRo can learn more about you.</Text>
                    </View>
                );
            }
        } else {
            if(this.state.tasks[1].data.length === 0) {
                if(this.state.searchTerm) {
                    return (
                        <View style={styles.empty}>
                            <Text style={styles.textEmpty}>Unable to find task with the keyword: {this.state.searchTerm}</Text>
                        </View>
                    );
                } else {
                    return (
                        <View style={styles.empty}>
                            <Text style={styles.textEmpty}>Tasks list is empty. Come back later for more.</Text>
                        </View>
                    );
                }
            }
        }
    };

    onPressCancel = () => {
        this.onChangeSearch("");
    }

    render() {
        if(this.state.loading) {
            return (
                <Container>
                    <Header searchBar>
                        <Item>
                            <Icon name="md-search" />
                            <Input placeholder="Search" returnKeyType="search" />
                        </Item>
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
                <Header searchBar>
                    <Item fixedLabel>
                        <Icon name="md-search" />
                        <Input placeholder="Search" value={this.state.searchTerm} onChangeText={this.onChangeSearch} returnKeyType="search" />
                        {this.state.searchTerm ? <Button transparent onPress={this.onPressCancel}><Icon name="md-close" /></Button>: null}
                    </Item>
                </Header>
                <SafeAreaView style={styles.content}>
                    <NavigationEvents onDidFocus={this.loadData} />
                    <View style={styles.list}>
                        <SectionList sections={this.state.tasks} keyExtractor={(item, index) => item.taskId.toString() + index} renderItem={item => <TaskItem task={item.item} navigation={this.props.navigation} refreshing={this.state.refreshing} />} renderSectionHeader={this.renderHeader} renderSectionFooter={this.renderFooter} onRefresh={this.onRefresh} refreshing={this.state.refreshing} />
                    </View>
                </SafeAreaView>
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
    list: {
        height: "100%"
    },
    pickerView: {
        paddingLeft: 7,
        paddingRight: 7,
        flex: 1,
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: "#DDD"
    },
    pickerText: {
        flex: 1,
        flexGrow: 1,
        textAlignVertical: "center",
    },
    picker: {
        flex: 1,
        flexGrow: 2
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
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setNumberofNotifications: (noNotification) => dispatch(setNumberofNotifications(noNotification))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);