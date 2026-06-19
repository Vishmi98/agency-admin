/* eslint-disable no-unused-vars */
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import AttendancePage from '@/app/admin/attendance/page';


jest.mock('../ui/SearchAttendance', () => ({
    __esModule: true,
    default: ({ onSearch }: { onSearch: (date: string) => void }) => (
        <button onClick={() => onSearch('2024-07-25')} data-testid="search-attendance">
            Search Attendance
        </button>
    ),
}));

jest.mock('../ui/SearchAttendanceTable', () => ({
    __esModule: true,
    default: ({ reload, handleReload }: { reload: boolean; handleReload: () => void }) => (
        <div data-testid="attendance-table">
            <p data-testid="reload-status">{reload ? 'Reloaded' : 'Not Reloaded'}</p>
            <button onClick={handleReload} data-testid="reload-button">Reload</button>
        </div>
    ),
}));

describe('AttendancePage Component', () => {
    const theme = createTheme();

    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <AttendancePage />
            </ThemeProvider>
        );

        expect(screen.getByTestId('search-attendance')).toBeInTheDocument();
        expect(screen.getByTestId('attendance-table')).toBeInTheDocument();
    });

    it('updates the date and reloads table on search', () => {
        render(
            <ThemeProvider theme={theme}>
                <AttendancePage />
            </ThemeProvider>
        );

        const searchButton = screen.getByTestId('search-attendance');
        fireEvent.click(searchButton);

        expect(screen.getByTestId('reload-status')).toHaveTextContent('Reloaded');
    });

    it('reloads the table when handleReload is triggered', () => {
        render(
            <ThemeProvider theme={theme}>
                <AttendancePage />
            </ThemeProvider>
        );

        const reloadButton = screen.getByTestId('reload-button');
        fireEvent.click(reloadButton);

        expect(screen.getByTestId('reload-status')).toHaveTextContent('Reloaded');
    });
});