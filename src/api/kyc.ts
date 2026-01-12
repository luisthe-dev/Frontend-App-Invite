import client from './client';

export const kycApi = {
    async getWidgetConfig() {
        const response = await client.get('/user/kyc/config');
        return response.data;
    },

    async handleVerificationSuccess(data: any) {
        const response = await client.post('/user/kyc/success', data);
        return response.data;
    }
};
