import React from "react";
import { StyleSheet, Image } from "react-native";
import { Container, Content, View, Spinner } from "native-base";

const Splash = props => {
    return (
        <Container>
            <Content contentContainerStyle={styles.content}>
                <View style={styles.logo}>
                    <Image style={styles.img} source={require("./assets/logo.png")} resizeMode="stretch" />
                    <Spinner color="white" />
                </View>
            </Content>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: "#3993F9",
        flex: 1,
        padding: 10
    },
    logo: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    img: {
        width: 200,
        height: 200
    }
});

export default Splash;