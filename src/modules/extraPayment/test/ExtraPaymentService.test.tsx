import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { createExtraPayment, getExtraPaymentData } from '../services/extraPayment.services';
import { CreateExtraPaymentResponseDataType, ExtraPaymentDataType } from '../extraPayment.types';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getExtraPaymentData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Extra payments retrieved successfully!',
            data: {
                extraPayments: [{
                    title: {
                        SN: "Performance Bonus",
                        EN: "Performance Bonus",
                        TM: "Performance Bonus"
                    },
                    id: 1,
                    amount: 500,
                    currency: "USD"
                }]
            }
        });

        const response = await getExtraPaymentData();

        expect(response.success).toBe(true);
        expect(response.message).toBe('Extra payments retrieved successfully!');
        expect(response.extraPayments).toHaveLength(1);
        expect(response.extraPayments[0]).toEqual({
            title: {
                SN: 'Performance Bonus',
                EN: 'Performance Bonus',
                TM: 'Performance Bonus',
            },
            id: 1,
            amount: 500,
            currency: 'USD',
        });
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        await expect(getExtraPaymentData()).rejects.toThrow('API call failed');
    });

    it('should handle empty extraPayments list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No extra payments available',
            data: {
                extraPayments: [],
            },
        });

        const response = await getExtraPaymentData();

        expect(response.success).toBe(true);
        expect(response.message).toBe('No extra payments available');
        expect(response.extraPayments).toEqual([]);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed to fetch extra payments',
            data: {
                extraPayments: []
            },
        });

        const response = await getExtraPaymentData();

        expect(response.success).toBe(false);
        expect(response.message).toBe('Failed to fetch extra payments');
        expect(response.extraPayments.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Response received',
            data: {},
        });

        const response = await getExtraPaymentData();

        expect(response.success).toBe(true);
        expect(response.message).toBe('Response received');
        expect(response.extraPayments).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Response received',
            data: {}
        });

        const response = await getExtraPaymentData();

        expect(response.success).toBe(true);
        expect(response.message).toBe('Response received');
        expect(response.extraPayments).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Extra payments retrieved successfully!',
            data: {
                extraPayments: [],
            },
        });

        await getExtraPaymentData();

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/extra-payment/get-all`,
            method: 'POST',
        });
    });
})

describe("createExtraPayment", () => {
    const mockExtraPaymentData: ExtraPaymentDataType = {
        id: 1,
        title: {
            SN: "Performance Bonus",
            EN: "Performance Bonus",
            TM: "Performance Bonus"
        },
        amount: 500,
        currency: "USD"
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success response when extra payment add successfully", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Extra payment add successfully",
            data: mockExtraPaymentData
        });

        const result: CreateExtraPaymentResponseDataType = await createExtraPayment(mockExtraPaymentData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/extra-payment/create`,
            method: "POST",
            body: mockExtraPaymentData,
        });

        expect(result).toEqual({
            success: true,
            message: "Extra payment add successfully",
            data: {
                extraPayment: mockExtraPaymentData,
            },
        });
    });

    it("should return failure response when extra payment add fails", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "Failed to add extra payment",
            data: null
        });

        const result: CreateExtraPaymentResponseDataType = await createExtraPayment(mockExtraPaymentData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/extra-payment/create`,
            method: "POST",
            body: mockExtraPaymentData,
        });

        expect(result).toEqual({
            success: false,
            message: "Failed to add extra payment",
            data: {
                extraPayment: null,
            },
        });
    });

    it("should handle API call rejection gracefully", async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(createExtraPayment(mockExtraPaymentData)).rejects.toThrow("Network error");
    });

    it("should fail when required fields are missing", async () => {
        const incompleteExtraPaymentData = {
            amount: 1000
        };

        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "All fields are required",
            data: null
        });

        const result: CreateExtraPaymentResponseDataType = await createExtraPayment(incompleteExtraPaymentData as ExtraPaymentDataType);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/extra-payment/create`,
            method: "POST",
            body: incompleteExtraPaymentData,
        });

        expect(result).toEqual({
            success: false,
            message: "All fields are required",
            data: {
                extraPayment: null,
            },
        });
    });

    it("should handle unexpected API response format", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Unexpected response",
            unexpectedField: {}
        });

        const result: CreateExtraPaymentResponseDataType = await createExtraPayment(mockExtraPaymentData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/extra-payment/create`,
            method: "POST",
            body: mockExtraPaymentData,
        });

        expect(result).toEqual({
            success: true,
            message: "Unexpected response",
            data: {
                extraPayment: undefined, // Expecting Attendance field but it's missing
            },
        });
    });
});