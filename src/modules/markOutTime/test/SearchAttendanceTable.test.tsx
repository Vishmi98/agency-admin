import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { getAttendanceMissingOutTimeData } from '../../attendanceMark/services/attendanceMark.services';
import SearchAttendanceTable from '../ui/SearchAttendanceTable';


// Mocking the AddOutTimeModal component
jest.mock('../../attendanceMark/ui/AddOutTimeModal', () => ({
    __esModule: true,
    default: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
        open ? <div data-testid="add-out-time-modal" onClick={handleClose}>Modal Opened</div> : null
    ),
}));

// Mocking API response function
jest.mock('../../attendanceMark/services/attendanceMark.services', () => ({
    getAttendanceMissingOutTimeData: jest.fn(),
}));

describe('SearchAttendanceTable Component', () => {
    const theme = createTheme();

    const renderWithTheme = () =>
        render(
            <ThemeProvider theme={theme}>
                <SearchAttendanceTable reload={false} handleReload={() => { }} />
            </ThemeProvider>
        );

    test('renders loading state while fetching data', async () => {
        // Simulate initial loading state by waiting for API call to complete
        renderWithTheme();
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    test('displays "No data available" if no attendance data is available', async () => {
        (getAttendanceMissingOutTimeData as jest.Mock).mockResolvedValue({
            success: true,
            attendance: [],
            totalAttendance: 0,
        });

        renderWithTheme();

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('renders attendance data when API call is successful', async () => {
        (getAttendanceMissingOutTimeData as jest.Mock).mockResolvedValue({
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

        render(<SearchAttendanceTable reload={false} handleReload={jest.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('09:00 AM')).toBeInTheDocument();
            expect(screen.getByText('05:00 PM')).toBeInTheDocument();
        });
    });

    test('renders table headers correctly', async () => {
        renderWithTheme();
        expect(await screen.findByText('Staff ID')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('In Time')).toBeInTheDocument();
        expect(screen.getByText('Out Time')).toBeInTheDocument();
    });

    // test('calls onPageChange when next page button is clicked', async () => {
    //     (getAttendanceMissingOutTimeData as jest.Mock).mockResolvedValue({
    //         success: true,
    //         attendance: [
    //             { id: 1, staffId: 101, date: '2024-03-20', inTime: '09:00 AM', outTime: '05:00 PM', staffInfo: { firstName: 'John', lastName: 'Doe' } }
    //         ],
    //         totalAttendance: 10,
    //     });

    //     renderWithTheme();
    //     await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    //     // Click next page button
    //     const nextPageButton = screen.getByLabelText('Go to next page');
    //     fireEvent.click(nextPageButton);

    //     expect(getAttendanceMissingOutTimeData).toHaveBeenCalledWith(2, 5, expect.any(String)); // Page should increment
    // });

    // test('updates rows per page when user selects a new value', async () => {
    //     renderWithTheme();
    //     const rowsPerPageDropdown = screen.getByLabelText('Rows per page:');

    //     fireEvent.change(rowsPerPageDropdown, { target: { value: '10' } });

    //     expect(getAttendanceMissingOutTimeData).toHaveBeenCalledWith(1, 10, expect.any(String));
    // });
});
