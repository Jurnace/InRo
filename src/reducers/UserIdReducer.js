const initialState = {
    userid: ""
};

const userIdReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_USERID":
            return {
                ...state,
                userId: action.userId
            };
        default:
            return state;
    }
};

export default userIdReducer;