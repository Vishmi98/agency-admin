import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { getExpensesTypesData } from '../services/expenseTypes.services';
import ExpensesTypesTable from '../ui/ExpensesTypesTable';


// Mock the API function
jest.mock('../services/expenseTypes.services', () => ({
    getExpensesTypesData: jest.fn(),
}));

describe('Expenses types component', () => {
    it('renders loading state initially', async () => {
        render(<ExpensesTypesTable />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders "no data available" when there are no expenseTypes', async () => {
        // Mock API call to return no expenseTypes
        (getExpensesTypesData as jest.Mock).mockResolvedValue({
            success: true,
            expenseTypes: [],
        });

        render(<ExpensesTypesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('renders country data when API call is successful', async () => {
        // Mock the API call to return sample expenseTypes data
        (getExpensesTypesData as jest.Mock).mockResolvedValue({
            success: true,
            expenseTypes: [
                { id: 1, title: { SN: 'Registration', EN: 'Registration', TM: 'Registration' } },
                { id: 2, title: { SN: 'Telephone bill', EN: 'Telephone bill', TM: 'Telephone bill' } },
            ],
        });

        render(<ExpensesTypesTable />);

        // Wait for the data to be loaded
        await waitFor(() => {
            // Ensure the country data is rendered
            expect(screen.getByText('Registration')).toBeInTheDocument();
            expect(screen.getByText('Telephone bill')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getExpensesTypesData as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<ExpensesTypesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
