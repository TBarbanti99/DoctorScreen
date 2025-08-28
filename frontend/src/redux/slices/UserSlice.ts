import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user : {},
        isAuthenticated : false,
    },
    reducers: {
        // signup user
        signUpUserAction: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },

        // login
        loginUpUserAction: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },

        // logout
        logoutUserAction: (state, _action) => {
            state.user = {};
            state.isAuthenticated = false;
        },

        // update profile
        updateProfileAction: (state, action) => {
            state.user = action.payload.updatedUser;
        },
    },
});

export const {
    signUpUserAction, 
    loginUpUserAction, 
    logoutUserAction,
    updateProfileAction
} = userSlice.actions;
export const userReducer = userSlice.reducer;
