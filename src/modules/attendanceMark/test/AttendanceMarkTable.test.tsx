import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { getAttendanceMarkData } from '../services/attendanceMark.services';
import AttendanceMarkTable from '../ui/AttendanceMarkTable';


// Mock the API function
jest.mock('../services/attendanceMark.services', () => ({
    getAttendanceMarkData: jest.fn(),
}));

describe('AttendanceMarkTable Component', () => {
    beforeEach(() => {
        // Mock JWT token in localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-jwt-token'),
            },
            writable: true,
        });
    });

    it('renders loading state initially', async () => {
        render(<AttendanceMarkTable reload={false} handleReload={jest.fn()} />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders "No data available" when API returns empty', async () => {
        (getAttendanceMarkData as jest.Mock).mockResolvedValue({
            success: true,
            attendance: [],
            totalAttendance: 0,
        });

        render(<AttendanceMarkTable reload={false} handleReload={jest.fn()} />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('renders attendance data when API call is successful', async () => {
        (getAttendanceMarkData as jest.Mock).mockResolvedValue({
            success: true,
            attendance: [
                {
                    id: 1,
                    staffId: 101,
                    date: '2024-03-20',
                    inTime: '09:00 AM',
                    outTime: '05:00 PM',
                    leave: 0,
                    createdBy: 1,
                    staffInfo: {
                        id: 101,
                        firstName: 'John',
                        lastName: 'Doe',
                    },
                    leaveInfo: null,
                },
            ],
            totalAttendance: 1,
        });

        render(<AttendanceMarkTable reload={false} handleReload={jest.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('09:00 AM')).toBeInTheDocument();
            expect(screen.getByText('05:00 PM')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getAttendanceMarkData as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<AttendanceMarkTable reload={false} handleReload={jest.fn()} />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
