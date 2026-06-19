import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { createStudent, getStudentData, getVisaStatuses, updateStudent } from '../services/student.services';
import { StudentType } from '../student.types';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getVisaStatuses', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Visa status types retrieved successfully!',
            data: {
                visaStatusType: [
                    { id: 1, title: { EN: 'Pending', TM: 'Pending', SN: 'Pending' } },
                ],
            },
        });

        // Call the function
        const response = await getVisaStatuses();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Visa status types retrieved successfully!');
        expect(response.visaStatusType.length).toBe(1);
        expect(response.visaStatusType[0].title.EN).toBe('Pending');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getVisaStatuses();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no Visa status types in the response', async () => {
        // Mock the apiCall response with no Visa status types
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Visa status types retrieved successfully!',
            data: {
                visaStatusType: [],  // Empty array for Visa status types
            },
        });

        // Call the function
        const response = await getVisaStatuses();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Visa status types retrieved successfully!');
        expect(response.visaStatusType.length).toBe(0);  // No Visa status types
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching Visa status types',
            data: {
                visaStatusType: [],
            },
        });

        // Call the function
        const response = await getVisaStatuses();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching Visa status types');
        expect(response.visaStatusType.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Visa status types retrieved successfully!',
            data: {
                visaStatusType: [
                    { id: 1, title: { EN: 'Pending', TM: 'Pending' } },
                ],
            },
        });

        // Call the function
        const response = await getVisaStatuses();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Visa status types retrieved successfully!');
        expect(response.visaStatusType.length).toBe(1);
        expect(response.visaStatusType[0].title.EN).toBe('Pending');
        expect(response.visaStatusType[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No Visa status types found',
            data: {},  // No Visa status types data
        });

        // Call the function
        const response = await getVisaStatuses();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No Visa status types found');
        expect(response.visaStatusType).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Visa status types retrieved successfully!',
            data: {
                visaStatusType: [
                    { id: 1, title: { EN: 'Pending', TM: 'Pending', SN: 'Pending' } },
                ],
            },
        });

        // Call the function
        await getVisaStatuses();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/visa-status-type/get-all`,
            method: 'POST',
        });
    });
})

describe('getStudentData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Students retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                total: 50,
                students: [{
                    id: 1,
                    title: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    fullName: 'John Doe',
                    passportNo: '123456789',
                    issueDate: '2023-01-01',
                    expireDate: '2028-01-01',
                    phone: '123-456-7890',
                    visaIssueDate: '2023-02-01',
                    visaExpireDate: '2024-02-01',
                    email: 'john.doe@example.com',
                    address: '123 Main St',
                    nic: '987654321',
                    createdBy: 1,
                    visaStatus: 1,
                    status: 1,
                    branchId: 1,
                    titleInfo: { title: { SN: 'Mr', EN: 'Mr', TM: 'Mr' }, id: 1 },
                    statusInfo: { title: { SN: 'Active', EN: 'Active', TM: 'Active' }, id: 1 },
                    visaStatusInfo: { title: { SN: 'Pending', EN: 'Pending', TM: 'Pending' }, id: 1 },
                    branchInfo: { title: { SN: 'Colombo', EN: 'Colombo', TM: 'Colombo' }, id: 1 },
                }]
            }
        });

        const response = await getStudentData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Students retrieved successfully!');
        expect(response.students.length).toBe(1);
        expect(response.students[0].firstName).toBe('John');
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getStudentData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty student list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No student found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                total: 0,
                students: []
            }
        });

        const response = await getStudentData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No student found');
        expect(response.students.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching student data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                total: 0,
                students: []
            }
        });

        const response = await getStudentData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching student data');
        expect(response.students.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getStudentData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.students).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Student data retrieved',
            data: {} // Missing student data
        });

        const response = await getStudentData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Student data retrieved');
        expect(response.students).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Students retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                total: 50,
                students: []
            }
        });

        await getStudentData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/student/get-all`,
            method: 'POST',
            body: { page: 1, limit: 5, search: '' }
        });
    });
})

