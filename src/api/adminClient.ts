import axios from 'axios';
import Cookies from 'js-cookie';

const adminClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

adminClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = Cookies.get('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

adminClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle Admin 401 Unauthorized
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                Cookies.remove('admin_token');
                // Avoid infinite reload loops if already on login page
                if (!window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default adminClient;
