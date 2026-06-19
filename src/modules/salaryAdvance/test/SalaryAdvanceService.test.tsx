import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { addSalaryAdvance, getSalaryAdvanceData } from '../service/salaryAdvance.service';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getSalaryAdvanceData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Salary advances retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalSalaryAdvance: 50,
                salaryAdvances: [
                    {
                        id: 1,
                        staffId: 1,
                        amount: 1000,
                        date: '2023-01-01',
                        staffInfo: { id: 1, firstName: 'John', lastName: 'Doe' },
                    }
                ]
            }
        });

        const response = await getSalaryAdvanceData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Salary advances retrieved successfully!');
        expect(response.salaryAdvances.length).toBe(1);
        expect(response.salaryAdvances[0].id).toBe(1);
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getSalaryAdvanceData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty salary advance list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No salary advance found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalSalaryAdvance: 0,
                salaryAdvances: []
            }
        });

        const response = await getSalaryAdvanceData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No salary advance found');
        expect(response.salaryAdvances.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching salary advance data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalSalaryAdvance: 0,
                salaryAdvances: []
            }
        });

        const response = await getSalaryAdvanceData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching salary advance data');
        expect(response.salaryAdvances.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getSalaryAdvanceData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.salaryAdvances).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Salary advances data retrieved',
            data: {} // Missing salaryAdvances data
        });

        const response = await getSalaryAdvanceData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Salary advances data retrieved');
        expect(response.salaryAdvances).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Salary advances retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalSalaryAdvance: 50,
                salaryAdvances: []
            }
        });

        await getSalaryAdvanceData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/salary/get-salary-advance`,
            method: 'POST',
            body: { page: 1, limit: 5 }
        });
    });
})

describe('addSalaryAdvance', () => {
    it('should return data on successful salary advance addition', async () => {
        // Mock successful API response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Salary advance added successfully!',
            data: { staffId: 1, amount: 1000 },
        });

        const body = {
            staffId: 1,
            date: '2025-03-20',
            amount: 1000,
        };

        const result = await addSalaryAdvance(body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Salary advance added successfully!');
        expect(result.data.salaryAdvance.amount).toBe(1000);
    });

    it('should throw error on API failure', async () => {
        // Mock API failure
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        const body = {
            staffId: 1,
            date: '2025-03-20',
            amount: 1000,
        };

        try {
            await addSalaryAdvance(body);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful response from API', async () => {
        // Mock unsuccessful response
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error adding salary advance',
            data: {},
        });

        const body = {
            staffId: 1,
            date: '2025-03-20',
            amount: 1000,
        };

        const result = await addSalaryAdvance(body);

        // Assertions
        expect(result.success).toBe(false);
        expect(result.message).toBe('Error adding salary advance');
        expect(result.data.salaryAdvance).toEqual({});
    });

    it('should handle missing salary advance data in API response', async () => {
        // Mock response with missing salary advance data
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Salary advance added successfully!',
            data: null,
        });

        const body = {
            staffId: 1,
            date: '2025-03-20',
            amount: 1000,
        };

        const result = await addSalaryAdvance(body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Salary advance added successfully!');
        expect(result.data.salaryAdvance).toBeNull();
    });

    it('should call apiCall with correct arguments', async () => {
        const body = {
            staffId: 1,
            date: '2025-03-20',
            amount: 1000,
        };

        // Mock success response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Salary advance added successfully!',
            data: { staffId: 1, amount: 1000 },
        });

        await addSalaryAdvance(body);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/salary/add-salary-advance`,
            method: 'POST',
            body,
        });
    });
});
