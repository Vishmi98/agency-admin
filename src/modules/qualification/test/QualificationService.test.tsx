import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { createQualification, getQualificationData } from '../services/qualification.services';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getQualificationData', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Qualifications retrieved successfully!',
            data: {
                qualifications: [
                    { id: 1, title: { EN: 'Ordinary level', TM: 'Ordinary level', SN: 'Ordinary level' } },
                ],
            },
        });

        // Call the function
        const response = await getQualificationData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Qualifications retrieved successfully!');
        expect(response.qualifications.length).toBe(1);
        expect(response.qualifications[0].title.EN).toBe('Ordinary level');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getQualificationData();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no qualifications in the response', async () => {
        // Mock the apiCall response with no qualifications
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Qualifications retrieved successfully!',
            data: {
                qualifications: [],
            },
        });

        // Call the function
        const response = await getQualificationData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Qualifications retrieved successfully!');
        expect(response.qualifications.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching qualifications',
            data: {
                qualifications: [],
            },
        });

        // Call the function
        const response = await getQualificationData();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching qualifications');
        expect(response.qualifications.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Qualifications retrieved successfully!',
            data: {
                qualifications: [
                    { id: 1, title: { EN: 'Ordinary level', TM: 'Ordinary level' } },
                ],
            },
        });

        // Call the function
        const response = await getQualificationData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Qualifications retrieved successfully!');
        expect(response.qualifications.length).toBe(1);
        expect(response.qualifications[0].title.EN).toBe('Ordinary level');
        expect(response.qualifications[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No qualifications found',
            data: {},  // No qualifications data
        });

        // Call the function
        const response = await getQualificationData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No qualifications found');
        expect(response.qualifications).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Qualifications retrieved successfully!',
            data: {
                qualifications: [
                    { id: 1, title: { EN: 'Ordinary level', TM: 'Ordinary level', SN: 'Ordinary level' } },
                ],
            },
        });

        // Call the function
        await getQualificationData();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/qualification/get-all`,
            method: 'POST',
        });
    });
})

describe('createQualification', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Qualification created successfully!',
            data: {
                id: 1,
                title: { EN: 'Diploma', TM: 'Diploma', SN: 'Diploma' },
            },
        });

        // Call the function
        const response = await createQualification('Diploma');

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Qualification created successfully!');
        expect(response.data.qualification.id).toBe(1);
        expect(response.data.qualification.title.EN).toBe('Diploma');
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await createQualification('Diploma');
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating qualification',
            data: {},
        });

        // Call the function
        const response = await createQualification('Diploma');

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error creating qualification');
        expect(response.data.qualification).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Qualification created successfully!',
            data: null,
        });

        // Call the function
        const response = await createQualification('Diploma');

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Qualification created successfully!');
        expect(response.data.qualification).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Qualification created successfully!',
            data: {
                id: 2,
                title: { EN: 'Diploma', TM: 'Diploma', SN: 'Diploma' },
            },
        });

        // Call the function
        await createQualification('Diploma');

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/qualification/create`,
            method: 'POST',
            body: {
                title: {
                    EN: 'Diploma',
                    SN: 'Diploma',
                    TM: 'Diploma',
                },
            },
        });
    });
});
