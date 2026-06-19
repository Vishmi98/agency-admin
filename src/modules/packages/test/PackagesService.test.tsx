import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { createPackage, getLanguageData, getPackagesData, getStudyTypeData } from '../services/packages.service';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getStudyTypeData', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Study types retrieved successfully!',
            data: {
                studyTypes: [
                    { id: 1, title: { EN: 'Online', TM: 'Online', SN: 'Online' } },
                ],
            },
        });

        // Call the function
        const response = await getStudyTypeData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Study types retrieved successfully!');
        expect(response.studyTypes.length).toBe(1);
        expect(response.studyTypes[0].title.EN).toBe('Online');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getStudyTypeData();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no Study types in the response', async () => {
        // Mock the apiCall response with no Study types
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Study types retrieved successfully!',
            data: {
                studyTypes: [],  // Empty array for Study types
            },
        });

        // Call the function
        const response = await getStudyTypeData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Study types retrieved successfully!');
        expect(response.studyTypes.length).toBe(0);  // No Study types
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching Study types',
            data: {
                studyTypes: [],
            },
        });

        // Call the function
        const response = await getStudyTypeData();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching Study types');
        expect(response.studyTypes.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Study types retrieved successfully!',
            data: {
                studyTypes: [
                    { id: 1, title: { EN: 'Online', TM: 'Online' } },
                ],
            },
        });

        // Call the function
        const response = await getStudyTypeData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Study types retrieved successfully!');
        expect(response.studyTypes.length).toBe(1);
        expect(response.studyTypes[0].title.EN).toBe('Online');
        expect(response.studyTypes[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No Study types found',
            data: {},  // No Study types data
        });

        // Call the function
        const response = await getStudyTypeData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No Study types found');
        expect(response.studyTypes).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Study types retrieved successfully!',
            data: {
                studyTypes: [
                    { id: 1, title: { EN: 'Online', TM: 'Online', SN: 'Online' } },
                ],
            },
        });

        // Call the function
        await getStudyTypeData();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/study-type/get-all`,
            method: 'POST',
        });
    });
})

describe('getLanguageData', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Languages retrieved successfully!',
            data: {
                languages: [
                    { id: 1, title: { EN: 'English', TM: 'English', SN: 'English' } },
                ],
            },
        });

        // Call the function
        const response = await getLanguageData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Languages retrieved successfully!');
        expect(response.languages.length).toBe(1);
        expect(response.languages[0].title.EN).toBe('English');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getLanguageData();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no Languages in the response', async () => {
        // Mock the apiCall response with no Languages
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Languages retrieved successfully!',
            data: {
                languages: [],  // Empty array for Languages
            },
        });

        // Call the function
        const response = await getLanguageData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Languages retrieved successfully!');
        expect(response.languages.length).toBe(0);  // No Languages
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching Languages',
            data: {
                languages: [],
            },
        });

        // Call the function
        const response = await getLanguageData();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching Languages');
        expect(response.languages.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Languages retrieved successfully!',
            data: {
                languages: [
                    { id: 1, title: { EN: 'English', TM: 'English' } },
                ],
            },
        });

        // Call the function
        const response = await getLanguageData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Languages retrieved successfully!');
        expect(response.languages.length).toBe(1);
        expect(response.languages[0].title.EN).toBe('English');
        expect(response.languages[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No Languages found',
            data: {},  // No Languages data
        });

        // Call the function
        const response = await getLanguageData();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No Languages found');
        expect(response.languages).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Languages retrieved successfully!',
            data: {
                languages: [
                    { id: 1, title: { EN: 'English', TM: 'Online', SN: 'Online' } },
                ],
            },
        });

        // Call the function
        await getLanguageData();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/language/get-all`,
            method: 'POST',
        });
    });
})

