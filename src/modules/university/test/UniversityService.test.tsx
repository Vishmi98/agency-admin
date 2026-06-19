import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { createUniversity, getUniversitiesByCountryId, getUniversityData } from '../services/university.services';
import { UniversityType } from '../university.types';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getUniversityData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Universities retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalUniversities: 50,
                universities: [{
                    id: 1,
                    name: 'University of Colombo',
                    address: '123 University St',
                    countryId: 1,
                    staffId: 1,
                    rank: 1,
                    code: 123,
                    phoneNumber: '123-456-7890',
                    university: 'university@example.com',
                    isPublish: true,
                    countryInfo: { title: { SN: 'Sri lanka', EN: 'Sri lanka', TM: 'Sri lanka' }, id: 1 },
                    staffInfo: { id: 1, firstName: 'John', lastName: 'Doe' },
                }]
            }
        });

        const response = await getUniversityData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Universities retrieved successfully!');
        expect(response.universities.length).toBe(1);
        expect(response.universities[0].name).toBe('University of Colombo');
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getUniversityData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty university list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No universities found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalUniversities: 0,
                universities: []
            }
        });

        const response = await getUniversityData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No universities found');
        expect(response.universities.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching university data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalUniversities: 0,
                universities: []
            }
        });

        const response = await getUniversityData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching university data');
        expect(response.universities.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getUniversityData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.universities).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'University data retrieved',
            data: {}
        });

        const response = await getUniversityData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('University data retrieved');
        expect(response.universities).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Universities retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalUniversities: 50,
                universities: []
            }
        });

        await getUniversityData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/university/get-all`,
            method: 'POST',
            body: { page: 1, limit: 5 }
        });
    });
})

describe('createUniversity', () => {
    const mockUniversity: UniversityType = {
        id: 1,
        name: "Test University",
        address: "123 Test Street",
        countryId: "1",
        phoneNumber: "1234567890",
        email: "test@university.com",
        isPublish: true,
        staffId: "10",
        rank: "A",
        code: "U123",
    };

    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'University created successfully!',
            data: {
                university: "",
            },
        });

        // Call the function
        const response = await createUniversity(mockUniversity);

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('University created successfully!');
        expect(response.data.university).toEqual({ university: "" });
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await createUniversity(mockUniversity);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating university',
            data: {},
        });

        // Call the function
        const response = await createUniversity(mockUniversity);

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error creating university');
        expect(response.data.university).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'University created successfully!',
            data: null,
        });

        // Call the function
        const response = await createUniversity(mockUniversity);

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('University created successfully!');
        expect(response.data.university).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'University created successfully!',
            data: {},
        });

        // Call the function
        await createUniversity(mockUniversity);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/university/create`,
            method: 'POST',
            body: mockUniversity,
        });
    });
});

describe('getUniversitiesByCountryId', () => {
    it('should return list of universities on successful response', async () => {
        // Mock successful API response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Universities fetched successfully!',
            data: { universities: [{ id: 1, name: 'University A' }, { id: 2, name: 'University B' }] },
        });

        const countryId = 1;
        const result = await getUniversitiesByCountryId(countryId);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Universities fetched successfully!');
        expect(result.universities).toEqual([{ id: 1, name: 'University A' }, { id: 2, name: 'University B' }]);
    });

    it('should throw error when API fails', async () => {
        // Mock API failure
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        const countryId = 1;

        try {
            await getUniversitiesByCountryId(countryId);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful response from API', async () => {
        // Mock unsuccessful response
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Failed to fetch universities',
            data: { universities: [] },
        });

        const countryId = 1;
        const result = await getUniversitiesByCountryId(countryId);

        // Assertions
        expect(result.success).toBe(false);
        expect(result.message).toBe('Failed to fetch universities');
        expect(result.universities).toEqual([]);
    });

    it('should handle empty universities data', async () => {
        // Mock successful response with no universities
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Universities fetched successfully!',
            data: { universities: [] },
        });

        const countryId = 1;
        const result = await getUniversitiesByCountryId(countryId);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Universities fetched successfully!');
        expect(result.universities).toEqual([]);
    });

    it('should call apiCall with correct arguments', async () => {
        const countryId = 1;

        // Mock success response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Universities fetched successfully!',
            data: { universities: [{ id: 1, name: 'University A' }] },
        });

        await getUniversitiesByCountryId(countryId);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/university/get-by-country-id`,
            method: 'POST',
            body: { countryId },
        });
    });
});
