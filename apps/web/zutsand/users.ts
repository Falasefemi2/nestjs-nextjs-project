/** @format */

import { BASE_URL } from "@/lib/root";
import { create } from "zustand";
import axios, { AxiosError } from "axios";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
}

interface ApiError {
  message: string[] | string;
  error: string;
  statusCode: number;
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalUsers: number;

  // Actions
  getAllUsers: (token: string) => Promise<void>;
  getUserById: (id: number, token: string) => Promise<User>;
  getUserByEmail: (email: string, token: string) => Promise<User>;
  updateUser: (
    id: number,
    userData: UpdateUserData,
    token: string
  ) => Promise<User>;
  deleteUser: (id: number, token: string) => Promise<void>;
  clearError: () => void;
  clearCurrentUser: () => void;
}

const handleApiError = (error: unknown): string => {
  let errorMessage = "Operation failed";

  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    if (apiError?.message) {
      if (Array.isArray(apiError.message)) {
        errorMessage = apiError.message.join(", ");
      } else {
        errorMessage = apiError.message;
      }
    } else if (error.response?.status === 403) {
      errorMessage = "Access denied. Admin privileges required.";
    } else if (error.response?.status === 404) {
      errorMessage = "User not found.";
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized. Please login again.";
    }
  }

  return errorMessage;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,

  getAllUsers: async (token: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get<User[]>(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      set({
        users: response.data,
        totalUsers: response.data.length,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
        users: [],
        totalUsers: 0,
      });
      throw error;
    }
  },

  getUserById: async (id: number, token: string): Promise<User> => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get<User>(`${BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      set({
        currentUser: response.data,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
        currentUser: null,
      });
      throw error;
    }
  },

  getUserByEmail: async (email: string, token: string): Promise<User> => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get<User>(
        `${BASE_URL}/users/by-email/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      set({
        currentUser: response.data,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
        currentUser: null,
      });
      throw error;
    }
  },

  updateUser: async (
    id: number,
    userData: UpdateUserData,
    token: string
  ): Promise<User> => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.patch<User>(
        `${BASE_URL}/users/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the user in the users array if it exists
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? response.data : user
        ),
        currentUser:
          state.currentUser?.id === id ? response.data : state.currentUser,
        isLoading: false,
        error: null,
      }));

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id: number, token: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove the user from the users array
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
        totalUsers: state.totalUsers - 1,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentUser: () => {
    set({ currentUser: null });
  },
}));
