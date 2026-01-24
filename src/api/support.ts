import client from './client';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { SupportTicket, SupportMessage } from '@/types/models';

export const supportApi = {
    // List Tickets
    async getTickets(page = 1): Promise<PaginatedResponse<SupportTicket>> {
        const response = await client.get<ApiResponse<PaginatedResponse<SupportTicket>>>(`/user/support?page=${page}`);
        return response.data.data;
    },

    // Get Single Ticket
    async getTicket(id: string): Promise<SupportTicket> {
        const response = await client.get<ApiResponse<SupportTicket>>(`/user/support/${id}`);
        return response.data.data;
    },

    // Create Ticket
    async createTicket(data: {
        subject: string;
        category: string;
        priority: string;
        message: string;
        transaction_id?: string;
    }): Promise<SupportTicket> {
        const response = await client.post<ApiResponse<SupportTicket>>('/user/support', data);
        return response.data.data;
    },

    // Reply
    async replyTicket(id: string, data: { message: string, attachments?: string[] }): Promise<SupportMessage> {
        const response = await client.post<ApiResponse<SupportMessage>>(`/user/support/${id}/reply`, data);
        return response.data.data;
    }
};
