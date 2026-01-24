import client from './client';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { User, Transaction, Ticket, PurchasedTicket } from '@/types/models';

export const userApi = {
    async getUser(): Promise<User> {
        const response = await client.get<ApiResponse<User>>('/user');
        return response.data.data;
    },
    async getHistory(params?: any): Promise<PaginatedResponse<Transaction>> {
        const response = await client.get<ApiResponse<PaginatedResponse<Transaction>>>('/user/history', { params });
        return response.data.data;
    },

    async getTickets(params?: any): Promise<PaginatedResponse<PurchasedTicket>> {
        const response = await client.get<ApiResponse<PaginatedResponse<PurchasedTicket>>>('/user/tickets', { params });
        return response.data.data;
    },

    async updateProfile(data: any): Promise<User> {
        const response = await client.put<ApiResponse<User>>('/user', data);
        return response.data.data;
    },

    async updatePin(data: any): Promise<{ message: string }> {
        const response = await client.post<ApiResponse<{ message: string }>>('/user/pin/update', data);
        return response.data.data;
    }
};
