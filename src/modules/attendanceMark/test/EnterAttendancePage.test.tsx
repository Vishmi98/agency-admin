import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import AttendanceMarkTable from '../ui/AttendanceMarkTable';
import AddLeaveModal from '../ui/AddLeaveModal';
import AddAttendanceMark from '../ui/AddAttendanceMark';
import EnterAttendancePage from '@/app/admin/enter-attendance/page';


jest.mock('../ui/AttendanceMarkTable');
jest.mock('../ui/AddLeaveModal');
jest.mock('../ui/AddAttendanceMark');

describe('EnterAttendancePage Component', () => {
    const theme = createTheme();

    beforeEach(() => {
        // Reset mocks before each test
        (AttendanceMarkTable as jest.Mock).mockClear();
        (AddLeaveModal as jest.Mock).mockClear();
        (AddAttendanceMark as jest.Mock).mockClear();
    });

    it('renders the "Add Leave" button', () => {
        render(
            <ThemeProvider theme={theme}>
                <EnterAttendancePage />
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: /Add Leave/i })).toBeInTheDocument();
    });

    it('opens the AddLeaveModal when the "Add Leave" button is clicked', async () => {
        render(
            <ThemeProvider theme={theme}>
                <EnterAttendancePage />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /Add Leave/i }));

        await waitFor(() => {
            expect(AddLeaveModal).toHaveBeenCalled();
        });
    });

    it('renders the AddAttendanceMark component', () => {
        render(
            <ThemeProvider theme={theme}>
                <EnterAttendancePage />
            </ThemeProvider>
        );

        expect(AddAttendanceMark).toHaveBeenCalled();
    });

    it('renders the AttendanceMarkTable component', () => {
        render(
            <ThemeProvider theme={theme}>
                <EnterAttendancePage />
            </ThemeProvider>
        );

        expect(AttendanceMarkTable).toHaveBeenCalled();
    });

    // it('fetches staff members without attendance on mount', async () => {
    //     const mockStaff = {
    //         success: true,
    //         staff: [{ id: 1, fullName: 'John Doe', firstName: 'John', lastName: 'Doe' }],
    //     };

    //     (AttendanceMarkServices.getStaffWithoutAttendance as jest.Mock).mockResolvedValue(mockStaff);

    //     await act(async () => {
    //         render(
    //             <ThemeProvider theme={theme}>
    //                 <EnterAttendancePage />
    //             </ThemeProvider>
    //         );
    //     });

    //     await waitFor(() => {
    //         expect(AttendanceMarkServices.getStaffWithoutAttendance).toHaveBeenCalled();
    //     });

    //     expect((AddLeaveModal as jest.Mock).mock.calls[0][0].staffMembers).toEqual(mockStaff.staff);
    //     expect((AddAttendanceMark as jest.Mock).mock.calls[0][0].staffMembers).toEqual(mockStaff.staff);
    // });

    // it('reloads data when handleReload is called', async () => {
    //     const mockStaff = {
    //         success: true,
    //         staff: [{ id: 1, name: 'John Doe' }],
    //     };
    //     const getStaffWithoutAttendanceMock = jest
    //         .spyOn(AttendanceMarkServices, 'getStaffWithoutAttendance')
    //         .mockResolvedValue(mockStaff);

    //     const { rerender } = render(
    //         <ThemeProvider theme={theme}>
    //             <EnterAttendancePage />
    //         </ThemeProvider>
    //     );

    //     await waitFor(() => {
    //         expect(getStaffWithoutAttendanceMock).toHaveBeenCalledTimes(1);
    //     });

    //     const handleReload = (AddLeaveModal as jest.Mock).mock.calls[0][0].handleReload;

    //     handleReload();

    //     rerender(
    //         <ThemeProvider theme={theme}>
    //             <EnterAttendancePage />
    //         </ThemeProvider>
    //     );

    //     await waitFor(() => {
    //         expect(getStaffWithoutAttendanceMock).toHaveBeenCalledTimes(2);
    //     });

    //     getStaffWithoutAttendanceMock.mockRestore();
    // });

    // it('passes staff members to AddLeaveModal', async () => {
    //     const mockStaff = {
    //         success: true,
    //         staff: [{ id: 1, name: 'John Doe' }],
    //     };
    //     const getStaffWithoutAttendanceMock = jest
    //         .spyOn(AttendanceMarkServices, 'getStaffWithoutAttendance')
    //         .mockResolvedValue(mockStaff);

    //     render(
    //         <ThemeProvider theme={theme}>
    //             <EnterAttendancePage />
    //         </ThemeProvider>
    //     );

    //     fireEvent.click(screen.getByRole('button', { name: /Add Leave/i }));

    //     await waitFor(() => {
    //         expect((AddLeaveModal as jest.Mock).mock.calls[0][0].staffMembers).toEqual(mockStaff.staff);
    //     });

    //     getStaffWithoutAttendanceMock.mockRestore();
    // });

    it('passes reload and handleReload to AttendanceMarkTable', () => {
        render(
            <ThemeProvider theme={theme}>
                <EnterAttendancePage />
            </ThemeProvider>
        );

        expect((AttendanceMarkTable as jest.Mock).mock.calls[0][0].reload).toBeDefined();
        expect((AttendanceMarkTable as jest.Mock).mock.calls[0][0].handleReload).toBeDefined();
    });

    it('passes reload and handleReload to AddAttendanceMark', () => {
        render(
            <ThemeProvider theme={theme}>
                <EnterAttendancePage />
            </ThemeProvider>
        );

        expect((AddAttendanceMark as jest.Mock).mock.calls[0][0].reload).toBeDefined();
        expect((AddAttendanceMark as jest.Mock).mock.calls[0][0].handleReload).toBeDefined();
    });

    it('renders the "Today Attendance" title', () => {
        render(
            <ThemeProvider theme={theme}>
                <EnterAttendancePage />
            </ThemeProvider>
        );

        expect(screen.getByText(/Today Attendance/i)).toBeInTheDocument();
    });
});