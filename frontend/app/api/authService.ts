// The authService API is responsible for handling authentication related API calls, such as
// user registration, login, logout, and token management.

import { api } from './axios'
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";



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

export interface TokenPayload {
  user_id: number;
  exp: number;
}

///// Auth Functions//////

// Login request
export const login = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>("/login", data)
  await setToken(response.data.token)
  return response.data;
};

// Registration request
export const register = async (data: RegisterRequest) => {
  const response = await api.post<AuthResponse>("/register", data)
  await setToken(response.data.token)
  return response.data;
}

// Get current user ID from token
export const getCurrentUserId = async () => {
  const token = await SecureStore.getItemAsync("token")

  if (!token) return null

  const decoded = jwtDecode<TokenPayload>(token);
  return decoded.user_id
};


///// Token Management /////

// Store JWT token securely
export const setToken = async (token: string) => {
  await SecureStore.setItemAsync("token", token)
};

// Retrieve JWT token
export const getToken = async () => {
  return await SecureStore.getItemAsync("token")
};