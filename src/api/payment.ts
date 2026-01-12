import client from './client';

export const paymentApi = {
    async initCheckout(data: any) {
        const response = await client.post('/user/checkout/init', data);
        return response.data;
    },

    async verifyTransaction(reference: string) {
        const response = await client.get(`/user/transactions/${reference}`);
        return response.data;
    }
};
