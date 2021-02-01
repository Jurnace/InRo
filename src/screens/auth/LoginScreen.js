import React from "react";

import { StyleSheet, Image, KeyboardAvoidingView, ScrollView, Alert, Modal } from "react-native";
import { Container, Header, Left, Button, Body, Icon, Content, Item, Input, Text, View, Spinner } from "native-base";

import { connect } from "react-redux";
import { setToken } from "../../reducers/AuthAction"
import { setUserId } from "../../reducers/UserIdAction";

import { IP } from "../../Constants";
import axios from "axios";

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.refPassword = React.createRef();

        this.state = {
            loading: false,
            enableButton: false,
            email: "",
            password: ""
        }
    }

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressLogin = async (keyboard) => {
        if(keyboard && !this.state.email && !this.state.password) {
            return;
        }

        if(!this.state.email) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        if(!this.state.password) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.post(IP + "/user/login", {
                email: this.state.email.trim().toLowerCase(),
                password: this.state.password,
                fcmToken: this.props.fcmToken
            });

            if(response.status === 200) {
                this.props.setToken(response.data.token);
                this.props.setUserId(response.data.userId);
                this.props.navigation.navigate("App");
            } else {
                this.setState({ loading: false });
                Alert.alert("Unable to login", response.data.error);
            }
        } catch (err) {
            this.setState({ loading: false });
            Alert.alert("Error", "Unable to login. Check your internet connection and try again later.");
        }
    };

    onPressForgot = () => {
        this.props.navigation.navigate("Reset");
    };

    onChangeEmail = (text) => {
        this.setState({
            email: text,
            enableButton: text && this.state.password
        });
    };

    onChangePassword = (text) => {
        this.setState({
            password: text,
            enableButton: text && this.state.email
        });
    };

    onSubmitEmail = () => {
        this.refPassword.current._root.focus();
    };

    onSubmitPassword = () => {
        this.onPressLogin(true);
    };

    render() {
        return (
            <Container style={styles.container}>
                <Header transparent>
                    <Left>
                        <Button onPress={this.onPressBack} transparent rounded>
                            <Icon name="md-arrow-back" />
                        </Button>
                    </Left>
                    <Body />
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <ScrollView keyboardShouldPersistTaps="always">
                        <KeyboardAvoidingView style={{flex: 1}}>
                            <Image style={styles.img} source={require("../../assets/logo.png")} resizeMode="stretch" />
                            <View style={styles.form}>
                                <Item fixedLabel>
                                    <Input placeholder="Email" keyboardType="email-address" autoCapitalize="none" autoFocus returnKeyType="next" value={this.state.email} onChangeText={this.onChangeEmail} onSubmitEditing={this.onSubmitEmail} blurOnSubmit={false} />
                                </Item>
                                <Item fixedLabel>
                                    <Input placeholder="Password" secureTextEntry ref={this.refPassword} returnKeyType="go" value={this.state.password} onChangeText={this.onChangePassword} onSubmitEditing={this.onSubmitPassword} />
                                </Item>
                            </View>
                            <Button style={styles.btn} onPress={this.onPressLogin} block disabled={!this.state.enableButton}><Text>Login</Text></Button>
                            <Text onPress={this.onPressForgot} style={styles.text}>Forgot Password?</Text>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#3993F9"
    },
    content: {
        flex: 1,
        padding: 10
    },
    img: {
        width: 200,
        height: 200,
        marginTop: 20,
        alignSelf: "center"
    },
    form: {
        marginTop: 20
    },
    btn: {
        marginTop: 20
    },
    text: {
        marginTop: 20,
        alignSelf: "center",
        textDecorationLine: "underline"
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    }
});

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token,
        fcmToken: state.fcmReducer.fcmToken
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setToken: (token) => dispatch(setToken(token)),
        setUserId: (userId) => dispatch(setUserId(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);