import adminClient from "./adminClient";
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { User, Event, Ticket, Transaction, Category, TrustTier, TrustScoreSetting, AdminStats, AdminFinanceStats, SupportTicket, SupportMessage } from '@/types/models';

export const adminApi = {
  async login(credentials: any): Promise<{ token: string; user: User }> {
    const response = await adminClient.post<ApiResponse<{ token: string; user: User }>>("/admin/login", credentials);
    return response.data.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>("/admin/logout");
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await adminClient.get<ApiResponse<User>>("/admin/me");
    return response.data.data;
  },

  async getStats(): Promise<AdminStats> {
    const response = await adminClient.get<ApiResponse<AdminStats>>("/admin/stats");
    return response.data.data;
  },

  // Events
  // Events
  // Events
  async getEvents(params?: any): Promise<PaginatedResponse<Event>> {
    const response = await adminClient.get<ApiResponse<PaginatedResponse<Event>>>("/admin/events", { params });
    return response.data.data;
  },
  async getEvent(id: string): Promise<Event> {
    const response = await adminClient.get<ApiResponse<Event>>(`/admin/events/${id}`);
    return response.data.data;
  },
  async approveEvent(id: string): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>(`/admin/events/${id}/approve`);
    return response.data.data;
  },
  async rejectEvent(id: string): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>(`/admin/events/${id}/reject`);
    return response.data.data;
  },
  async deleteEvent(id: string): Promise<{ message: string }> {
    const response = await adminClient.delete<ApiResponse<{ message: string }>>(`/admin/events/${id}`);
    return response.data.data;
  },

  // Tickets
  // Tickets
  // Tickets
  async restockTicket(id: string, quantity: number): Promise<Ticket> {
    const response = await adminClient.post<ApiResponse<Ticket>>(`/admin/tickets/${id}/restock`, {
      quantity,
    });
    return response.data.data;
  },
  async updateTicket(id: string, data: any): Promise<Ticket> {
    const response = await adminClient.put<ApiResponse<Ticket>>(`/admin/tickets/${id}`, data);
    return response.data.data;
  },

  // Users
  // Users
  // Users
  async getUsers(params?: any): Promise<PaginatedResponse<User>> {
    const response = await adminClient.get<ApiResponse<PaginatedResponse<User>>>("/admin/users", { params });
    return response.data.data;
  },
  async getUser(id: string): Promise<{ user: User; stats: any }> {
    const response = await adminClient.get<ApiResponse<{ user: User; stats: any }>>(`/admin/users/${id}`);
    return response.data.data;
  },
  async getUserEvents(id: string, params?: any): Promise<PaginatedResponse<Event>> {
    const response = await adminClient.get<ApiResponse<PaginatedResponse<Event>>>(`/admin/users/${id}/events`, {
      params,
    });
    return response.data.data;
  },

  // Finance
  // Finance
  // Finance
  async getFinanceStats(): Promise<AdminFinanceStats> {
    const response = await adminClient.get<ApiResponse<AdminFinanceStats>>("/admin/finance/stats");
    return response.data.data;
  },
  async getPayouts(params?: any): Promise<PaginatedResponse<Transaction>> {
    const response = await adminClient.get<ApiResponse<PaginatedResponse<Transaction>>>("/admin/finance/payouts", {
      params,
    });
    return response.data.data;
  },
  async getTransactions(params?: any): Promise<PaginatedResponse<Transaction>> {
    const response = await adminClient.get<ApiResponse<PaginatedResponse<Transaction>>>("/admin/finance/transactions", {
      params,
    });
    return response.data.data;
  },
  async getTransaction(id: string): Promise<Transaction> {
    const response = await adminClient.get<ApiResponse<Transaction>>(`/admin/finance/transactions/${id}`);
    return response.data.data;
  },
  async processPayout(id: string): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>(
      `/admin/finance/payouts/${id}/process`,
    );
    return response.data.data;
  },
  async rejectPayout(id: string): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>(
      `/admin/finance/payouts/${id}/reject`,
    );
    return response.data.data;
  },

  // Support
  // Support
  // Support
  async getTickets(params?: any): Promise<PaginatedResponse<SupportTicket>> {
    const response = await adminClient.get<ApiResponse<PaginatedResponse<SupportTicket>>>("/admin/support", { params });
    return response.data.data;
  },
  async getTicket(id: string): Promise<SupportTicket> {
    const response = await adminClient.get<ApiResponse<SupportTicket>>(`/admin/support/${id}`);
    return response.data.data;
  },
  async replyTicket(id: string, data: any): Promise<SupportMessage> {
    const response = await adminClient.post<ApiResponse<SupportMessage>>(`/admin/support/${id}/reply`, data);
    return response.data.data;
  },
  async updateTicketStatus(id: string, status: string): Promise<SupportTicket> {
    const response = await adminClient.put<ApiResponse<SupportTicket>>(`/admin/support/${id}/status`, {
      status,
    });
    return response.data.data;
  },
  // Settings - Categories
  // Settings - Categories
  // Settings - Categories
  // Settings - Categories
  async getCategories(): Promise<Category[]> {
    const response = await adminClient.get<ApiResponse<Category[]>>("/admin/settings/categories");
    return response.data.data;
  },
  async createCategory(data: any): Promise<Category> {
    const response = await adminClient.post<ApiResponse<Category>>("/admin/settings/categories", data);
    return response.data.data;
  },
  async updateCategory(id: number, data: any): Promise<Category> {
    const response = await adminClient.put<ApiResponse<Category>>(`/admin/settings/categories/${id}`, data);
    return response.data.data;
  },
  async deleteCategory(id: number): Promise<{ message: string }> {
    const response = await adminClient.delete<ApiResponse<{ message: string }>>(`/admin/settings/categories/${id}`);
    return response.data.data;
  },

  // Settings - Security
  // Settings - Security
  // Settings - Security
  async updatePassword(data: any): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>("/admin/update-password", data);
    return response.data.data;
  },

  // Trust Score
  // Trust Score
  // Trust Score
  async getTrustTiers(): Promise<TrustTier[]> {
    const response = await adminClient.get<ApiResponse<TrustTier[]>>("/admin/trust-tiers");
    return response.data.data;
  },
  async updateTrustTiers(data: any): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>("/admin/trust-tiers", data);
    return response.data.data;
  },
  async createTrustTier(data: any): Promise<TrustTier> {
    const response = await adminClient.post<ApiResponse<TrustTier>>("/admin/trust-tiers/create", data);
    return response.data.data;
  },
  async deleteTrustTier(id: number): Promise<{ message: string }> {
    const response = await adminClient.delete<ApiResponse<{ message: string }>>(`/admin/trust-tiers/${id}`);
    return response.data.data;
  },
  async getTrustScoreSettings(): Promise<TrustScoreSetting[]> {
    const response = await adminClient.get<ApiResponse<TrustScoreSetting[]>>("/admin/trust-score");
    return response.data.data;
  },
  async updateTrustScoreSettings(data: any): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>("/admin/trust-score", data);
    return response.data.data;
  },
  async createTrustScoreSetting(data: any): Promise<TrustScoreSetting> {
    const response = await adminClient.post<ApiResponse<TrustScoreSetting>>("/admin/trust-score/create", data);
    return response.data.data;
  },
  async deleteTrustScoreSetting(key: string): Promise<{ message: string }> {
    const response = await adminClient.delete<ApiResponse<{ message: string }>>(`/admin/trust-score/${key}`);
    return response.data.data;
  },

  // Settings - Config
  // Settings - Config
  // Settings - Config
  async getConfig(): Promise<Record<string, any[]>> { // Flexible return type for now settings map
    const response = await adminClient.get<ApiResponse<Record<string, any[]>>>("/admin/settings/config");
    return response.data.data;
  },
  async updateConfig(data: any): Promise<{ message: string }> {
    const response = await adminClient.post<ApiResponse<{ message: string }>>("/admin/settings/config", data);
    return response.data.data;
  },
};
