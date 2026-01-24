import client from './client';
import { ApiResponse } from '@/types/api';
import { Bank, Transaction } from '@/types/models';

export const walletApi = {
    async getBanks(): Promise<Bank[]> {
        const response = await client.get<ApiResponse<Bank[]>>('/user/wallet/banks');
        return response.data.data;
    },

    async resolveAccount(bankCode: string, accountNumber: string): Promise<{ account_name: string; account_number: string }> {
        const response = await client.post<ApiResponse<{ account_name: string; account_number: string }>>('/user/wallet/bank/resolve', { 
            bank: bankCode, 
            account_number: accountNumber 
        });
        return response.data.data;
    },

    async deposit(amount: number): Promise<{ payment_url: string; reference: string }> {
        const response = await client.post<ApiResponse<{ payment_url: string; reference: string }>>('/user/wallet/deposit', { amount });
        return response.data.data;
    },

    async verifyDeposit(reference: string): Promise<Transaction> {
        const response = await client.get<ApiResponse<Transaction>>(`/user/wallet/deposit/verify?reference=${reference}`);
        return response.data.data;
    },

    async withdraw(data: {
        amount: number;
        bank_code: string;
        account_number: string;
        account_name: string;
        pin: string;
    }): Promise<{ message: string; transaction: Transaction }> {
        const response = await client.post<ApiResponse<{ message: string; transaction: Transaction }>>('/user/wallet/withdraw', data);
        return response.data.data; // Assuming it returns data wrapper. If not, adjust.
    }
};
