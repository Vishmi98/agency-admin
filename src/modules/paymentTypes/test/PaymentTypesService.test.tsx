import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { createPaymentTypeSliderData, getPaymentTypes } from '../services/paymentTypes.services';
import { URL } from '@/constants/config';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getPaymentTypes', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment types retrieved successfully!',
            data: {
                paymentTypes: [
                    { id: 1, title: { EN: 'Registration', TM: 'Registration', SN: 'Registration' } },
                ],
            },
        });

        // Call the function
        const response = await getPaymentTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Payment types retrieved successfully!');
        expect(response.paymentTypes.length).toBe(1);
        expect(response.paymentTypes[0].title.EN).toBe('Registration');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getPaymentTypes();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no payment types in the response', async () => {
        // Mock the apiCall response with no payment types
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment types retrieved successfully!',
            data: {
                paymentTypes: [],
            },
        });

        // Call the function
        const response = await getPaymentTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Payment types retrieved successfully!');
        expect(response.paymentTypes.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching payment types',
            data: {
                paymentTypes: [],
            },
        });

        // Call the function
        const response = await getPaymentTypes();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching payment types');
        expect(response.paymentTypes.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment types retrieved successfully!',
            data: {
                paymentTypes: [
                    { id: 1, title: { EN: 'Registration', TM: 'Registration' } },
                ],
            },
        });

        // Call the function
        const response = await getPaymentTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Payment types retrieved successfully!');
        expect(response.paymentTypes.length).toBe(1);
        expect(response.paymentTypes[0].title.EN).toBe('Registration');
        expect(response.paymentTypes[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No payment types found',
            data: {},  // No paymentTypes data
        });

        // Call the function
        const response = await getPaymentTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No payment types found');
        expect(response.paymentTypes).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment types retrieved successfully!',
            data: {
                paymentTypes: [
                    { id: 1, title: { EN: 'Registration', TM: 'Registration', SN: 'Registration' } },
                ],
            },
        });

        // Call the function
        await getPaymentTypes();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/payment-type/get-all`,
            method: 'POST',
            isAuth: true
        });
    });
})

describe('createPaymentTypeSliderData', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment type created successfully!',
            data: {
                id: 1,
                title: { EN: 'Registration payment', TM: 'Registration payment', SN: 'Registration payment' },
            },
        });

        // Call the function
        const response = await createPaymentTypeSliderData('Registration payment');

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Payment type created successfully!');
        expect(response.data.paymentType.id).toBe(1);
        expect(response.data.paymentType.title.EN).toBe('Registration payment');
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await createPaymentTypeSliderData('Registration payment');
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating paymentType',
            data: {},
        });

        // Call the function
        const response = await createPaymentTypeSliderData('Registration payment');

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error creating paymentType');
        expect(response.data.paymentType).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment type created successfully!',
            data: null,
        });

        // Call the function
        const response = await createPaymentTypeSliderData('Registration payment');

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Payment type created successfully!');
        expect(response.data.paymentType).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Payment type created successfully!',
            data: {
                id: 2,
                title: { EN: 'Registration payment', TM: 'Registration payment', SN: 'Registration payment' },
            },
        });

        // Call the function
        await createPaymentTypeSliderData('Registration payment');

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/payment-type/create`,
            method: 'POST',
            body: {
                title: {
                    EN: 'Registration payment',
                    SN: 'Registration payment',
                    TM: 'Registration payment',
                },
            },
            isAuth: true
        });
    });
});