describe('getPackagesData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Packages retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalPackages: 50,
                packages: [{
                    id: 1,
                    title: 'Example Package',
                    countryId: 1,
                    uniId: 1,
                    courseName: 'Example Course',
                    cost: 1000,
                    price: 1500,
                    startDate: '2025-04-01',
                    qualification: 1,
                    duration: 3,
                    nextIntake: '2025-06-01',
                    entryQualification: [1, 2],
                    studyType: 1,
                    language: 1,
                    createdBy: 1,
                    uniInfo: { id: 1, name: 'Example University' },
                    countryInfo: { title: { SN: 'Sri lanka', EN: 'Sri lanka', TM: 'Sri lanka' }, id: 1 },
                    staffInfo: { id: 1, firstName: 'John', lastName: 'Doe' },
                    studyTypeInfo: { title: { SN: 'Full-time', EN: 'Full-time', TM: 'Full-time' }, id: 1 },
                    entryQualificationInfo: { title: { SN: 'High School', EN: 'High School', TM: 'High School' }, id: 1 },
                    qualificationInfo: { title: { SN: 'Bachelor', EN: 'Bachelor', TM: 'Bachelor' }, id: 1 },
                    languageInfo: { title: { SN: 'English', EN: 'English', TM: 'English' }, id: 1 },
                }]
            }
        });

        const response = await getPackagesData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Packages retrieved successfully!');
        expect(response.packages.length).toBe(1);
        expect(response.packages[0].title).toBe('Example Package');
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getPackagesData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty packages list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No packages found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalPackages: 0,
                packages: []
            }
        });

        const response = await getPackagesData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No packages found');
        expect(response.packages.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching package data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalPackages: 0,
                packages: []
            }
        });

        const response = await getPackagesData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching package data');
        expect(response.packages.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getPackagesData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.packages).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Package data retrieved',
            data: {} // Missing package data
        });

        const response = await getPackagesData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Package data retrieved');
        expect(response.packages).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Packages retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalPackages: 50,
                packages: []
            }
        });

        await getPackagesData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/package/get-all`,
            method: 'POST',
            body: { page: 1, limit: 5, search: "" }
        });
    });
})

describe('createPackage', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Package created successfully!',
            data: {
                title: 'Advanced JavaScript',
                countryId: 1,
                uniId: 101,
                courseName: 'JavaScript Development',
                cost: 5000,
                price: 6000,
                startDate: '2025-04-01',
                qualification: 'Bachelor\'s',
                duration: 12,
                nextIntake: '2025-05-01',
                entryQualification: [1, 2],
                studyType: 'Full-time',
                language: 'English',
                createdBy: 123,
            },
        });

        const body = {
            title: 'Advanced JavaScript',
            countryId: 1,
            uniId: 101,
            courseName: 'JavaScript Development',
            cost: 5000,
            price: 6000,
            startDate: '2025-04-01',
            qualification: 'Bachelor\'s',
            duration: 12,
            nextIntake: '2025-05-01',
            entryQualification: [1, 2],
            studyType: 'Full-time',
            language: 'English',
            createdBy: 123,
        };

        const result = await createPackage(body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Package created successfully!');
        expect(result.data.package.title).toBe('Advanced JavaScript');
        expect(result.data.package.countryId).toBe(1);
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            const body = {
                title: 'Advanced JavaScript',
                countryId: 1,
                uniId: 101,
                courseName: 'JavaScript Development',
                cost: 5000,
                price: 6000,
                startDate: '2025-04-01',
                qualification: 'Bachelor\'s',
                duration: 12,
                nextIntake: '2025-05-01',
                entryQualification: [1, 2],
                studyType: 'Full-time',
                language: 'English',
                createdBy: 123,
            };
            await createPackage(body);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating package',
            data: {},
        });

        const body = {
            title: 'Advanced JavaScript',
            countryId: 1,
            uniId: 101,
            courseName: 'JavaScript Development',
            cost: 5000,
            price: 6000,
            startDate: '2025-04-01',
            qualification: 'Bachelor\'s',
            duration: 12,
            nextIntake: '2025-05-01',
            entryQualification: [1, 2],
            studyType: 'Full-time',
            language: 'English',
            createdBy: 123,
        };

        const response = await createPackage(body);

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error creating package');
        expect(response.data.package).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Package created successfully!',
            data: null,
        });

        const body = {
            title: 'Advanced JavaScript',
            countryId: 1,
            uniId: 101,
            courseName: 'JavaScript Development',
            cost: 5000,
            price: 6000,
            startDate: '2025-04-01',
            qualification: 'Bachelor\'s',
            duration: 12,
            nextIntake: '2025-05-01',
            entryQualification: [1, 2],
            studyType: 'Full-time',
            language: 'English',
            createdBy: 123,
        };

        const response = await createPackage(body);

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Package created successfully!');
        expect(response.data.package).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Package created successfully!',
            data: {
                title: 'Advanced JavaScript',
                countryId: 1,
                uniId: 101,
                courseName: 'JavaScript Development',
                cost: 5000,
                price: 6000,
                startDate: '2025-04-01',
                qualification: 'Bachelor\'s',
                duration: 12,
                nextIntake: '2025-05-01',
                entryQualification: [1, 2],
                studyType: 'Full-time',
                language: 'English',
                createdBy: 123,
            },
        });

        const body = {
            title: 'Advanced JavaScript',
            countryId: 1,
            uniId: 101,
            courseName: 'JavaScript Development',
            cost: 5000,
            price: 6000,
            startDate: '2025-04-01',
            qualification: 'Bachelor\'s',
            duration: 12,
            nextIntake: '2025-05-01',
            entryQualification: [1, 2],
            studyType: 'Full-time',
            language: 'English',
            createdBy: 123,
        };

        // Call the function
        await createPackage(body);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/package/create`,
            method: 'POST',
            body: {
                title: 'Advanced JavaScript',
                countryId: 1,
                uniId: 101,
                courseName: 'JavaScript Development',
                cost: 5000,
                price: 6000,
                startDate: '2025-04-01',
                qualification: 'Bachelor\'s',
                duration: 12,
                nextIntake: '2025-05-01',
                entryQualification: [1, 2],
                studyType: 'Full-time',
                language: 'English',
                createdBy: 123,
            },
        });
    });
});
