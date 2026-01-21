import client from './client';

export interface SupportTicket {
    id: string;
    subject: string;
    status: 'open' | 'agent_reply' | 'customer_reply' | 'closed' | 'resolved';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'general' | 'billing' | 'technical' | 'dispute';
    transaction_id?: string;
    created_at: string;
    updated_at: string;
    messages_count?: number;
}

export interface SupportMessage {
    id: string;
    message: string;
    user_id: number;
    is_admin: boolean;
    created_at: string;
    user?: {
        first_name: string;
        last_name: string;
        avatar?: string;
    };
}

export const supportApi = {
    // List Tickets
    getTickets: async (page = 1) => {
        const response = await client.get(`/user/support?page=${page}`);
        return response.data;
    },

    // Get Single Ticket
    getTicket: async (id: string) => {
        const response = await client.get(`/user/support/${id}`);
        return response.data;
    },

    // Create Ticket
    createTicket: async (data: {
        subject: string;
        category: string;
        priority: string;
        message: string;
        transaction_id?: string;
    }) => {
        const response = await client.post('/user/support', data);
        return response.data;
    },

    // Reply
    replyTicket: async (id: string, data: { message: string, attachments?: string[] }) => {
        const response = await client.post(`/user/support/${id}/reply`, data);
        return response.data;
    }
};
