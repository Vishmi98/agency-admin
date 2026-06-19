import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import MarkOutTimePage from '@/app/admin/mark-out-time/page';


// Mocking components
jest.mock('../ui/SearchAttendanceTable', () => ({
    __esModule: true,
    default: ({ reload, handleReload }: { reload: boolean, handleReload: () => void }) => (
        <div data-testid="attendance-table" onClick={handleReload}>
            {reload ? "Table Reloaded" : "Table Not Reloaded"}
        </div>
    ),
}));

describe('MarkOutTimePage Component', () => {
    const theme = createTheme();

    const renderWithTheme = () =>
        render(
            <ThemeProvider theme={theme}>
                <MarkOutTimePage />
            </ThemeProvider>
        );

    test('renders the Missing Out Time Attendance MarkOutTimePage with title', () => {
        renderWithTheme();
        expect(screen.getByText('Missing Out Time Attendance')).toBeInTheDocument();
    });

    test('renders the SearchAttendance component', () => {
        renderWithTheme();
        // Assuming SearchAttendance component is mocked out
        expect(screen.getByText('Table Not Reloaded')).toBeInTheDocument();
    });

    test('calls handleReload and reloads the table when clicked', () => {
        renderWithTheme();

        const table = screen.getByTestId('attendance-table');
        expect(table).toBeInTheDocument();
        
        // Simulate the reload action
        fireEvent.click(table);

        // Check if table reloads
        expect(screen.getByText('Table Reloaded')).toBeInTheDocument();
    });

    test('reload state changes after clicking reload action', () => {
        renderWithTheme();
        
        const table = screen.getByTestId('attendance-table');
        
        // Initially the table is not reloaded
        expect(screen.getByText('Table Not Reloaded')).toBeInTheDocument();

        // Click to trigger reload
        fireEvent.click(table);

        // After reload, the text should change
        expect(screen.getByText('Table Reloaded')).toBeInTheDocument();
    });
});
