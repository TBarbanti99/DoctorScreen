
import { Action, Dispatch } from "redux";
import { API } from "../api"
import { persistor } from "../store";

interface ActionInterface {
    userData?  :any,
    toast? : any,
    dispatch? : Dispatch<Action>,
    action?: (data?: any) => Action;
}

// create User
export const signUpUser = ({userData , toast, dispatch , action}:ActionInterface) => {
    return API({
        endPoint: "/user/create",
        method: "POST",
        body: userData,
        isFormData : true,
        toast,
        isToast: true,
        action,
        dispatch : ()=>{},
        isAccount : false,
        isToken : false
    })
};

// login User
export const LoginUser = ({userData , toast, dispatch , action}:ActionInterface) => {
    return API({
        endPoint: "/user/login",
        method: "POST",
        body: userData,
        isFormData : false,
        toast,
        isToast: true,
        action,
        dispatch,
        isAccount : true,
        isHeaders : true,
    })
};

// logout User
export const LogoutUser = async ({toast, dispatch, action}:ActionInterface) => {
    // Clear tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    // Purge all persisted Redux data
    await persistor.purge();
    
    // Dispatch logout action
    if (dispatch && action) {
        dispatch(action({})); // Pass an empty object to satisfy TypeScript
    }
    
    // Show toast if provided
    if (toast) {
        toast.success("Logged out successfully");
    }
    
    return {
        success: true,
        message: "Logged out successfully"
    };
};

// update profile
export const updateProfile = ({userData, toast, dispatch, action}: ActionInterface) => {
    return API({
        endPoint: "/user/update/profile",
        method: "PUT",
        body: userData,
        isFormData: true,
        toast,
        isToast: true,
        action,
        dispatch,
        isHeaders: true,
        isToken: true,
    })
};

// update password
export const updatePassword = ({userData, toast}: ActionInterface) => {
    return API({
        endPoint: "/user/update/password",
        method: "PUT",
        body: userData,
        isFormData: false,
        toast,
        isToast: true,
        isHeaders: true,
        isToken: true
    })
};
