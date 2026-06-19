import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { createCountrySliderData, getCountriesData } from '../services/countries.services';
import { URL } from '@/constants/config';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getCountriesData', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Countries retrieved successfully!',
            data: {
                countries: [
                    { id: 1, title: { EN: 'Sri Lanka', TM: 'Sri Lanka', SN: 'Sri Lanka' } },
                    { id: 2, title: { EN: 'India', TM: 'India', SN: 'India' } },
                ],
            },
        });

        // Call the function
        const response = await getCountriesData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Countries retrieved successfully!');
        expect(response.countries.length).toBe(2);
        expect(response.countries[0].title.EN).toBe('Sri Lanka');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getCountriesData();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no countries in the response', async () => {
        // Mock the apiCall response with no countries
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Countries retrieved successfully!',
            data: {
                countries: [],  // Empty array for countries
            },
        });

        // Call the function
        const response = await getCountriesData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Countries retrieved successfully!');
        expect(response.countries.length).toBe(0);  // No countries
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching countries',
            data: {
                countries: [],
            },
        });

        // Call the function
        const response = await getCountriesData();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching countries');
        expect(response.countries.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Countries retrieved successfully!',
            data: {
                countries: [
                    { id: 1, title: { EN: 'Sri Lanka', TM: 'Sri Lanka' } },
                ],
            },
        });

        // Call the function
        const response = await getCountriesData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Countries retrieved successfully!');
        expect(response.countries.length).toBe(1);
        expect(response.countries[0].title.EN).toBe('Sri Lanka');
        expect(response.countries[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No countries found',
            data: {},  // No countries data
        });

        // Call the function
        const response = await getCountriesData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No countries found');
        expect(response.countries).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Countries retrieved successfully!',
            data: {
                countries: [
                    { id: 1, title: { EN: 'Sri Lanka', TM: 'Sri Lanka', SN: 'Sri Lanka' } },
                ],
            },
        });

        // Call the function
        await getCountriesData();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/country/get-all`,
            method: 'POST',
        });
    });
})

describe('createCountrySliderData', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Country created successfully!',
            data: {
                id: 1,
                title: { EN: 'Sri Lanka', TM: 'Sri Lanka', SN: 'Sri Lanka' },
            },
        });

        // Call the function
        const response = await createCountrySliderData('Sri Lanka');

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Country created successfully!');
        expect(response.data.country.id).toBe(1);
        expect(response.data.country.title.EN).toBe('Sri Lanka');
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await createCountrySliderData('India');
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating country',
            data: {},
        });

        // Call the function
        const response = await createCountrySliderData('India');

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error creating country');
        expect(response.data.country).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Country created successfully!',
            data: null,
        });

        // Call the function
        const response = await createCountrySliderData('India');

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Country created successfully!');
        expect(response.data.country).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Country created successfully!',
            data: {
                id: 2,
                title: { EN: 'India', TM: 'India', SN: 'India' },
            },
        });

        // Call the function
        await createCountrySliderData('India');

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/country/create`,
            method: 'POST',
            body: {
                title: {
                    EN: 'India',
                    SN: 'India',
                    TM: 'India',
                },
            },
        });
    });
});