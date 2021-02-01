const initialState = {
    fcmToken: ""
};

const fcmReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_FCMTOKEN":
            return {
                ...state,
                fcmToken: action.fcmToken
            };
        default:
            return state;
    }
};

export default fcmReducer;