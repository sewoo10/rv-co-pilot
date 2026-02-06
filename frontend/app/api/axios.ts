// this uses axios HTTP library

import axios from "axios";
import { Platform } from "react-native";

// function that gets info of user's device
const baseURL = Platform.OS === "ios"
     ? "http://localhost:5000"      // iOS    
     : "http://10.0.2.2:5000";      // Android

// function that creates a reusable Axios client
export const api = axios.create ({
    baseURL,
    timeout: 10000, 
    headers: {
        "Content-Type": "application/json",
    },
});

// function to handle/simplify Axios error response
// NOTE: the "pages/screen UI" will use this function to catch and display errors
export const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return "Unexpected error";
};
