import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { createInvoice, getInvoiceData, updateInvoice } from '../services/invoice.services';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getInvoiceData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoices retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalInvoices: 50,
                invoices: [{
                    id: 1,
                    packageId: 1,
                    invoiceDate: '2023-01-01',
                    extraPayment: [10, 20],
                    totalPrice: 1000,
                    dueAmount: 500,
                    studentId: 1,
                    staffId: 1,
                    exchangeRate: 300,
                    currency: 'USD',
                    branchId: 1,
                    status: 1,
                    packageInfo: { id: 1, title: 'Package 1', price: 1000 },
                    extraPaymentInfo: [
                        { id: 1, title: { SN: 'Extra 1', EN: 'Extra 1', TM: 'Extra 1' }, amount: 10, currency: 'USD' },
                        { id: 2, title: { SN: 'Extra 2', EN: 'Extra 2', TM: 'Extra 2' }, amount: 20, currency: 'USD' },
                    ],
                    studentInfo: { id: 1, firstName: 'John', lastName: 'Doe', phone: '123', email: 'john@doe.com', titleInfo: { title: { SN: 'Mr', EN: 'Mr', TM: 'Mr' }, id: 1 } },
                    staffInfo: { id: 1, firstName: 'Jane', lastName: 'Smith' },
                    branchInfo: { id: 1, title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'Branch 1' } },
                    paymentInfo: [{ id: 1, paymentDate: '2023-01-02', amountLkr: 500 }],
                    statusInfo: { id: 1, title: { SN: 'Paid', EN: 'Paid', TM: 'Paid' }, color: 'green' },
                }]
            }
        });

        const response = await getInvoiceData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Invoices retrieved successfully!');
        expect(response.invoices.length).toBe(1);
        expect(response.invoices[0].id).toBe(1);
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getInvoiceData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty invoice list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No invoice found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalInvoices: 0,
                invoices: []
            }
        });

        const response = await getInvoiceData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No invoice found');
        expect(response.invoices.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching invoice data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalInvoices: 0,
                invoices: []
            }
        });

        const response = await getInvoiceData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching invoice data');
        expect(response.invoices.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getInvoiceData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.invoices).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoice data retrieved',
            data: {} // Missing invoice data
        });

        const response = await getInvoiceData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Invoice data retrieved');
        expect(response.invoices).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoices retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalInvoices: 50,
                invoices: []
            }
        });

        await getInvoiceData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/invoice/get-all-details`,
            method: 'POST',
            body: { page: 1, limit: 5, search: '' }
        });
    });
})

describe('createInvoice', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoice created successfully!',
            data: {
                id: 1,
                packageId: 101,
                invoiceDate: '2025-03-20',
                extraPayment: [100, 50],
                totalPrice: 2500,
                studentId: 123,
                staffId: 456,
                selectedExtraPayment: '50',
                exchangeRate: 185.5,
                currency: 'LKR',
                branchId: 789,
                status: 'Pending',
            },
        });

        const body = {
            id: 1,
            packageId: 101,
            invoiceDate: '2025-03-20',
            extraPayment: [100, 50],
            totalPrice: 2500,
            studentId: 123,
            staffId: 456,
            selectedExtraPayment: '50',
            exchangeRate: 185.5,
        };

        const result = await createInvoice(body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Invoice created successfully!');
        expect(result.data.invoice.id).toBe(1);
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            const body = {
                id: 1,
                packageId: 101,
                invoiceDate: '2025-03-20',
                extraPayment: [100, 50],
                totalPrice: 2500,
                studentId: 123,
                staffId: 456,
                selectedExtraPayment: '50',
                exchangeRate: 185.5,
            };
            await createInvoice(body);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating invoice',
            data: {},
        });

        const body = {
            id: 1,
            packageId: 101,
            invoiceDate: '2025-03-20',
            extraPayment: [100, 50],
            totalPrice: 2500,
            studentId: 123,
            staffId: 456,
            selectedExtraPayment: '50',
            exchangeRate: 185.5,
        };
        // Call the function
        const response = await createInvoice(body);

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error creating invoice');
        expect(response.data.invoice).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoice created successfully!',
            data: null,
        });

        const body = {
            id: 1,
            packageId: 101,
            invoiceDate: '2025-03-20',
            extraPayment: [100, 50],
            totalPrice: 2500,
            studentId: 123,
            staffId: 456,
            selectedExtraPayment: '50',
            exchangeRate: 185.5,
        };
        // Call the function
        const response = await createInvoice(body);

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Invoice created successfully!');
        expect(response.data.invoice).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoice created successfully!',
            data: {
                id: 1,
                packageId: 101,
                invoiceDate: '2025-03-20',
                extraPayment: [100, 50],
                totalPrice: 2500,
                studentId: 123,
                staffId: 456,
                selectedExtraPayment: '50',
                exchangeRate: 185.5,
                currency: 'LKR',
                branchId: 789,
                status: 'Pending',
            },
        });

        const body = {
            id: 1,
            packageId: 101,
            invoiceDate: '2025-03-20',
            extraPayment: [100, 50],
            totalPrice: 2500,
            studentId: 123,
            staffId: 456,
            selectedExtraPayment: '50',
            exchangeRate: 185.5,
        };
        // Call the function
        await createInvoice(body);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/invoice/create`,
            method: 'POST',
            body: {
                id: 1,
                packageId: 101,
                invoiceDate: '2025-03-20',
                extraPayment: [100, 50],
                totalPrice: 2500,
                studentId: 123,
                staffId: 456,
                selectedExtraPayment: '50',
                exchangeRate: 185.5,
            },
        });
    });
});

