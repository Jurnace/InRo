import React from "react";
import { StyleSheet, Modal, Alert } from "react-native";
import { Container, Header, Left, Button, Icon, Body, Title, Content, Spinner, Text, Right, Thumbnail } from "native-base";
import Stars from "react-native-stars";

import { connect } from "react-redux";

import { IP } from "../Constants";
import axios from "axios";

class RatingScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            done: false,
            loading: false,
            rating: null,
            userInfo: null,
            stars: 0
        };
    }

    async componentDidMount() {
        try {
            const response = await axios.post(IP + "/rate/get", {
                userId: this.props.userId,
                taskId: this.props.navigation.state.params.taskId
            }, {
                headers: {
                    Authorization: this.props.token,
                }
            });

            if(response.status === 200) {
                const res = await axios.post(IP + "/user/info", {
                    userId: this.props.navigation.state.params.targetId
                }, {
                    headers: {
                        Authorization: this.props.token,
                    }
                });

                this.setState({
                    done: true,
                    rating: response.data.rating,
                    userInfo: res.data
                });
            } else {
                Alert.alert("Error", "Unable to retrieve rating information.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrieve rating information. Check your internet connection and try again later.");
        }
    }

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressRate = async () => {
        this.setState({ loading: true });
        try {
            const response = await axios.post(IP + "/rate/user", {
                userId: this.props.userId,
                taskId: this.props.navigation.state.params.taskId,
                targetId: this.props.navigation.state.params.targetId,
                rating: this.state.stars
            }, {
                headers: {
                    Authorization: this.props.token,
                }
            });

            if(response.status === 200) {
                Alert.alert("Success", "You have rated this person");
                this.props.navigation.goBack();
            } else {
                Alert.alert("Error", "Unable to submit rating.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to submit rating. Check your internet connection and try again later.");
        }
    };

    render() {
        if(!this.state.done) {
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

        let ratingStars = null;
        let rated = false;
        if(this.state.rating) {
            ratingStars = <Stars display={this.state.rating.rating} spacing={8} count={5} starSize={40} disabled fullStar={require("../assets/starFilled.png")} emptyStar={require("../assets/starEmpty.png")} halfStar={require("../assets/starHalf.png")} />;
            rated = true;
        } else {
            ratingStars = <Stars half default={0.0} update={value => {this.setState({ stars: value})}} spacing={8} count={5} starSize={40} fullStar={require("../assets/starFilled.png")} emptyStar={require("../assets/starEmpty.png")} halfStar={require("../assets/starHalf.png")} />
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
                        <Title>Rate</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <Thumbnail style={styles.avatar} large source={avatarPath} />
                    <Text style={styles.text}>Rating for {this.state.userInfo.username}:</Text>
                    {ratingStars}
                    <Button style={styles.btn} onPress={this.onPressRate} disabled={rated} block><Text>{rated ? "You have rated this person" : "Submit rating"}</Text></Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingTop: 5
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    text: {
        alignSelf: "center",
        fontSize: 20,
        marginBottom: 10
    },
    btn: {
        marginTop: 20
    },
    avatar: {
        marginTop: 10,
        marginBottom: 8,
        width: 125,
        height: 125,
        alignSelf: "center"
    },
    body: {
        flex: 2
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

export default connect(mapStateToProps)(RatingScreen);
