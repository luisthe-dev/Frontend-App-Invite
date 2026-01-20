import adminClient from "./adminClient";

export const adminApi = {
  login: async (credentials: any) => {
    const response = await adminClient.post("/admin/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await adminClient.post("/admin/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await adminClient.get("/admin/me");
    return response.data;
  },

  getStats: async () => {
    const response = await adminClient.get("/admin/stats");
    return response.data;
  },

  // Events
  getEvents: async (params?: any) => {
    const response = await adminClient.get("/admin/events", { params });
    return response.data;
  },
  getEvent: async (id: string) => {
    const response = await adminClient.get(`/admin/events/${id}`);
    return response.data;
  },
  approveEvent: async (id: string) => {
    const response = await adminClient.post(`/admin/events/${id}/approve`);
    return response.data;
  },
  rejectEvent: async (id: string) => {
    const response = await adminClient.post(`/admin/events/${id}/reject`);
    return response.data;
  },
  deleteEvent: async (id: string) => {
    const response = await adminClient.delete(`/admin/events/${id}`);
    return response.data;
  },

  // Tickets
  restockTicket: async (id: string, quantity: number) => {
    const response = await adminClient.post(`/admin/tickets/${id}/restock`, {
      quantity,
    });
    return response.data;
  },
  updateTicket: async (id: string, data: any) => {
    const response = await adminClient.put(`/admin/tickets/${id}`, data);
    return response.data;
  },

  // Users
  getUsers: async (params?: any) => {
    const response = await adminClient.get("/admin/users", { params });
    return response.data;
  },
  getUser: async (id: string) => {
    const response = await adminClient.get(`/admin/users/${id}`);
    return response.data;
  },
  getUserEvents: async (id: string, params?: any) => {
    const response = await adminClient.get(`/admin/users/${id}/events`, {
      params,
    });
    return response.data;
  },

  // Finance
  getFinanceStats: async () => {
    const response = await adminClient.get("/admin/finance/stats");
    return response.data;
  },
  getPayouts: async (params?: any) => {
    const response = await adminClient.get("/admin/finance/payouts", {
      params,
    });
    return response.data;
  },
  getTransactions: async (params?: any) => {
    const response = await adminClient.get("/admin/finance/transactions", {
      params,
    });
    return response.data;
  },
  processPayout: async (id: string) => {
    const response = await adminClient.post(
      `/admin/finance/payouts/${id}/process`,
    );
    return response.data;
  },
  rejectPayout: async (id: string) => {
    const response = await adminClient.post(
      `/admin/finance/payouts/${id}/reject`,
    );
    return response.data;
  },
};
