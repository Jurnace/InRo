const initialState = {
    noNotifications: 0
};

const notificationReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_NOTIFICATIONSNO":
            return {
                ...state,
                noNotifications: action.noNotifications
            };
        default:
            return state;
    }
};

export default notificationReducer;