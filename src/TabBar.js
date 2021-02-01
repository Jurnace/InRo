import React from "react";
import { Footer, FooterTab, Button, Badge, Icon, Text } from "native-base";

import { connect } from "react-redux";

class TabBar extends React.Component {
    render() {
        return (
            <Footer>
                <FooterTab>
                    <Button active={this.props.navigation.state.index === 0} onPress={() => this.props.navigation.navigate("Home")}><Icon name="md-home" /></Button>
                    <Button active={this.props.navigation.state.index === 1} onPress={() => this.props.navigation.navigate("Tasks")}><Icon name="md-clipboard" /></Button>
                    <Button active={this.props.navigation.state.index === 2} badge={this.props.noNotifications > 0} onPress={() => this.props.navigation.navigate("Notifications")}>
                        {this.props.noNotifications > 0 ? <Badge><Text>{this.props.noNotifications}</Text></Badge> : null}
                        <Icon name="md-notifications" />
                    </Button>
                    <Button active={this.props.navigation.state.index === 3} onPress={() => this.props.navigation.navigate("Profile")}><Icon name="md-person" /></Button>
                </FooterTab>
            </Footer>
        );
    }
}

const mapStateToProps = state => {
    return {
        noNotifications: state.notificationReducer.noNotifications
    };
};

export default connect(mapStateToProps)(TabBar);