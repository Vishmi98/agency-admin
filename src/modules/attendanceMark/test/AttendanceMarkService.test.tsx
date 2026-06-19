import '@testing-library/jest-dom';

import { addAttendance, addOutTime, createLeave, getAttendanceMarkData, getAttendanceMissingOutTimeData, getLeaveTypes, getStaffWithoutAttendance } from '../services/attendanceMark.services';
import apiCall from '../../../services/api.services';
import { URL } from '@/constants/config';
import { AddOutTimeResponseDataType, AttendanceMarkType, CreateLeaveResponseDataType } from '../attendanceMarks.types';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('getLeaveTypes', () => {
    it('should return data when the API call is successful', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Leave types retrieved successfully!',
            data: {
                leaveType: [
                    { id: 1, title: { EN: 'Off', TM: 'Off', SN: 'Off' } },
                ],
            },
        });

        // Call the function
        const response = await getLeaveTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Leave types retrieved successfully!');
        expect(response.leaveType.length).toBe(1);
        expect(response.leaveType[0].title.EN).toBe('Off');
    });

    it('should handle error when the API call fails', async () => {
        // Mock the apiCall to simulate an error
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        // Call the function and catch the error
        try {
            await getLeaveTypes();
        } catch (error) {
            // Assertions
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle no leave types in the response', async () => {
        // Mock the apiCall response with no leave types
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Leave types retrieved successfully!',
            data: {
                leaveType: [],  // Empty array for leave types
            },
        });

        // Call the function
        const response = await getLeaveTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Leave types retrieved successfully!');
        expect(response.leaveType.length).toBe(0);  // No leave types
    });

    it('should handle unsuccessful API response', async () => {
        // Mock the apiCall response as unsuccessful
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching leave types',
            data: {
                leaveType: [],
            },
        });

        // Call the function
        const response = await getLeaveTypes();

        // Assertions
        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching leave types');
        expect(response.leaveType.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        // Mock the apiCall response with incomplete data (missing title)
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Leave types retrieved successfully!',
            data: {
                leaveType: [
                    { id: 1, title: { EN: 'Off', TM: 'Off' } },
                ],
            },
        });

        // Call the function
        const response = await getLeaveTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('Leave types retrieved successfully!');
        expect(response.leaveType.length).toBe(1);
        expect(response.leaveType[0].title.EN).toBe('Off');
        expect(response.leaveType[0].title.SN).toBeUndefined();  // 'SN' title is missing
    });

    it('should handle missing data in the API response', async () => {
        // Mock the apiCall response with missing `data`
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No leave types found',
            data: {},  // No leave types data
        });

        // Call the function
        const response = await getLeaveTypes();

        // Assertions
        expect(response.success).toBe(true);
        expect(response.message).toBe('No leave types found');
        expect(response.leaveType).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        // Mock the apiCall response
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Leave types retrieved successfully!',
            data: {
                leaveType: [
                    { id: 1, title: { EN: 'Off', TM: 'Off', SN: 'Off' } },
                ],
            },
        });

        // Call the function
        await getLeaveTypes();

        // Assertions
        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/leave-type/get-all`,
            method: 'POST',
        });
    });
})

describe('getAttendanceMarkData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Attendance retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalAttendance: 50,
                attendance: [{
                    id: 1,
                    staffId: 1,
                    date: '2023-01-01',
                    inTime: '09:00',
                    outTime: '17:00',
                    leave: 0,
                    createdBy: 1,
                    staffInfo: { id: 1, firstName: 'John', lastName: 'Doe' },
                    leaveInfo: null,
                }]
            }
        });

        const response = await getAttendanceMarkData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Attendance retrieved successfully!');
        expect(response.attendance.length).toBe(1);
        expect(response.attendance[0].id).toBe(1);
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getAttendanceMarkData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty attendance list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No attendance found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalAttendance: 0,
                attendance: []
            }
        });

        const response = await getAttendanceMarkData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No attendance found');
        expect(response.attendance.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching attendance data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalAttendance: 0,
                attendance: []
            }
        });

        const response = await getAttendanceMarkData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching attendance data');
        expect(response.attendance.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getAttendanceMarkData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.attendance).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Attendance data retrieved',
            data: {} // Missing attendance data
        });

        const response = await getAttendanceMarkData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Attendance data retrieved');
        expect(response.attendance).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Attendance retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalAttendance: 50,
                attendance: []
            }
        });

        await getAttendanceMarkData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/get-all`,
            method: 'POST',
            body: { page: 1, limit: 5 }
        });
    });
})

