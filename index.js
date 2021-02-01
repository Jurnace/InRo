/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundNotification from "./src/BackgroundNotification";

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask("RNFirebaseBackgroundMessage", () => BackgroundNotification);