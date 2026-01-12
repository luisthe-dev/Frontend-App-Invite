import client from './client';

export const userApi = {
    async getUser() {
        const response = await client.get('/user');
        return response.data;
    },
    async getHistory(params?: any) {
        const response = await client.get('/user/history', { params });
        return response.data;
    },

    async updateProfile(data: any) {
        const response = await client.put('/user', data);
        return response.data;
    },

    async updatePin(data: any) {
        const response = await client.post('/user/pin/update', data);
        return response.data;
    }
};
