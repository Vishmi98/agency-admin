import '@testing-library/jest-dom';

import { getStaffData, getTitles } from '../services/staff.services';
import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getTitles', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Titles retrieved successfully!',
            data: {
                titles: [
                    { id: 1, title: { EN: 'Mr.', TM: 'Mr.', SN: 'Mr.' } },
                ],
            },
        });

        // Call the function
        const response = await getTitles();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Titles retrieved successfully!');
        expect(response.titles.length).toBe(1);
        expect(response.titles[0].title.EN).toBe('Mr.');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getTitles();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no titles in the response', async () => {
        // Mock the apiCall response with no titles
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Titles retrieved successfully!',
            data: {
                titles: [],  // Empty array for titles
            },
        });

        // Call the function
        const response = await getTitles();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Titles retrieved successfully!');
        expect(response.titles.length).toBe(0);  // No countries
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching titles',
            data: {
                titles: [],
            },
        });

        // Call the function
        const response = await getTitles();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching titles');
        expect(response.titles.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Titles retrieved successfully!',
            data: {
                titles: [
                    { id: 1, title: { EN: 'Mr.', TM: 'Mr.' } },
                ],
            },
        });

        // Call the function
        const response = await getTitles();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Titles retrieved successfully!');
        expect(response.titles.length).toBe(1);
        expect(response.titles[0].title.EN).toBe('Mr.');
        expect(response.titles[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No titles found',
            data: {},  // No countries data
        });

        // Call the function
        const response = await getTitles();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No titles found');
        expect(response.titles).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Titles retrieved successfully!',
            data: {
                titles: [
                    { id: 1, title: { EN: 'Mr.', TM: 'Mr.', SN: 'Mr.' } },
                ],
            },
        });

        // Call the function
        await getTitles();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/title/get-all`,
            method: 'POST',
        });
    });
})

describe('getStaffData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Staffs retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalStaffs: 50,
                staffs: [
                    {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        isVerify: true,
                        email: 'john.doe@example.com',
                        isPublish: true,
                        roll: 1,
                        title: 1,
                        nic: '123456789V',
                        gender: 1,
                        isEmailVerify: true,
                        isMobileVerify: true,
                        eduction: [],
                        experience: [],
                        fullName: 'John Doe',
                        cvPath: '',
                        cvPathId: '',
                        address: '123 Main St',
                        titleInfo: { title: { EN: 'Mr.', SN: 'Mr.', TM: 'Mr.' }, id: 1 },
                        genderInfo: { title: { EN: 'Male', SN: 'Male', TM: 'Male' }, id: 1 }
                    }
                ]
            }
        });

        const response = await getStaffData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Staffs retrieved successfully!');
        expect(response.staffs.length).toBe(1);
        expect(response.staffs[0].firstName).toBe('John');
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getStaffData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty staff list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No staff found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalStaffs: 0,
                staffs: []
            }
        });

        const response = await getStaffData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No staff found');
        expect(response.staffs.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching staff data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalStaffs: 0,
                staffs: []
            }
        });

        const response = await getStaffData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching staff data');
        expect(response.staffs.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getStaffData(1, 5);

        expect(response.success).toBe(false); 
        expect(response.message).toBeDefined();
        expect(response.staffs).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Staff data retrieved',
            data: {} // Missing staff data
        });

        const response = await getStaffData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Staff data retrieved');
        expect(response.staffs).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Staffs retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalStaffs: 50,
                staffs: []
            }
        });

        await getStaffData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/staff/get-all`,
            method: 'POST',
            body: { page: 1, limit: 5, search: "" }
        });
    });
})