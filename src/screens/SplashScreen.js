import React from "react";

import { Alert } from "react-native";
import Splash from "../Splash";

import { connect } from "react-redux";
import { setToken } from "../reducers/AuthAction"

import axios from "axios";
import { IP } from "../Constants";

class SplashScreen extends React.Component {
    async componentDidMount() {
        axios.defaults.headers.common = {
            "Content-Type": "application/json"
        };
        axios.defaults.timeout = 4000;
        axios.defaults.validateStatus = status => true;

        if(this.props.token) {
            try {
                const response = await axios.get(IP + "/user/auth", {
                    headers: { Authorization: this.props.token + " " + this.props.userId },
                });

                if(response.status === 200) {
                    this.props.navigation.navigate("App");
                } else {
                    this.props.setToken("");
                    this.props.navigation.navigate("Auth");
                }
            } catch(err) {
                Alert.alert("Error", "Server may be down right now. Please try again later");
                this.props.setToken("");
                this.props.navigation.navigate("Auth");
            }
        } else {
            this.props.navigation.navigate("Auth");
        }
    };

    render() {
        return (
            <Splash />
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        userId: state.userIdReducer.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setToken: () => dispatch(setToken())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);