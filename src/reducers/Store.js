import AsyncStorage from "@react-native-community/async-storage";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./RootReducer";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["authReducer", "userIdReducer", "fcmReducer"],
    blacklist: ["notificationReducer"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export {
    store,
    persistor
};