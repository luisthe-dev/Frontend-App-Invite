import client from './client';

export const userApi = {
    async getHistory() {
        const response = await client.get('/user/history');
        return response.data;
    }
};
