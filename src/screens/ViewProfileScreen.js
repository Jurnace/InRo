import React from "react";

import { StyleSheet, Alert, Linking } from "react-native";
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Text, Spinner, Thumbnail } from "native-base";
import Stars from "react-native-stars";

import { connect } from "react-redux";

import { IP } from "../Constants";
import axios from "axios";

class ViewProfileScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: null
        };
    }

    async componentDidMount() {
        try {
            const response = await axios.post(IP + "/user/info", {
                userId: this.props.navigation.state.params.userId
            }, {
                headers: {
                    Authorization: this.props.token,
                }
            });

            if(response.status === 200) {
                this.setState({ userInfo: response.data });
            } else {
                Alert.alert("Error", "Unable to retrive user information.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrive user information. Check your internet connection and try again later.");
        }
    };

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressContact = async () => {
        await Linking.openURL("sms:" + this.state.userInfo.phone);
    };

    render() {
        if(!this.state.userInfo) {
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

        const avatarPath = this.state.userInfo.avatar ? { uri: IP + "/assets/" + this.state.userInfo.avatar } : require("../assets/default_avatar.png");

        return (
            <Container>
                <Header>
                    <Left>
                        <Button onPress={this.onPressBack} transparent rounded>
                            <Icon name="md-arrow-back" />
                        </Button>
                    </Left>
                    <Body style={styles.body}>
                        <Title>{this.state.userInfo.username + "'s "}Profile</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Thumbnail style={styles.avatar} large source={avatarPath} />
                    <Text style={styles.name} numberOfLines={1}>{this.state.userInfo.username}</Text>
                    <Stars display={this.state.userInfo.rating} spacing={8} count={5} starSize={25} disabled={this.state.userInfo.rating === 0} fullStar={require("../assets/starFilled.png")} emptyStar={require("../assets/starEmpty.png")} halfStar={require("../assets/starHalf.png")} />
                    <Text style={styles.rating}>{this.state.userInfo.rating} out of {this.state.userInfo.totalRatingsNo} ratings</Text>
                    <Text style={styles.shortDescription}>{this.state.userInfo.shortDescription}</Text>
                    <Text style={styles.description}>{this.state.userInfo.description}</Text>
                    {this.props.navigation.state.params.showNumber ? <Text style={styles.phone}>{"Contact information: " + this.state.userInfo.phone}</Text> : null}
                    {this.props.navigation.state.params.showNumber ? <Button style={styles.btn} onPress={this.onPressContact} info block><Text uppercase={false}>Contact this person</Text></Button> : null}
                </Content>
            </Container>
        );
    };
}

const styles = StyleSheet.create({
    content: {
        marginLeft: 7,
        marginRight: 7
    },
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
    },
    description: {
        marginTop: 10,
        marginBottom: 12,
    },
    phone: {
        marginBottom: 12
    },
    body: {
        flex: 2
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
        token: state.authReducer.token
    };
};

export default connect(mapStateToProps)(ViewProfileScreen);