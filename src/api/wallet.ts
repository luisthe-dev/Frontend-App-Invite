import client from './client';

export const walletApi = {
    async getBanks() {
        const response = await client.get('/user/wallet/banks');
        return response.data;
    },

    async resolveAccount(bankCode: string, accountNumber: string) {
        const response = await client.post('/user/wallet/bank/resolve', { 
            bank: bankCode, 
            account_number: accountNumber 
        });
        return response.data;
    },

    async deposit(amount: number) {
        const response = await client.post('/user/wallet/deposit', { amount });
        return response.data;
    },

    async verifyDeposit(reference: string) {
        const response = await client.get(`/user/wallet/deposit/verify?reference=${reference}`);
        return response.data;
    },

    async withdraw(data: {
        amount: number;
        bank_code: string;
        account_number: string;
        account_name: string;
        pin: string;
    }) {
        const response = await client.post('/user/wallet/withdraw', data);
        return response.data;
    }
};
