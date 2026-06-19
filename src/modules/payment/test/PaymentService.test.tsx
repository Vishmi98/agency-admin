import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { createPayment, getPaymentData } from '../services/payment.services';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getPaymentData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payments retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalPayments: 50,
                payments: [{
                    id: 1,
                    invoiceId: 1,
                    paymentDate: '2023-01-01',
                    amountLkr: 1000,
                    studentId: 1,
                    paymentType: 1,
                    createdBy: 1,
                    invoiceInfo: { id: 1, packageId: 1, packageInfo: { id: 1, title: 'Package 1' } },
                    studentInfo: { id: 1, fullName: 'John Doe', passportNo: '123456789' },
                    staffInfo: { id: 1, fullName: 'Jane Smith' },
                    branchInfo: { title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'Branch 1' }, id: 1 },
                    paymentTypeInfo: { title: { SN: 'Cash', EN: 'Cash', TM: 'Cash' }, id: 1 },
                }]
            }
        });

        const response = await getPaymentData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Payments retrieved successfully!');
        expect(response.payments.length).toBe(1);
        expect(response.payments[0].id).toBe(1);
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getPaymentData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty payment list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No payment found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalPayments: 0,
                payments: []
            }
        });

        const response = await getPaymentData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No payment found');
        expect(response.payments.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching payment data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalPayments: 0,
                payments: []
            }
        });

        const response = await getPaymentData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching payment data');
        expect(response.payments.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getPaymentData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.payments).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payments data retrieved',
            data: {} // Missing payments data
        });

        const response = await getPaymentData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Payments data retrieved');
        expect(response.payments).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payments retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalPayments: 50,
                payments: []
            }
        });

        await getPaymentData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/payment/get-all-details`,
            method: 'POST',
            body: { page: 1, limit: 5, search: '' }
        });
    });
})

describe('createPayment', () => {
    it('should return data on successful payment creation', async () => {
        // Mock successful API response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment created successfully!',
            data: {
                invoiceId: 101,
                paymentDate: '2025-03-20',
                amountUsd: 30,
                amountLkr: 5000,
                paymentType: 1,
                createdBy: 101,
                branchId: 1,
            },
        });

        const body = {
            invoiceId: 101,
            paymentDate: '2025-03-20',
            amountUsd: 30,
            amountLkr: 5000,
            paymentType: 1,
            createdBy: 101,
            branchId: 1,
        };

        const result = await createPayment(body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Payment created successfully!');
        expect(result.data.payment.amountLkr).toBe(5000);
    });

    it('should throw error on API failure', async () => {
        // Mock API failure
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        const body = {
            invoiceId: 101,
            paymentDate: '2025-03-20',
            amountUsd: 30,
            amountLkr: 5000,
            paymentType: 1,
            createdBy: 101,
            branchId: 1,
        };

        try {
            await createPayment(body);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful response from API', async () => {
        // Mock unsuccessful response
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating payment',
            data: {},
        });

        const body = {
            invoiceId: 101,
            paymentDate: '2025-03-20',
            amountUsd: 30,
            amountLkr: 5000,
            paymentType: 1,
            createdBy: 101,
            branchId: 1,
        };

        const result = await createPayment(body);

        // Assertions
        expect(result.success).toBe(false);
        expect(result.message).toBe('Error creating payment');
        expect(result.data.payment).toEqual({});
    });

    it('should handle missing payment data in API response', async () => {
        // Mock response with missing payment data
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment created successfully!',
            data: null,
        });

        const body = {
            invoiceId: 101,
            paymentDate: '2025-03-20',
            amountUsd: 30,
            amountLkr: 5000,
            paymentType: 1,
            createdBy: 101,
            branchId: 1,
        };

        const result = await createPayment(body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Payment created successfully!');
        expect(result.data.payment).toBeNull();
    });

    it('should call apiCall with correct arguments', async () => {
        const body = {
            invoiceId: 101,
            paymentDate: '2025-03-20',
            amountUsd: 30,
            amountLkr: 5000,
            paymentType: 1,
            createdBy: 101,
            branchId: 1,
        };

        // Mock success response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment created successfully!',
            data: { id: 1, amountLkr: 5000 },
        });

        await createPayment(body);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/payment/create`,
            method: 'POST',
            body,
        });
    });
});
