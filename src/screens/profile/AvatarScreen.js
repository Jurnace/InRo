import React from "react";

import { StyleSheet, Modal, Alert, ToastAndroid } from "react-native";
import { Container, Header, Left, Right, Body, Button, Icon, Title, Content, Text, Spinner, Thumbnail } from "native-base";
import DocumentPicker from "react-native-document-picker";

import RNFS from "react-native-fs";

import { connect } from "react-redux";

import { IP } from "../../Constants";
import axios from "axios";

class AvatarScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            done: false,
            avatar: "",
            header: "",
            imageChosen: "",
            loading: false,
            btn_disabled: true
        }
    }

    async componentDidMount() {
        try {
            const response = await axios.post(IP + "/user/info", {
                userId: this.props.userId
            }, {
                headers: {
                    Authorization: this.props.token,
                }
            });

            if(response.status === 200) {
                this.setState({
                    done: true,
                    avatar: response.data.avatar
                });
            } else {
                Alert.alert("Error", "Unable to retrieve avatar.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrive avatar. Check your internet connection and try again later.");
        }
    };

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressChoose = () => {
        DocumentPicker.pick({ type: DocumentPicker.types.images }).then(file => {
            RNFS.readFile(file.uri, "base64").then(value => {
                const size = (value.length * (3 / 4)) - 2;

                if(size > 5000000) {
                    Alert.alert("Error", "Image file is too big");
                    return;
                }

                let fileType = "";
                switch(value.charAt(0)) {
                    case "/":
                        fileType = "jpeg";
                        break;
                    case "i":
                        fileType = "png";
                        break;
                    case "R":
                        fileType = "gif";
                        break;
                    case "U":
                        fileType = "webp";
                        break;
                }

                this.setState({
                    header: "data:image/" + fileType + ";base64,",
                    imageChosen: value,
                    btn_disabled: false
                })
            }).catch(err => {
                this.setState({
                    header: "",
                    imageChosen: "",
                    btn_disabled: true
                });
            });
        }).catch(err => {
            this.setState({
                header: "",
                imageChosen: "",
                btn_disabled: true
            });
        });
    };

    onPressSave = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post(IP + "/user/updateavatar", {
                userId: this.props.userId,
                image: this.state.imageChosen
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                this.props.navigation.goBack();
                ToastAndroid.showWithGravityAndOffset("Your avatar has been updated", ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 200);
            } else {
                Alert.alert("Error", "Unable to set avatar.");
                this.setState({ loading: false });
            }
        } catch(err) {
            Alert.alert("Error", "Unable to set avatar. Check your internet connection and try again later.");
            this.setState({ loading: false });
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
                            <Title>Change Avatar</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content>
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Content>
                </Container>
            );
        }

        let avatarPath = "";
        if(this.state.imageChosen) {
            avatarPath = { uri: this.state.header + this.state.imageChosen };
        } else if(this.state.avatar) {
            avatarPath = { uri: IP + "/assets/" + this.state.avatar };
        } else {
            avatarPath = require("../../assets/default_avatar.png");
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <Button onPress={this.onPressBack} transparent rounded>
                            <Icon name="md-arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Change Avatar</Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <Thumbnail style={styles.avatar} large source={avatarPath} />
                    <Button style={styles.btn} onPress={this.onPressChoose} full><Text>Choose a picture</Text></Button>
                    <Button style={styles.btn} onPress={this.onPressSave} full disabled={this.state.btn_disabled}><Text>Save</Text></Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        padding: 8
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    avatar: {
        marginTop: 10,
        marginBottom: 8,
        width: 125,
        height: 125,
        alignSelf: "center"
    },
    btn: {
        marginTop: 10
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};


export default connect(mapStateToProps)(AvatarScreen);