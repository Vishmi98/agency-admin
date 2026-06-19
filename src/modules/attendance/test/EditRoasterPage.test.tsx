import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import RoasterPage from '@/app/admin/roster/page';


jest.mock('../ui/AttendanceSheet', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="attendance-sheet-mock">Attendance Sheet Mock</div>),
}));

describe('RoasterPage Component', () => {
    const theme = createTheme();

    it('renders the attendance title and legend', async () => {
        render(
            <ThemeProvider theme={theme}>
                <RoasterPage />
            </ThemeProvider>
        );

        // Use a function to match the text
        const attendanceTitle = screen.getByText((content, element) => {
            return element?.textContent === 'Roster: April-2025';
        });

        expect(attendanceTitle).toBeInTheDocument();

        expect(screen.getByText('Leave day')).toBeInTheDocument();
        expect(screen.getByText('Poya day')).toBeInTheDocument();
    });

    // it('renders the AttendanceSheet component', async () => {
    //     render(
    //         <ThemeProvider theme={theme}>
    //             <RoasterPage />
    //         </ThemeProvider>
    //     );

    //     await waitFor(() => {
    //         expect(screen.getByTestId('attendance-sheet-mock')).toBeInTheDocument();
    //     });
    // });

    it('applies correct styling to the container Box', async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RoasterPage />
            </ThemeProvider>
        );

        const box = container.querySelector('.MuiBox-root');
        expect(box).toHaveStyle('width: 100%');
        expect(box).toHaveStyle(`background-color: ${theme.palette.background.paper}`);
        expect(box).toHaveStyle(`color: ${theme.palette.text.primary}`);
        expect(box).toHaveStyle('border-radius: 8px'); // Assert for the actual value
    });

    it('displays the legend boxes with correct background colors', async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RoasterPage />
            </ThemeProvider>
        );

        const legendItems = container.querySelectorAll('.MuiBox-root');

        let leaveBox: Element | null = null;
        let poyaBox: Element | null = null;

        legendItems.forEach((item) => {
            if (item.textContent?.includes('Leave day')) {
                leaveBox = item.querySelector('div');
            }
            if (item.textContent?.includes('Poya day')) {
                poyaBox = item.querySelector('div');
            }
        });

        expect(leaveBox).toHaveStyle('background-color: #70cf97');
        expect(poyaBox).toHaveStyle('background-color: #ff764c');
    });

    // it('renders the AttendanceSheet component with correct props', async () => {
    //     render(
    //         <ThemeProvider theme={theme}>
    //             <RoasterPage />
    //         </ThemeProvider>
    //     );

    //     await waitFor(() => {
    //         const attendanceSheetMock = screen.getByTestId('attendance-sheet-mock');
    //         expect(attendanceSheetMock).toBeInTheDocument();
    //         // Check if the mock has received the correct props
    //         // Note: Mock the component and check passed props using `mock.calls`
    //     });
    // });

});