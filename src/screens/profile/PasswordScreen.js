import React from "react";

import { StyleSheet, Modal, Alert } from "react-native";
import { Container, Header, Left, Body, Button, Icon, Title, Content, Text, Spinner, Item, Input } from "native-base";

import { connect } from "react-redux";

import { IP } from "../../Constants";
import axios from "axios";

class PasswordScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPassword: "",
            newPassword: "",
            loading: false,
            showPassword: false,
            enableButton: false
        };

        this.refNewPassword = React.createRef();
    }

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressSave = async (keyboard) => {
        if(keyboard && !this.state.currentPassword && !this.state.newPassword) {
            return;
        }

        if(!this.state.currentPassword || !this.state.newPassword) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.post(IP + "/user/updatepassword", {
                userId: this.props.userId,
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword
            }, {
                headers: { Authorization: this.props.token }
            });

            if(response.status === 200) {
                Alert.alert("Success", "Your password has been changed");
                this.props.navigation.goBack();
            } else {
                Alert.alert("Error", response.data.error);
                this.setState({ loading: false });
            }
        } catch(err) {
            Alert.alert("Error", "Unable to change password. Check your internet connection and try again later.");
            this.setState({ loading: false });
        }
    };

    onPressPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    onChangeCurrent = (text) => {
        this.setState({
            currentPassword: text,
            enableButton: text && this.state.newPassword
        });
    };

    onChangeNew = (text) => {
        this.setState({
            newPassword: text,
            enableButton: text && this.state.currentPassword
        });
    };

    onSubmitCurrent = () => {
        this.refNewPassword.current._root.focus();
    };

    onSubmitNew = () => {
        this.onPressSave(true);
    };

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button onPress={this.onPressBack} transparent rounded>
                            <Icon name="md-arrow-back" />
                        </Button>
                    </Left>
                    <Body style={styles.body}>
                        <Title>Change Password</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={styles.content}>
                    <Modal visible={this.state.loading} transparent animationType="fade">
                        <Spinner style={styles.loading} size="large" color="blue" />
                    </Modal>
                    <Item fixedLabel>
                        <Input placeholder="Current Password" value={this.state.currentPassword} secureTextEntry autoFocus onChangeText={this.onChangeCurrent} returnKeyType="next" onSubmitEditing={this.onSubmitCurrent} blurOnSubmit={false} />
                    </Item>
                    <Item fixedLabel>
                        <Input placeholder="New Password" value={this.state.newPassword} secureTextEntry={!this.state.showPassword} keyboardType={this.state.showPassword ? "visible-password" : "default"} onChangeText={this.onChangeNew} ref={this.refNewPassword} returnKeyType="go" onSubmitEditing={this.onSubmitNew} />
                        <Icon style={this.state.showPassword ? null : styles.icon} onPress={this.onPressPassword} name={this.state.showPassword ? "md-eye-off" : "md-eye"} />
                    </Item>

                    <Button style={styles.btn} onPress={this.onPressSave} block disabled={!this.state.enableButton}><Text>Save</Text></Button>
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
    }
});

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

export default connect(mapStateToProps)(PasswordScreen);