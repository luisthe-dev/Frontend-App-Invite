import client from './client';
import Cookies from 'js-cookie';

export const authService = {
    async register(userData: any) {
        const payload = {
            ...userData,
            email_address: userData.email, 
        };
        const response = await client.post('/user/signup', payload);
        if (response.data.token) {
            Cookies.set('token', response.data.token, { expires: 30 });
            if (response.data.user) {
                Cookies.set('user', JSON.stringify(response.data.user), { expires: 30 });
            }
        }
        return response.data;
    },

    async login(email: string, password: string) {
        const response = await client.post('/user/signin', { 
            email_address: email,
            password,
            recognized: false
        });
        if (response.data.token) {
            Cookies.set('token', response.data.token, { expires: 30 });
             if (response.data.user) {
                Cookies.set('user', JSON.stringify(response.data.user), { expires: 30 });
            }
        }
        return response.data;
    },

    async logout() {
        try {
            await client.post('/logout');
        } catch (error) {
            console.error(error);
        } finally {
            Cookies.remove('token');
            Cookies.remove('user');
        }
    },

    async forgotPassword(email: string) {
         return await client.post('/password/forgot', { email_address: email });
    },

    verifyToken: async (token: string, email: string | null) => {
        return await client.post('/user/token', { one_time_token: token, email });
    },

    async resetPassword(token: string, email: string | null, newPassword: string) {
        return await client.post('/user/token', { one_time_token: token, email, new_password: newPassword });
    },
    
    socialLogin(provider: string) {
        if (typeof window !== 'undefined') {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
            window.location.href = `${baseUrl}/auth/${provider}/redirect`;
        }
    },

    getCurrentUser() {
        if (typeof window !== 'undefined') {
            const userStr = Cookies.get('user');
            if (userStr) return JSON.parse(userStr);
        }
        return null;
    },

    isAuthenticated() {
        if (typeof window !== 'undefined') {
             return !!Cookies.get('token');
        }
        return false;
    }
};