describe('createStudent', () => {
    const mockStudent: StudentType = {
        id: 141,
        title: 100,
        firstName: "Himantha",
        lastName: "Piyumal",
        fullName: "Maspotha Jayakadukandage Himantha Piyumal Rathnasiri",
        passportNo: "N11377632",
        issueDate: "2024-05-10",
        expireDate: "2034-05-10",
        phone: "0762473147",
        visaIssueDate: "",
        visaExpireDate: "",
        email: "phimantha462@gmail.com",
        address: "107/1 rajanganaya yaya 12 gamunupura",
        nic: "200406312148",
        createdBy: 102,
        visaStatus: 100,
        branchId: 100,
    };

    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Student created successfully!',
            data: {
                email: "phimantha462@gmail.com",
            },
        });

        // Call the function
        const response = await createStudent(mockStudent);

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Student created successfully!');
        expect(response.data.email).toEqual({ email: "phimantha462@gmail.com" });
    });

    it('should handle API failure', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await createStudent(mockStudent);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error creating student',
            data: {},
        });

        // Call the function
        const response = await createStudent(mockStudent);

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error creating student');
        expect(response.data.email).toEqual({});
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Student created successfully!',
            data: null,
        });

        // Call the function
        const response = await createStudent(mockStudent);

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Student created successfully!');
        expect(response.data.email).toBeNull();
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Student created successfully!',
            data: {
                id: 2,
            },
        });

        // Call the function
        await createStudent(mockStudent);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/student/register`,
            method: 'POST',
            body: mockStudent,
        });
    });
});

describe('updateStudent', () => {
    it('should return data on successful student update', async () => {
        // Mock successful API response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Student updated successfully!',
            data: { id: 1, firstName: 'John', lastName: 'Doe' },
        });

        const body: StudentType = {
            id: 1,
            title: 'Mr.',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
            nic: '123456789V',
            address: '123 Street, City',
            passportNo: 'P1234567',
            issueDate: '2023-01-01',
            expireDate: '2030-01-01',
            visaIssueDate: '2023-06-01',
            visaExpireDate: '2024-06-01',
            createdBy: 'admin',
            visaStatus: 1,
        };

        const result = await updateStudent(1, body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Student updated successfully!');
        expect(result.data.student.firstName).toBe('John');
        expect(result.data.student.lastName).toBe('Doe');
    });

    it('should throw error on API failure', async () => {
        // Mock API failure
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        const body: StudentType = {
            id: 1,
            title: 'Mr.',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
            nic: '123456789V',
            address: '123 Street, City',
            passportNo: 'P1234567',
            issueDate: '2023-01-01',
            expireDate: '2030-01-01',
            visaIssueDate: '2023-06-01',
            visaExpireDate: '2024-06-01',
            createdBy: 'admin',
            visaStatus: 1,
        };

        try {
            await updateStudent(1, body);
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle unsuccessful response from API', async () => {
        // Mock unsuccessful response
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error updating student',
            data: {},
        });

        const body: StudentType = {
            id: 1,
            title: 'Mr.',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
            nic: '123456789V',
            address: '123 Street, City',
            passportNo: 'P1234567',
            issueDate: '2023-01-01',
            expireDate: '2030-01-01',
            visaIssueDate: '2023-06-01',
            visaExpireDate: '2024-06-01',
            createdBy: 'admin',
            visaStatus: 1,
        };

        const result = await updateStudent(1, body);

        // Assertions
        expect(result.success).toBe(false);
        expect(result.message).toBe('Error updating student');
        expect(result.data.student).toEqual({});
    });

    it('should handle missing student data in API response', async () => {
        // Mock response with missing student data
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Student updated successfully!',
            data: null,
        });

        const body: StudentType = {
            id: 1,
            title: 'Mr.',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
            nic: '123456789V',
            address: '123 Street, City',
            passportNo: 'P1234567',
            issueDate: '2023-01-01',
            expireDate: '2030-01-01',
            visaIssueDate: '2023-06-01',
            visaExpireDate: '2024-06-01',
            createdBy: 'admin',
            visaStatus: 1,
        };

        const result = await updateStudent(1, body);

        // Assertions
        expect(result.success).toBe(true);
        expect(result.message).toBe('Student updated successfully!');
        expect(result.data.student).toBeNull();
    });

    it('should call apiCall with correct arguments', async () => {
        const body: StudentType = {
            id: 1,
            title: 'Mr.',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
            nic: '123456789V',
            address: '123 Street, City',
            passportNo: 'P1234567',
            issueDate: '2023-01-01',
            expireDate: '2030-01-01',
            visaIssueDate: '2023-06-01',
            visaExpireDate: '2024-06-01',
            createdBy: 'admin',
            visaStatus: 1,
        };

        // Mock success response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Student updated successfully!',
            data: { id: 1, firstName: 'John', lastName: 'Doe' },
        });

        await updateStudent(1, body);

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/student/update`,
            method: 'POST',
            body,
        });
    });
});