describe('updateInvoice', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoice updated successfully!',
            data: {
                id: 1,
                packageId: 101,
                invoiceDate: '2025-03-20',
                extraPayment: [100, 50],
                totalPrice: 2500,
                studentId: 123,
                staffId: 456,
                selectedExtraPayment: '50',
                exchangeRate: 185.5,
                currency: 'LKR',
                branchId: 789,
                status: 'Updated',
            },
        });

        const body = {
            due: 500,
            id: 1,
            newPaymentType: [100, 50],
            total: 3000,
        };

        const result = await updateInvoice(body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Invoice updated successfully!');
        expect(result.data.invoice.id).toBe(1);
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            const body = {
                due: 500,
                id: 1,
                newPaymentType: [100, 50],
                total: 3000,
            };
            await updateInvoice(body);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error updating invoice',
            data: {},
        });

        const body = {
            due: 500,
            id: 1,
            newPaymentType: [100, 50],
            total: 3000,
        };

        // Call the function
        const response = await updateInvoice(body);

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error updating invoice');
        expect(response.data.invoice).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoice updated successfully!',
            data: null,
        });

        const body = {
            due: 500,
            id: 1,
            newPaymentType: [100, 50],
            total: 3000,
        };

        // Call the function
        const response = await updateInvoice(body);

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Invoice updated successfully!');
        expect(response.data.invoice).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Invoice updated successfully!',
            data: {
                id: 1,
                packageId: 101,
                invoiceDate: '2025-03-20',
                extraPayment: [100, 50],
                totalPrice: 2500,
                studentId: 123,
                staffId: 456,
                selectedExtraPayment: '50',
                exchangeRate: 185.5,
                currency: 'LKR',
                branchId: 789,
                status: 'Updated',
            },
        });

        const body = {
            due: 500,
            id: 1,
            newPaymentType: [100, 50],
            total: 3000,
        };

        // Call the function
        await updateInvoice(body);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/invoice/update`,
            method: 'POST',
            body: {
                due: 500,
                id: 1,
                newPaymentType: [100, 50],
                total: 3000,
            },
        });
    });
});
