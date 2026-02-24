// The userService API is responsible for handling user account related API calls, such as
// getting user information, updating account details.

import { api } from './axios';


///// Interfaces /////

export interface UpdateUserRequest {
    email: string;
    first_name: string;
    last_name: string;
    bio: string; 
}

export interface UserResponse {
  message: string;
}

export interface GetUserResponse {
    first_name: string;
    last_name: string;
    email: string;
    bio: string; 
}


///// User Functions//////

// Update user account details
export const updateUser = async (userId: number, data: UpdateUserRequest) => {
  const response = await api.put<UserResponse>(`api/users/${userId}`, data);
  return response.data;
};

// Get user details
export const getUser = async (userId: number) => {
  const response = await api.get<GetUserResponse>(`api/users/${userId}`);
  return response.data;
};

// Delete user
export const deleteUser = async (userId: number) => {
  const response = await api.delete<UserResponse>(`/users/${userId}`); 
  return response.data;
};
