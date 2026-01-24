import client from './client';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Event, HostStats, HostEventDetails } from '@/types/models';

export const hostApi = {
    async getEvents(params?: any): Promise<PaginatedResponse<Event>> {
        const response = await client.get<ApiResponse<PaginatedResponse<Event>>>('/user/host/events', { params });
        return response.data.data;
    },

    async getEventDetails(id: string): Promise<HostEventDetails> {
        const response = await client.get<ApiResponse<HostEventDetails>>(`/user/host/events/${id}`);
        return response.data.data;
    },

    async getStats(): Promise<HostStats> {
        const response = await client.get<ApiResponse<HostStats>>('/user/host/stats');
        return response.data.data;
    },

    async getRecentActivity(): Promise<any[]> {
        const response = await client.get<ApiResponse<any[]>>('/user/host/recent-activity');
        return response.data.data;
    },

    async getChart(params?: any): Promise<any[]> {
        const response = await client.get<ApiResponse<any[]>>('/user/host/chart', { params });
        return response.data.data;
    },

    async getTrustScore(): Promise<{ score: number; tier: string }> {
        const response = await client.get<ApiResponse<{ score: number; tier: string }>>('/user/host/trust-score');
        return response.data.data;
    },

    async getEventWithdrawalLimit(eventId: string): Promise<{ limit: number; withdrawn: number }> {
        const response = await client.get<ApiResponse<{ limit: number; withdrawn: number }>>(`/user/host/events/${eventId}/withdrawal-limit`);
        return response.data.data;
    },

    async requestWithdrawal(eventId: string, amount: number): Promise<{ message: string }> {
        const response = await client.post<ApiResponse<{ message: string }>>('/user/host/events/withdraw', { event_id: eventId, amount });
        return response.data.data;
    },

    async refundTicket(ticketId: string): Promise<{ message: string }> {
        const response = await client.post<ApiResponse<{ message: string }>>(`/user/host/tickets/${ticketId}/refund`);
        return response.data.data;
    }
};
