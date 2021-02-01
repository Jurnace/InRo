import React from "react";

import { StyleSheet, Modal, Alert, ToastAndroid } from "react-native";
import { Container, Header, Left, Right, Body, Button, Icon, Title, Content, Text, Spinner, Item, Input, Textarea } from "native-base";

import { connect } from "react-redux";

import { IP } from "../../Constants";
import axios from "axios";

class BioScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            done: false,
            shortDescription: "",
            description: "",
            loading: false,
            enableButton: true
        };

        this.refDescription = React.createRef();
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
                    shortDescription: response.data.shortDescription,
                    description: response.data.description
                });
            } else {
                Alert.alert("Error", "Unable to retrieve user bio.");
            }
        } catch(err) {
            Alert.alert("Error", "Unable to retrive user bio. Check your internet connection and try again later.");
        }
    };

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressSave = async () => {
        const shortDescription = this.state.shortDescription.trim();
        const description = this.state.description.trim();

        if(!shortDescription || !description) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.post(IP + "/user/updatebio", {
                userId: this.props.userId,
                shortDescription: shortDescription,
                description: description
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                this.props.navigation.goBack();
                ToastAndroid.showWithGravityAndOffset("Your bio has been updated", ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 200);
            } else {
                Alert.alert("Error", "Unable to save user bio.");
                this.setState({ loading: false });
            }
        } catch(err) {
            Alert.alert("Error", "Unable to save user bio. Check your internet connection and try again later.");
            this.setState({ loading: false });
        }
    };

    onChangeShort = (text) => {
        this.setState({
            shortDescription: text,
            enableButton: text && this.state.description
        });
    };

    onChangeDesc = (text) => {
        this.setState({
            description: text,
            enableButton: text && this.state.shortDescription
        });
    };

    onSubmitShort = () => {
        this.refDescription.current._root.focus();
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
                            <Title>Edit Bio</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content>
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Content>
                </Container>
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
                    <Body>
                        <Title>Edit Bio</Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <Text style={styles.textShort}>Enter short description about yourself. Maximum 100 characters:</Text>
                    <Item fixedLabel>
                        <Input placeholder="Short description" value={this.state.shortDescription} onChangeText={this.onChangeShort} maxLength={100} returnKeyType="next" onSubmitEditing={this.onSubmitShort} blurOnSubmit={false} />
                    </Item>
                    <Text style={styles.textDesc}>Enter detailed description about yourself:</Text>
                    <Textarea style={styles.textArea} placeholder="Description" bordered value={this.state.description} onChangeText={this.onChangeDesc} maxLength={1000} ref={this.refDescription} />
                    <Button style={styles.btn} onPress={this.onPressSave} full disabled={!this.state.enableButton}><Text>Save</Text></Button>
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
    textShort: {
        marginLeft: 7
    },
    textDesc: {
        marginTop: 13,
        marginLeft: 7
    },
    textArea: {
        flex: 1
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

export default connect(mapStateToProps)(BioScreen);