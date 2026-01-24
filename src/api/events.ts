import client from './client';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Event, EventMedia } from '@/types/models';

export const eventsApi = {
    async getFeatured(): Promise<Event[]> {
        const response = await client.get<ApiResponse<Event[]>>('/events/featured');
        return response.data.data;
    },

    async getAll(params?: any): Promise<PaginatedResponse<Event>> {
        const response = await client.get<ApiResponse<PaginatedResponse<Event>>>('/events', { params });
        return response.data.data;
    },

    async getBySlug(slug: string): Promise<Event> {
        const response = await client.get<ApiResponse<Event>>(`/events/${slug}`);
        return response.data.data;
    },

    async create(data: any): Promise<Event> {
        const isFormData = data instanceof FormData;
        const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
        const response = await client.post<ApiResponse<Event>>('/user/events', data, { headers });
        return response.data.data;
    },

    async update(id: string, data: any): Promise<Event> {
        const response = await client.put<ApiResponse<Event>>(`/user/events/${id}`, data);
        return response.data.data;
    },

    async uploadImage(file: File): Promise<EventMedia> {
        const formData = new FormData();
        formData.append('asset', file);
        formData.append('asset_type', 'image'); 
        
        const response = await client.post<ApiResponse<EventMedia>>('/user/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    async publish(id: string): Promise<{ message: string }> {
        const response = await client.post<ApiResponse<{ message: string }>>(`/user/events/${id}/publish`);
        return response.data.data;
    },

    async delete(id: string): Promise<{ message: string }> {
        const response = await client.delete<ApiResponse<{ message: string }>>(`/user/events/${id}`);
        return response.data.data;
    }
};
