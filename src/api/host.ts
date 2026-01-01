import client from './client';

export const hostApi = {
    async getEvents() {
        const response = await client.get('/user/host/events');
        return response.data;
    },

    async getStats() {
        const response = await client.get('/user/host/stats');
        return response.data;
    },

    async getRecentActivity() {
        const response = await client.get('/user/host/recent-activity');
        return response.data;
    }
};
