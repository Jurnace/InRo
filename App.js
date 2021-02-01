/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import "react-native-gesture-handler";

import React from 'react';

import { Alert } from "react-native";

import { createAppContainer, createSwitchNavigator, NavigationActions } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import SplashScreen from "./src/screens/SplashScreen"

import WelcomeScreen from "./src/screens/auth/WelcomeScreen";
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ResetScreen from "./src/screens/auth/ResetScreen";

import HomeScreen from "./src/screens/home/HomeScreen";

import TasksScreen from "./src/screens/tasks/TasksScreen";
import NewTaskScreen from "./src/screens/tasks/NewTaskScreen";

import NotificationsScreen from "./src/screens/notifications/NotificationsScreen";

import ProfileScreen from "./src/screens/profile/ProfileScreen";
import BioScreen from "./src/screens/profile/BioScreen";
import AvatarScreen from "./src/screens/profile/AvatarScreen";
import PasswordScreen from "./src/screens/profile/PasswordScreen";

import TabBar from "./src/TabBar";
import TaskInfoScreen from "./src/screens/TaskInfoScreen";
import ViewProfileScreen from "./src/screens/ViewProfileScreen";
import RatingScreen from "./src/screens/RatingScreen";

import Splash from "./src/Splash";

import { Provider, connect } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/reducers/Store";

import firebase from "react-native-firebase";

import { setFCMToken } from "./src/reducers/FcmAction";
import { setNumberofNotifications } from "./src/reducers/NotificationAction";

//import { enableScreens } from "react-native-screens";

//enableScreens();

const AuthStack = createStackNavigator({
    Welcome: WelcomeScreen,
    Login: LoginScreen,
    SignUp: SignUpScreen,
    Reset: ResetScreen
}, {
    headerMode: "none"
});

const HomeStack = createStackNavigator({
    HHome: HomeScreen,
    TaskInfo: TaskInfoScreen,
    ViewProfile: ViewProfileScreen,
    Rating: RatingScreen
}, {
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
        tabBarVisible: !(navigation.state.index > 0)
    })
});

const TasksStack = createStackNavigator({
    TTasks: TasksScreen,
    TaskInfo: TaskInfoScreen,
    TNewTask: NewTaskScreen,
    ViewProfile: ViewProfileScreen,
    Rating: RatingScreen
}, {
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
        tabBarVisible: !(navigation.state.index > 0)
    })
});

const NotificationsStack = createStackNavigator({
    NNotifications: NotificationsScreen,
    TaskInfo: TaskInfoScreen,
    ViewProfile: ViewProfileScreen,
    Rating: RatingScreen
}, {
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
        tabBarVisible: !(navigation.state.index > 0)
    })
});

const ProfileStack = createStackNavigator({
    PProfile: ProfileScreen,
    PBio: BioScreen,
    PAvatar: AvatarScreen,
    PPassword: PasswordScreen
}, {
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
        //tabBarVisible: navigation.state.routes[navigation.state.index].routeName === "PBio" ? false : true
        tabBarVisible: !(navigation.state.index > 0)
    })
});

const TabNavigator = createBottomTabNavigator({
    Home: HomeStack,
    Tasks: TasksStack,
    Notifications: NotificationsStack,
    Profile: ProfileStack
}, {
    tabBarComponent: TabBar,
    initialRouteName: "Home"
});

const Navigation = createAppContainer(createSwitchNavigator({
    Splash: SplashScreen,
    Auth: AuthStack,
    App: TabNavigator
}, {
    initialRouteName: "Splash"
}));

class Listener extends React.Component {
    constructor(props) {
        super(props);

        this.state = { done: false };
    }

    async componentDidMount() {
        await this.checkPermission();

        const channelApplied = new firebase.notifications.Android.Channel("channel_applied", "Applied Tasks", firebase.notifications.Android.Importance.Max);
        const channelApproved = new firebase.notifications.Android.Channel("channel_approved", "Approved Tasks", firebase.notifications.Android.Importance.Max);
        const channelRejected = new firebase.notifications.Android.Channel("channel_rejected", "Rejected Tasks", firebase.notifications.Android.Importance.Max);
        const channelCompleted = new firebase.notifications.Android.Channel("channel_completed", "Completed Tasks", firebase.notifications.Android.Importance.Max);
        const channelCancelled = new firebase.notifications.Android.Channel("channel_cancelled", "Cancelled Tasks", firebase.notifications.Android.Importance.Max);

        await firebase.notifications().android.createChannel(channelApplied);
        await firebase.notifications().android.createChannel(channelApproved);
        await firebase.notifications().android.createChannel(channelRejected);
        await firebase.notifications().android.createChannel(channelCompleted);
        await firebase.notifications().android.createChannel(channelCancelled);

        this.messageListener = firebase.messaging().onMessage(message => {
            const not = new firebase.notifications.Notification().setTitle(message._data.title).setBody(message._data.body).android.setChannelId(message._data.channelId).android.setSmallIcon("ic_notification").android.setAutoCancel(true).android.setPriority(firebase.notifications.Android.Priority.High).android.setDefaults(firebase.notifications.Android.Defaults.All).android.setWhen(Number(message._data.when)).android.setShowWhen(true);

            firebase.notifications().displayNotification(not);

            this.props.setNumberofNotifications(this.props.noNotifications + 1);
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => {
            setTimeout(() => {
                if(this.props.token) {
                    this.navigate("Notifications");
                }
            }, 50);
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            setTimeout(() => {
                if(this.props.token) {
                    this.navigate("Notifications");
                }
            }, 50);
        }

        this.setState({ done: true });
    }

    componentWillUnmount() {
        this.messageListener();
        this.notificationOpenedListener();
    }

    checkPermission = async () => {
        const hasPermission = await firebase.messaging().hasPermission();
        if(hasPermission) {
            await this.getToken();
        } else {
            try {
                await firebase.messaging().requestPermission();
                await this.getToken();
            } catch(err) {
                Alert.alert("WARNING", "You need give the permission for InRo to function correctly!");
            }
        }
    };

    getToken = async () => {
        const token = await firebase.messaging().getToken();
        if(token) {
            await this.props.setFCMToken(token);
        } else {
            Alert.alert("ERROR", "Unable to retrive FCM Token!");
        }
    };

    setNavigation = (navigatorRef) => {
        this.navigate = (routeName, params) => {
            navigatorRef.dispatch(
                NavigationActions.navigate({
                  routeName,
                  params,
                })
            );
        };
    }

    render() {
        if(!this.state.done) {
            return <Splash />;
        }

        return <Navigation ref={navigatorRef => {this.setNavigation(navigatorRef)}} />;
    }
}

const mapStateToProps = state => {
    return {
        token: state.authReducer.token,
        fcmToken: state.fcmReducer.fcmToken,
        noNotifications: state.notificationReducer.noNotifications
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setFCMToken: (fcmToken) => dispatch(setFCMToken(fcmToken)),
        setNumberofNotifications: (noNotifications) => dispatch(setNumberofNotifications(noNotifications))
    };
};

const ListenerComponent = connect(mapStateToProps, mapDispatchToProps)(Listener);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={<Splash />} persistor={persistor}>
                    <ListenerComponent />
                </PersistGate>
            </Provider>
        );
    }
}


