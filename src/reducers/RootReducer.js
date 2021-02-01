import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import userIdReducer from "./UserIdReducer"
import notificationReducer from "./NotificationReducer";
import fcmReducer from "./FcmReducer";

const rootReducer = combineReducers({
    authReducer: authReducer,
    userIdReducer: userIdReducer,
    notificationReducer: notificationReducer,
    fcmReducer: fcmReducer
});

export default rootReducer;