// this uses axios HTTP library

import axios from "axios";
import { Platform } from "react-native"
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store"

const getAutoDetectedBaseURL = () => {
    const expoHostUri = Constants.expoConfig?.hostUri;
    if (expoHostUri) {
        const host = expoHostUri.split(":")[0];
        return `http://${host}:5000/api`;
    }

    if (Platform.OS === "web") {
        const webHost = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
        return `http://${webHost}:5000/api`;
    }

    return Platform.OS === "android"
        ? "http://10.0.2.2:5000/api"
        : "http://127.0.0.1:5000/api";
};
const baseURL = getAutoDetectedBaseURL();


// function that creates a reusable Axios client
export const api = axios.create ({
    baseURL,
    timeout: 10000, 
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT to requests automatically
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// function to handle/simplify Axios error response
// NOTE: the "pages/screen UI" will use this function to catch and display errors
export const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return "Unexpected error";
};
