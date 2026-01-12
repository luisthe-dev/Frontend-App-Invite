import axios from 'axios';
import Cookies from 'js-cookie';

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

client.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors like 401 Unauthorized
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                Cookies.remove('token');
                Cookies.remove('user');
                // Optional: Redirect to login or show modal
                window.location.href = '/signin'; 
            }
        }
        return Promise.reject(error);
    }
);

export default client;
