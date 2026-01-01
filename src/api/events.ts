import client from './client';

export const eventsApi = {
    async getFeatured() {
        const response = await client.get('/events/featured');
        return response.data;
    },

    async getAll(params?: any) {
        const response = await client.get('/events', { params });
        return response.data;
    },

    async getBySlug(slug: string) {
        const response = await client.get(`/events/${slug}`);
        return response.data;
    }
};
