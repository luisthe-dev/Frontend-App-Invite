import client from './client';

export const hostApi = {
    async getEvents(params?: any) {
        const response = await client.get('/user/host/events', { params });
        return response.data;
    },

    async getStats() {
        const response = await client.get('/user/host/stats');
        return response.data;
    },

    async getRecentActivity() {
        const response = await client.get('/user/host/recent-activity');
        return response.data;
    },

    async getChart() {
        const response = await client.get('/user/host/chart');
        return response.data;
    }
};