describe('getAttendanceMissingOutTimeData', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Attendance retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalAttendance: 50,
                attendance: [{
                    id: 1,
                    staffId: 1,
                    date: '2023-01-01',
                    inTime: '09:00',
                    outTime: '',
                    leave: 0,
                    createdBy: 1,
                    staffInfo: { id: 1, firstName: 'John', lastName: 'Doe' },
                    leaveInfo: null,
                }]
            }
        });

        const response = await getAttendanceMissingOutTimeData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Attendance retrieved successfully!');
        expect(response.attendance.length).toBe(1);
        expect(response.attendance[0].id).toBe(1);
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getAttendanceMissingOutTimeData(1, 5);
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty attendance list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No attendance found',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalAttendance: 0,
                attendance: []
            }
        });

        const response = await getAttendanceMissingOutTimeData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('No attendance found');
        expect(response.attendance.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching attendance data',
            data: {
                page: 1,
                limit: 5,
                totalPages: 0,
                totalAttendance: 0,
                attendance: []
            }
        });

        const response = await getAttendanceMissingOutTimeData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching attendance data');
        expect(response.attendance.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getAttendanceMissingOutTimeData(1, 5);

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.attendance).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Attendance data retrieved',
            data: {} // Missing attendance data
        });

        const response = await getAttendanceMissingOutTimeData(1, 5);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Attendance data retrieved');
        expect(response.attendance).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Attendance retrieved successfully!',
            data: {
                page: 1,
                limit: 5,
                totalPages: 10,
                totalAttendance: 50,
                attendance: []
            }
        });

        await getAttendanceMissingOutTimeData(1, 5);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/miss-out`,
            method: 'POST',
            body: { page: 1, limit: 5 }
        });
    });
})

describe('getStaffWithoutAttendance', () => {
    it('should return data when the API call is successful', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Staff members retrieved successfully!',
            data: {
                staff: [{
                    id: 1,
                    fullName: 'John Doe',
                    firstName: 'John',
                    lastName: 'Doe',
                }]
            }
        });

        const response = await getStaffWithoutAttendance();

        expect(response.success).toBe(true);
        expect(response.message).toBe('Staff members retrieved successfully!');
        expect(response.staff.length).toBe(1);
        expect(response.staff[0].id).toBe(1);
    });

    it('should handle error when the API call fails', async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error('API call failed'));

        try {
            await getStaffWithoutAttendance();
        } catch (error) {
            expect(error).toEqual(new Error('API call failed'));
        }
    });

    it('should handle empty staff list', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'No staff found',
            data: {
                staff: []
            }
        });

        const response = await getStaffWithoutAttendance();

        expect(response.success).toBe(true);
        expect(response.message).toBe('No staff found');
        expect(response.staff.length).toBe(0);
    });

    it('should handle unsuccessful API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Error fetching staff data',
            data: {
                staff: []
            }
        });

        const response = await getStaffWithoutAttendance();

        expect(response.success).toBe(false);
        expect(response.message).toBe('Error fetching staff data');
        expect(response.staff.length).toBe(0);
    });

    it('should handle incomplete data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({});

        const response = await getStaffWithoutAttendance();

        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.staff).toEqual([]);
    });

    it('should handle missing data in the API response', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Staff members data retrieved',
            data: {}
        });

        const response = await getStaffWithoutAttendance();

        expect(response.success).toBe(true);
        expect(response.message).toBe('Staff members data retrieved');
        expect(response.staff).toEqual([]);
    });

    it('should call apiCall with the correct arguments', async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Staff members retrieved successfully!',
            data: {
                attendance: []
            }
        });

        await getStaffWithoutAttendance();

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/staff/without-attendance`,
            method: 'POST',
        });
    });
})

describe("createLeave", () => {
    const mockLeaveData: AttendanceMarkType = {
        id: 1,
        date: "2025-01-26",
        inTime: "",
        staffId: 110,
        leave: 100
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success response when leave is created successfully", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Leave added successfully",
            data: mockLeaveData
        });

        const result: CreateLeaveResponseDataType = await createLeave(mockLeaveData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/add-leave`,
            method: "POST",
            body: mockLeaveData,
        });

        expect(result).toEqual({
            success: true,
            message: "Leave added successfully",
            data: {
                Attendance: mockLeaveData,
            },
        });
    });

    it("should return failure response when leave creation fails", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "Failed to add leave",
            data: null
        });

        const result: CreateLeaveResponseDataType = await createLeave(mockLeaveData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/add-leave`,
            method: "POST",
            body: mockLeaveData,
        });

        expect(result).toEqual({
            success: false,
            message: "Failed to add leave",
            data: {
                Attendance: null,
            },
        });
    });

    it("should handle API call rejection gracefully", async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(createLeave(mockLeaveData)).rejects.toThrow("Network error");
    });
});

