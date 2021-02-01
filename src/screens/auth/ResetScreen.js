import React from "react";

import { StyleSheet, Modal, Alert, StatusBar } from "react-native";
import { Container, Header, Left, Body, Button, Icon, Title, Content, Text, Spinner, Item, Input } from "native-base";


import { IP } from "../../Constants";
import axios from "axios";

export default class ResetScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            newPassword: "",
            loading: false,
            showPassword: false
        };
    }

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressNext = async () => {
        if(!this.state.email || !this.state.newPassword) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.post(IP + "/user/resetpassword", {
                email: this.state.email,
                newPassword: this.state.newPassword
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                Alert.alert("Success", "Your password has been reset");
                this.props.navigation.goBack();
            } else {
                Alert.alert("Error", response.data.error);
                this.setState({ loading: false });
            }
        } catch(err) {
            Alert.alert("Error", "Unable to reset password. Check your internet connection and try again later.");
            this.setState({ loading: false });
        }
    };

    onPressPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    onChangeEmail = (text) => {
        this.setState({ email: text });
    };

    onChangeNew = (text) => {
        this.setState({ newPassword: text });
    };

    render() {
        return (
            <Container>
                <Header style={styles.header}>
                    <Left>
                        <Button onPress={this.onPressBack} transparent rounded>
                            <Icon name="md-arrow-back" />
                        </Button>
                    </Left>
                    <Body style={styles.body}>
                        <Title>Reset Password</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <Text>Please enter your email address below. An email with a password reset link will be sent to you.</Text>
                    <Item fixedLabel>
                        <Input placeholder="Email address" autoCapitalize="none" value={this.state.email} autoFocus onChangeText={this.onChangeEmail} />
                    </Item>
                    <Item fixedLabel>
                        <Input placeholder="New Password" value={this.state.newPassword} secureTextEntry={!this.state.showPassword} keyboardType={this.state.showPassword ? "visible-password" : "default"} onChangeText={this.onChangeNew} />
                        <Icon style={this.state.showPassword ? null : styles.icon} onPress={this.onPressPassword} name={this.state.showPassword ? "md-eye-off" : "md-eye"} />
                    </Item>

                    <Button style={styles.btn} onPress={this.onPressNext} block><Text>Next</Text></Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 8,
        paddingRight: 8
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    btn: {
        marginTop: 8
    },
    body: {
        flex: 2
    },
    icon: {
        color: "#474747"
    },
    header: {
        paddingTop: StatusBar.currentHeight,
        height: 54 + StatusBar.currentHeight
    }
});