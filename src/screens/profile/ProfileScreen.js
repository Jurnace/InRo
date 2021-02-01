import React from "react";

import { StyleSheet, Alert, Linking, RefreshControl } from "react-native";
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Text, Spinner, Thumbnail, List, ListItem } from "native-base";
import Stars from "react-native-stars";
import { NavigationEvents } from "react-navigation";

import { connect } from "react-redux";
import { setToken } from "../../reducers/AuthAction";

import { IP, VERSION } from "../../Constants";
import axios from "axios";

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null,
            refreshing: false
        };
    }

    loadData = async () => {
        try {
            const response = await axios.post(IP + "/user/info", {
                userId: this.props.userId
            }, {
                headers: {
                    Authorization: this.props.token,
                }
            });

            if(response.status === 200) {
                this.setState({ userInfo: response.data });
            }
        } catch(err) {
            Alert.alert("Error", "Unable to load profile. Check your internet connection and try again later.");
        }
    };

    onPressLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [{
            text: "No",
            style: "cancel",
        }, {
            text: "Yes",
            onPress: async () => {
                try {
                    await axios.post(IP + "/user/logout", {
                        userId: this.props.userId
                    }, {
                        headers: {
                            Authorization: this.props.token,
                        }
                    });
                    this.props.setToken("");
                    this.props.navigation.navigate("Auth");
                } catch(err) {
                    this.props.setToken("");
                    this.props.navigation.navigate("Auth");
                }
            }
        }]);
    };

    onPressBio = () => {
        this.props.navigation.navigate("PBio");
    };

    onPressAvatar = () => {
        this.props.navigation.navigate("PAvatar");
    };

    onPressPassword = () => {
        this.props.navigation.navigate("PPassword");
    };

    onPressPolicy = async () => {
        await Linking.openURL(IP + "/assets/policy.html");
    };

    onPressAbout = () => {
        Alert.alert("About", `Version: ${VERSION}\n\nDeveloped by:\nJeremy Cheong\nHo Ping\nLau Jun Hong\nLow Kean Yong\nWan Muhammad Syazwan`);
    };

    onPressContact = async () => {
        await Linking.openURL("mailto:support@206.189.40.88.xip.io");
    };

    onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.loadData();
        this.setState({ refreshing: false });
    };

    render() {
        if(!this.state.userInfo) {
            return (
                <Container>
                    <Header noLeft>
                        <Body>
                            <Title>My Profile</Title>
                        </Body>
                        <Right>
                            <Button onPress={this.onPressLogout} transparent>
                                <Icon name="md-log-out" />
                            </Button>
                        </Right>
                    </Header>
                    <Content refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                        <NavigationEvents onDidFocus={this.loadData} />
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Content>
                </Container>
            );
        }

        const avatarPath = this.state.userInfo.avatar ? { uri: IP + "/assets/" + this.state.userInfo.avatar } : require("../../assets/default_avatar.png");

        return (
            <Container>
                <Header noLeft>
                    <Body>
                        <Title>My Profile</Title>
                    </Body>
                    <Right>
                        <Button onPress={this.onPressLogout} transparent rounded>
                            <Icon name="md-log-out" />
                        </Button>
                    </Right>
                </Header>
                <Content refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                    <NavigationEvents onDidFocus={this.loadData} />
                    <Thumbnail style={styles.avatar} large source={avatarPath} />
                    <Text style={styles.name} numberOfLines={1}>{this.state.userInfo.username}</Text>
                    <Stars display={this.state.userInfo.rating} spacing={8} count={5} starSize={25} disabled={this.state.userInfo.rating === 0} fullStar={require("../../assets/starFilled.png")} emptyStar={require("../../assets/starEmpty.png")} halfStar={require("../../assets/starHalf.png")} />
                    <Text style={styles.rating}>{this.state.userInfo.rating} out of {this.state.userInfo.totalRatingsNo} ratings</Text>
                    <Text style={styles.shortDescription}>{this.state.userInfo.shortDescription}</Text>
                    <Text style={styles.description}>{this.state.userInfo.description}</Text>
                    <List style={styles.list}>
                        <ListItem onPress={this.onPressBio} icon last>
                            <Left><Icon name="md-document" /></Left>
                            <Body><Text>Edit Bio</Text></Body>
                            <Right><Icon name="md-arrow-forward" /></Right>
                        </ListItem>
                        <ListItem onPress={this.onPressAvatar} icon last>
                            <Left><Icon name="md-camera" /></Left>
                            <Body><Text>Change Avatar</Text></Body>
                            <Right><Icon name="md-arrow-forward" /></Right>
                        </ListItem>
                        <ListItem onPress={this.onPressPassword} icon last>
                            <Left><Icon name="md-key" /></Left>
                            <Body><Text>Change Password</Text></Body>
                            <Right><Icon name="md-arrow-forward" /></Right>
                        </ListItem>
                        <ListItem onPress={this.onPressPolicy} icon last>
                            <Left><Icon name="md-lock" /></Left>
                            <Body><Text>Privacy Policy</Text></Body>
                            <Right><Icon name="md-arrow-forward" /></Right>
                        </ListItem>
                        <ListItem onPress={this.onPressAbout} icon last>
                            <Left><Icon name="md-information-circle" /></Left>
                            <Body><Text>About InRo</Text></Body>
                            <Right><Icon name="md-arrow-forward" /></Right>
                        </ListItem>
                        <ListItem onPress={this.onPressContact} icon last>
                            <Left><Icon name="md-mail-open" /></Left>
                            <Body><Text>Contact Support</Text></Body>
                            <Right><Icon name="md-arrow-forward" /></Right>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    };
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    avatar: {
        marginTop: 10,
        marginBottom: 1,
        width: 125,
        height: 125,
        alignSelf: "center"
    },
    rating: {
        fontSize: 13,
        alignSelf: "center"
    },
    shortDescription: {
        marginTop: 10,
        alignSelf: "center",
        marginLeft: 7,
        marginRight: 7
    },
    description: {
        marginTop: 10,
        marginBottom: 12,
        marginLeft: 7,
        marginRight: 7
    },
    list: {
        marginLeft: 0,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#DDD"
    },
    name: {
        alignSelf: "center",
        marginLeft: 7,
        marginRight: 7,
        marginBottom: 8
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
        setToken: (token) => dispatch(setToken(token))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);