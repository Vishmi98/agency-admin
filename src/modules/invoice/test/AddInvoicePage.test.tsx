import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import AddInvoicePage from '@/app/admin/add-invoice/page';



jest.mock('../ui/AddInvoice/AddInvoice', () => {
    const MockAddInvoice = () => <div data-testid="add-invoice-component" />;
    MockAddInvoice.displayName = 'AddInvoice'; // Add display name here
    return MockAddInvoice;
});

describe('AddInvoicePage', () => {
    it('renders without crashing', () => {
        const theme = createTheme();
        render(
            <ThemeProvider theme={theme}>
                <AddInvoicePage />
            </ThemeProvider>
        );
    });

    it('displays the correct heading', () => {
        const theme = createTheme();
        render(
            <ThemeProvider theme={theme}>
                <AddInvoicePage />
            </ThemeProvider>
        );
        expect(screen.getByText('Add Invoice')).toBeInTheDocument();
    });

    it('renders the AddInvoice component', () => {
        const theme = createTheme();
        render(
            <ThemeProvider theme={theme}>
                <AddInvoicePage />
            </ThemeProvider>
        );
        expect(screen.getByTestId('add-invoice-component')).toBeInTheDocument();
    });
});
