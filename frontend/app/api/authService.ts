// The authService API is responsible for handling authentication related API calls, such as
// user registration, login, logout, and token management.

import { api } from './axios';
import * as SecureStore from 'expo-secure-store';


///// Interfaces /////

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
}


///// Auth Functions//////

// Login request
export const login = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>("/login", data);
  await setToken(response.data.token);
  return response.data;
};

// Registration request
export const register = async (data: RegisterRequest) => {
  const response = await api.post<AuthResponse>("/register", data);
  return response.data;
}

//TODO: Add logout function, delete token from storage.


///// Token Management /////

// Store JWT token securely
export const setToken = async (token: string) => {
  await SecureStore.setItemAsync("token", token);
};

// Retrieve JWT token
export const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};