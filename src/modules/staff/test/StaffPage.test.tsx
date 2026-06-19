import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';

import StaffPage from '../../../app/admin/staff/page';


// Mock StaffTable component
jest.mock('../../../modules/staff/ui/StaffTable', () => jest.fn(() => <div data-testid="staff-table" />));

const renderWithTheme = (theme: any) =>
    render(
        <ThemeProvider theme={theme}>
            <StaffPage />
        </ThemeProvider>
    );

describe('StaffPage Component', () => {
    it('renders StaffPage component correctly', () => {
        renderWithTheme(createTheme());

        // Check if title is displayed
        expect(screen.getByText('Staff')).toBeInTheDocument();

        // Check if StaffTable is rendered
        expect(screen.getByTestId('staff-table')).toBeInTheDocument();
    });

    it('calls StaffTable component once', () => {
        const { container } = renderWithTheme(createTheme());

        // Ensure StaffTable is in the document
        expect(screen.getByTestId('staff-table')).toBeInTheDocument();

        // Ensure only one instance of StaffTable is rendered
        expect(container.querySelectorAll('[data-testid="staff-table"]').length).toBe(1);
    });

    it('renders the main Box container', () => {
        const { container } = renderWithTheme(createTheme());

        // Ensure the Box container exists
        expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('renders correctly in dark theme', () => {
        const darkTheme = createTheme({ palette: { mode: 'dark' } });
        renderWithTheme(darkTheme);

        // Ensure the page is still rendered properly in dark mode
        expect(screen.getByText('Staff')).toBeInTheDocument();
        expect(screen.getByTestId('staff-table')).toBeInTheDocument();
    });

    it('renders correctly in light theme', () => {
        const lightTheme = createTheme({ palette: { mode: 'light' } });
        renderWithTheme(lightTheme);

        // Ensure the page is still rendered properly in light mode
        expect(screen.getByText('Staff')).toBeInTheDocument();
        expect(screen.getByTestId('staff-table')).toBeInTheDocument();
    });
});
