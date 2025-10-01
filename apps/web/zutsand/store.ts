/** @format */

import { BASE_URL } from "@/lib/root";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios, { AxiosError } from "axios";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  access_token: string;
}

interface ApiError {
  message: string[] | string;
  error: string;
  statusCode: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post<AuthResponse>(
            `${BASE_URL}/auth/login`,
            credentials,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = response.data;

          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          let errorMessage = "Login failed";

          if (error instanceof AxiosError) {
            const apiError = error.response?.data as ApiError;
            if (apiError?.message) {
              if (Array.isArray(apiError.message)) {
                errorMessage = apiError.message.join(", ");
              } else {
                errorMessage = apiError.message;
              }
            }
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post<AuthResponse>(
            `${BASE_URL}/auth/register`,
            credentials,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = response.data;

          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          let errorMessage = "Signup failed";

          if (error instanceof AxiosError) {
            const apiError = error.response?.data as ApiError;
            if (apiError?.message) {
              if (Array.isArray(apiError.message)) {
                errorMessage = apiError.message.join(", ");
              } else {
                errorMessage = apiError.message;
              }
            }
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = response.data;
          set({ token: data.access_token });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