describe("addAttendance", () => {
    const mockAttendanceData: AttendanceMarkType = {
        id: 1,
        date: "2025-01-15",
        staffId: 110,
        inTime: "09.00"
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success response when attendance is marked successfully", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Attendance marked successfully",
            data: mockAttendanceData
        });

        const result: CreateLeaveResponseDataType = await addAttendance(mockAttendanceData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-in`,
            method: "POST",
            body: mockAttendanceData,
        });

        expect(result).toEqual({
            success: true,
            message: "Attendance marked successfully",
            data: {
                Attendance: mockAttendanceData,
            },
        });
    });

    it("should return failure response when attendance marking fails", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "Failed to mark attendance",
            data: null
        });

        const result: CreateLeaveResponseDataType = await addAttendance(mockAttendanceData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-in`,
            method: "POST",
            body: mockAttendanceData,
        });

        expect(result).toEqual({
            success: false,
            message: "Failed to mark attendance",
            data: {
                Attendance: null,
            },
        });
    });

    it("should handle API call rejection gracefully", async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(addAttendance(mockAttendanceData)).rejects.toThrow("Network error");
    });

    it("should fail when required fields are missing", async () => {
        const incompleteAttendanceData = {
            staffId: 110
        };

        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "Date and inTime fields are required",
            data: null
        });

        const result: CreateLeaveResponseDataType = await addAttendance(incompleteAttendanceData as AttendanceMarkType);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-in`,
            method: "POST",
            body: incompleteAttendanceData,
        });

        expect(result).toEqual({
            success: false,
            message: "Date and inTime fields are required",
            data: {
                Attendance: null,
            },
        });
    });

    it("should handle unexpected API response format", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Unexpected response",
            unexpectedField: {}
        });

        const result: CreateLeaveResponseDataType = await addAttendance(mockAttendanceData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-in`,
            method: "POST",
            body: mockAttendanceData,
        });

        expect(result).toEqual({
            success: true,
            message: "Unexpected response",
            data: {
                Attendance: undefined, // Expecting Attendance field but it's missing
            },
        });
    });
});

describe("addOutTime", () => {
    const mockOutTimeData: AttendanceMarkType = {
        id: 115,
        staffId: 105,
        inTime: "",
        outTime: "15:30"
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success response when out-time is recorded successfully", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Out time recorded successfully",
            data: mockOutTimeData
        });

        const result: AddOutTimeResponseDataType = await addOutTime(mockOutTimeData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-out`,
            method: "POST",
            body: mockOutTimeData,
        });

        expect(result).toEqual({
            success: true,
            message: "Out time recorded successfully",
            data: {
                test: mockOutTimeData,
            },
        });
    });

    it("should return failure response when out-time recording fails", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "Failed to record out time",
            data: null
        });

        const result: AddOutTimeResponseDataType = await addOutTime(mockOutTimeData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-out`,
            method: "POST",
            body: mockOutTimeData,
        });

        expect(result).toEqual({
            success: false,
            message: "Failed to record out time",
            data: {
                test: null,
            },
        });
    });

    it("should handle API call rejection gracefully", async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(addOutTime(mockOutTimeData)).rejects.toThrow("Network error");
    });

    it("should return error for invalid time format", async () => {
        const invalidOutTimeData = {
            id: 115,
            staffId: 105,
            inTime: "",
            outTime: "15:89" // Invalid time format
        };

        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "Invalid time format",
            data: null
        });

        const result: AddOutTimeResponseDataType = await addOutTime(invalidOutTimeData as AttendanceMarkType);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-out`,
            method: "POST",
            body: invalidOutTimeData,
        });

        expect(result).toEqual({
            success: false,
            message: "Invalid time format",
            data: {
                test: null,
            },
        });
    });

    it("should fail when required fields are missing", async () => {
        const incompleteOutTimeData = {
            id: 115,
        };

        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "StaffId and outTime fields are required",
            data: null
        });

        const result: AddOutTimeResponseDataType = await addOutTime(incompleteOutTimeData as AttendanceMarkType);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-out`,
            method: "POST",
            body: incompleteOutTimeData,
        });

        expect(result).toEqual({
            success: false,
            message: "StaffId and outTime fields are required",
            data: {
                test: null,
            },
        });
    });

    it("should handle unexpected API response format", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Unexpected response",
            unexpectedField: {}
        });

        const result: AddOutTimeResponseDataType = await addOutTime(mockOutTimeData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/attendance/time-out`,
            method: "POST",
            body: mockOutTimeData,
        });

        expect(result).toEqual({
            success: true,
            message: "Unexpected response",
            data: {
                test: undefined, // Expecting test field but it's missing
            },
        });
    });
});