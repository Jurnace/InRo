import firebase from "react-native-firebase";

/**
 * @param {import("react-native-firebase/messaging").RemoteMessage} message
 */

export default async (message) => {
    const not = new firebase.notifications.Notification().setTitle(message.data.title).setBody(message.data.body).android.setChannelId(message.data.channelId).android.setSmallIcon("ic_notification").android.setAutoCancel(true).android.setPriority(firebase.notifications.Android.Priority.High).android.setDefaults(firebase.notifications.Android.Defaults.All).android.setWhen(Number(message.data.when)).android.setShowWhen(true);

    await firebase.notifications().displayNotification(not);

    return Promise.resolve();
}