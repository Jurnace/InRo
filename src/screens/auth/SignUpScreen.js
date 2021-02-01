import React from "react";
import { StyleSheet, Image, KeyboardAvoidingView, ScrollView, Alert, Modal, Linking } from "react-native";
import { Container, Header, Left, Button, Body, Icon, Content, Spinner, Item, Input, Text, DatePicker, View } from "native-base";
import DocumentPicker from "react-native-document-picker";

import { connect } from "react-redux";
import { setToken } from "../../reducers/AuthAction"
import { setUserId } from "../../reducers/UserIdAction";

import { IP } from "../../Constants";
import axios from "axios";
import RNFS from "react-native-fs";

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: null,
            imageName: "",
            imagePath: "",
            loading: false,
            showPassword: false,
            enableButton: false,
            name: "",
            username: "",
            email: "",
            password: "",
            phone: ""
        }

        this.refUsername = React.createRef();
        this.refEmail = React.createRef();
        this.refPassword = React.createRef();
        this.refPhone = React.createRef();

        this.date = new Date();
    }

    onPressBack = () => {
        this.props.navigation.goBack();
    };

    onPressSignUp = async () => {
        if(!this.state.name) {
            Alert.alert("Error", "Please enter your full name");
            return;
        }

        if(!this.state.username) {
            Alert.alert("Error", "Please enter your username");
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

        if(!this.state.phone) {
            Alert.alert("Error", "Please enter your phone number");
            return;
        }

        if(!this.state.date) {
            Alert.alert("Error", "Please enter your date of birth");
            return;
        }

        if(!this.state.imageName) {
            Alert.alert("Error", "Please select a picture of your I.C.");
            return;
        }

        if(!/^[a-zA-Z\s]*$/.test(this.state.name)) {
            Alert.alert("Error", "Your full name should contain alphabets only");
            return;
        }

        if(/[^a-zA-Z0-9\.]/.test(this.state.username)) {
            Alert.alert("Error", "Your username should contain alphabets and numbers only");
            return;
        }

        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        const d = new Date(Date.now() - this.state.date);

        const age = Math.abs(d.getUTCFullYear() - 1970);

        if(age < 18) {
            Alert.alert("Error", "You must be 18 and above to use InRo");
            return;
        }

        const base64 = await RNFS.readFile(this.state.imagePath, "base64");
        const size = (base64.length * (3 / 4)) - 2;

        if(size > 5000000) {
            Alert.alert("Error", "Image file is too big");
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.post(IP + "/user/signup", {
                name: this.state.name.trim(),
                username: this.state.username.trim(),
                email: this.state.email.trim().toLowerCase(),
                password: this.state.password,
                phone: this.state.phone,
                dateOfBirth: this.state.date.toUTCString(),
                ic: base64,
                fcmToken: this.props.fcmToken
            });

            if(response.status === 200) {
                this.props.setToken(response.data.token);
                this.props.setUserId(response.data.userId);
                this.props.navigation.navigate("App");
            } else {
                this.setState({ loading: false });
                Alert.alert("Error", response.data.error);
            }
        } catch(err) {
            this.setState({ loading: false });
            Alert.alert("Error", "Unable to sign up. Check your internet connection and try again later.");
        }
    };

    onPressImage = () => {
        DocumentPicker.pick({ type: DocumentPicker.types.images }).then(file => {
            this.setState({
                imageName: file.name,
                imagePath: file.uri,
                enableButton: this.state.name && this.state.username && this.state.email && this.state.password && this.state.phone && this.state.date && file.name
            })
        }).catch(err => {
            this.setState({
                imageName: "",
                imagePath: "",
                enableButton: false
            });
        });
    };

    onPressPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    onPressPolicy = async () => {
        await Linking.openURL(IP + "/assets/policy.html");
    };

    setDate = (newDate) => {
        newDate.setHours(0, 0, 0, 0);

        if(newDate <= this.date) {
            this.setState({
                date: newDate,
                enableButton: this.state.name && this.state.username && this.state.email && this.state.password && this.state.phone && newDate && this.state.imageName
            });
        }
    };

    onChangeName = (text) => {
        this.setState({
            name: text,
            enableButton: text && this.state.username && this.state.email && this.state.password && this.state.phone && this.state.date && this.state.imageName
        });
    };

    onChangeUsername = (text) => {
        this.setState({
            username: text,
            enableButton: this.state.name && text && this.state.email && this.state.password && this.state.phone && this.state.date && this.state.imageName
        });
    };

    onChangeEmail = (text) => {
        this.setState({
            email: text,
            enableButton: this.state.name && this.state.username && text && this.state.password && this.state.phone && this.state.date && this.state.imageName
        });
    };

    onChangePassword = (text) => {
        this.setState({
            password: text,
            enableButton: this.state.name && this.state.username && this.state.email && text && this.state.phone && this.state.date && this.state.imageName
        });
    }

    onChangePhone = (text) => {
        this.setState({
            phone: text,
            enableButton: this.state.name && this.state.username && this.state.email && this.state.password && text && this.state.date && this.state.imageName
        });
    };

    onSubmitName = () => {
        this.refUsername.current._root.focus();
    };

    onSubmitUsername = () => {
        this.refEmail.current._root.focus();
    };

    onSubmitEmail = () => {
        this.refPassword.current._root.focus();
    };

    onSubmitPassword = () => {
        this.refPhone.current._root.focus();
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
                                    <Input placeholder="Full Name" returnKeyType="next" value={this.state.name} onChangeText={this.onChangeName} onSubmitEditing={this.onSubmitName} blurOnSubmit={false} />
                                </Item>
                                <Item fixedLabel>
                                    <Input placeholder="Username" ref={this.refUsername} returnKeyType="next" value={this.state.username} onChangeText={this.onChangeUsername} onSubmitEditing={this.onSubmitUsername} blurOnSubmit={false} />
                                </Item>
                                <Item fixedLabel>
                                    <Input placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" ref={this.refEmail} returnKeyType="next" value={this.state.email} onChangeText={this.onChangeEmail} onSubmitEditing={this.onSubmitEmail} blurOnSubmit={false} />
                                </Item>
                                <Item fixedLabel>
                                    <Input placeholder="Password" secureTextEntry={!this.state.showPassword} keyboardType={this.state.showPassword ? "visible-password" : "default"} ref={this.refPassword} returnKeyType="next" value={this.state.password} onChangeText={this.onChangePassword} onSubmitEditing={this.onSubmitPassword} blurOnSubmit={false} />
                                    <Icon style={this.state.showPassword ? null : styles.icon} onPress={this.onPressPassword} name={this.state.showPassword ? "md-eye-off" : "md-eye"} />
                                </Item>
                                <Item fixedLabel>
                                    <Input placeholder="Phone Number" keyboardType="number-pad" ref={this.refPhone} value={this.state.phone} onChangeText={this.onChangePhone} />
                                </Item>
                            </View>
                            <DatePicker placeHolderTextStyle={styles.datepickerph} textStyle={styles.datepicker} placeHolderText="Select Date of Birth" maximumDate={this.date} onDateChange={this.setDate} formatChosenDate={date => { return "Date of Birth: " + date.toLocaleDateString("en-US")}} />
                            <Button onPress={this.onPressImage} bordered light><Text style={this.state.imageName ? styles.btn_file : styles.btn_file1} uppercase={false}>{this.state.imageName ? "Picture selected: " + this.state.imageName : "Upload a picture of your I.C."}</Text></Button>
                            <Button style={styles.btn} onPress={this.onPressSignUp} block disabled={!this.state.enableButton}><Text>Sign Up</Text></Button>
                            <Text style={styles.text}>By signing up you agree to our <Text style={styles.textU} onPress={this.onPressPolicy}>privacy policy</Text></Text>
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
        marginTop: -10,
        width: 200,
        height: 200,
        alignSelf: "center"
    },
    form: {
        marginTop: 20
    },
    datepickerph: {
        fontSize: 17,
        marginLeft: -4,
        color: "#535C69",
        marginTop: 4,
        marginBottom: 4
    },
    datepicker: {
        fontSize: 17,
        marginLeft: -4,
        marginTop: 4,
        marginBottom: 4
    },
    btn_file: {
        fontSize: 17,
        marginLeft: -10,
        color: "#000",
    },
    btn_file1: {
        fontSize: 17,
        marginLeft: -10,
        color: "#535C69"
    },
    btn: {
        marginTop: 20
    },
    loading: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-around"
    },
    icon: {
        color: "#474747"
    },
    text: {
        marginTop: 10,
        textAlign: "center"
    },
    textU: {
        textDecorationLine: "underline"
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
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);