import client from './client';
import Cookies from 'js-cookie';
import { ApiResponse } from '@/types/api';

export const authService = {
  async register(userData: any): Promise<{ access_token: string; UserDetails: any }> {
    const payload = {
      ...userData,
      email_address: userData.email,
    };
    const response = await client.post<ApiResponse<{ access_token: string; UserDetails: any }>>("/user/signup", payload);
    console.log("response", response.data);
    
    // Logic extraction: response.data is ApiResponse
    const data = response.data.data; 

    if (data.access_token) {
      Cookies.set("token", data.access_token, { expires: 30 });
      if (data.UserDetails) {
        Cookies.set("user", JSON.stringify(data.UserDetails), {
          expires: 30,
        });
      }
    }
    return data;
  },

  async login(email: string, password: string): Promise<{ access_token: string; UserDetails: any }> {
    const response = await client.post<ApiResponse<{ access_token: string; UserDetails: any }>>("/user/signin", {
      email_address: email,
      password,
      recognized: true,
    });

    const data = response.data.data;

    if (data.access_token) {
      Cookies.set("token", data.access_token, { expires: 30 });
      if (data.UserDetails) {
        Cookies.set("user", JSON.stringify(data.UserDetails), {
          expires: 30,
        });
      }
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await client.post<ApiResponse<void>>("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      Cookies.remove("token");
      Cookies.remove("user");
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await client.post<ApiResponse<{ message: string }>>("/user/password/forgot", { email_address: email });
    return response.data.data;
  },

  async verifyToken(token: string, email: string | null): Promise<{ message: string; access_token?: string; user?: any }> {
    const response = await client.post<ApiResponse<{ message: string; access_token?: string; user?: any }>>("/user/token", { one_time_token: token, email });
    return response.data.data;
  },

  async resetPassword(
    token: string,
    email: string | null,
    newPassword: string,
  ): Promise<{ message: string }> {
    const response = await client.post<ApiResponse<{ message: string }>>("/user/token", {
      one_time_token: token,
      email,
      new_password: newPassword,
    });
    return response.data.data;
  },

  async resendToken(): Promise<{ message: string }> {
    const response = await client.post<ApiResponse<{ message: string }>>("/user/token/renew");
    return response.data.data;
  },

  async changePassword(passwordData: any): Promise<{ message: string }> {
    const response = await client.post<ApiResponse<{ message: string }>>("/user/password/update", passwordData);
    return response.data.data;
  },

  socialLogin(provider: string) {
    if (typeof window !== "undefined") {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      window.location.href = `${baseUrl}/auth/${provider}/redirect`;
    }
  },

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const userStr = Cookies.get("user");
      if (userStr) return JSON.parse(userStr);
    }
    return null;
  },

  updateUser(user: any) {
    if (typeof window !== "undefined") {
      Cookies.set("user", JSON.stringify(user), { expires: 30 });
    }
  },

  isAuthenticated() {
    if (typeof window !== "undefined") {
      return !!Cookies.get("token");
    }
    return false;
  },
};
