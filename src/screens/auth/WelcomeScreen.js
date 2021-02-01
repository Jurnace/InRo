import React from "react";
import { StyleSheet, Image } from "react-native";
import { Container, Content, Button, Text, View} from "native-base";

export default class WelcomeScreen extends React.Component {
    onPressSignUp = () => {
        this.props.navigation.navigate("SignUp");
    };

    onPressLogin = () => {
        this.props.navigation.navigate("Login");
    };

    render() {
        return (
            <Container>
                <Content contentContainerStyle={styles.content}>
                    <View style={styles.logo}>
                        <Text style={styles.welcome}>Welcome</Text>
                        <Image style={styles.img} source={require("../../assets/logo.png")} resizeMode="stretch" />
                        <Text style={styles.text}>Create and Request Tasks</Text>
                    </View>
                    <View style={styles.btn}>
                        <Button style={styles.btn_signup} onPress={this.onPressSignUp} block><Text>Sign Up</Text></Button>
                        <Button onPress={this.onPressLogin} block><Text>Login</Text></Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: "#3993F9",
        flex: 1,
        padding: 10
    },
    welcome: {
        marginTop: 40,
        fontSize: 34
    },
    logo: {
        flex: 1,
        alignItems: "center"
    },
    img: {
        width: 200,
        height: 200,
        marginTop: 40
    },
    text: {
        fontSize: 22
    },
    btn: {
        flex: 1
    },
    btn_signup: {
        marginTop: 80,
        marginBottom: 11
    }
});