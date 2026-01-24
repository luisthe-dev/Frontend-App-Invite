import client from './client';
import { ApiResponse } from '@/types/api';
import { Transaction } from '@/types/models';

export const paymentApi = {
  async initCheckout(
    data: any,
  ): Promise<{ redirect_url: string}> {
    const response = await client.post<
      ApiResponse<{
        redirect_url: string
      }>
    >("/user/checkout/init", data);
    return response.data.data;
  },

  async verifyTransaction(reference: string): Promise<Transaction> {
    const response = await client.get<ApiResponse<Transaction>>(
      `/user/transactions/${reference}`,
    );
    return response.data.data;
  },
};
