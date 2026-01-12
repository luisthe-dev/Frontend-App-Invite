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
    },

    async create(data: any) {
        const response = await client.post('/user/events', data);
        return response.data;
    },

    async update(id: string, data: any) {
        const response = await client.put(`/user/events/${id}`, data);
        return response.data;
    },

    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('asset', file);
        formData.append('asset_type', 'image'); 
        
        const response = await client.post('/user/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async publish(id: string) {
        const response = await client.post(`/user/events/${id}/publish`);
        return response.data;
    },

    async delete(id: string) {
        const response = await client.delete(`/user/events/${id}`);
        return response.data;
    }
};
