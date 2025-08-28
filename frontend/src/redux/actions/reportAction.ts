





import { Action, Dispatch } from "redux";
import { API } from "../api"



interface ActionInterface {
    formData?  :any,
    toast : any,
    dispatch? : Dispatch<Action>,
    action?: (data: any) => Action;
}





// create report
export const createReport = ({formData , toast,}:ActionInterface) => {
    return API({
        endPoint: "/reports/create",
        method: "POST",
        body: formData,
        isFormData : true,
        toast,
        isToast: true,
    })
};


// report list
export const getReportList = ({toast,}:ActionInterface) => {
    return API({
        method: "GET",
        body: {},
        isFormData : false,
        toast,
        isToast: false,
        isToken : true,
        isHeaders : true,
        endPoint: "/reports/list",
        
    })
};

// update report status
export const updateReportStatus = ({toast,formData}:ActionInterface) => {
    return API({
        method: "POST",
        body: formData,
        isFormData : false,
        toast,
        isToast: true,
        isToken : true,
        isHeaders : true,
        endPoint: "/reports/update/status", 
    })
};


// send report on email
export const sendReportOnEmail = ({toast,formData}:ActionInterface) => {
    return API({
        method: "POST",
        body: formData,
        isFormData : false,
        toast,
        isToast: true,
        isToken : true,
        isHeaders : true,
        endPoint: "/reports/send/email", 
    })
}