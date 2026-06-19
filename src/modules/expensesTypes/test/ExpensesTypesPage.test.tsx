import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import ExpensesTypesPage from '@/app/admin/expenses-types/page';


// Mocking ExpensesTypesTable and AddExpenseTypeModal components
jest.mock('../../../modules/expensesTypes/ui/ExpensesTypesTable', () => jest.fn(() => <div data-testid="expensesTypes-table" />));
jest.mock('../../../modules/expensesTypes/ui/AddExpenseTypeModal', () => jest.fn(({ isOpen, onClose, handleReload }) => (
    isOpen ? <div data-testid="add-expensesTypes-modal">
        <button onClick={() => { 
            onClose();        // Close the modal
            handleReload();   // Call handleReload
        }}>Close</button>
    </div> : null
)));

describe('ExpensesTypesPage Component', () => {
    it('renders ExpensesTypesPage component correctly', () => {
        render(<ExpensesTypesPage />);

        // Check if the title is displayed
        expect(screen.getByText('Expenses Types')).toBeInTheDocument();

        // Check if ExpensesTypesTable is rendered
        expect(screen.getByTestId('expensesTypes-table')).toBeInTheDocument();

        // Check if AddExpenseTypeModal is rendered (hidden by default)
        expect(screen.queryByTestId('add-expensesTypes-modal')).not.toBeInTheDocument();
    });

    it('opens AddExpenseTypeModal when Add Expenses Type button is clicked', () => {
        render(<ExpensesTypesPage />);

        // Click the Add Expenses Type button
        fireEvent.click(screen.getByText('Add Expenses Type'));

        // Check if AddExpenseTypeModal is now open
        expect(screen.getByTestId('add-expensesTypes-modal')).toBeInTheDocument();
    });

    it('calls ExpensesTypesTable component once', () => {
        const { container } = render(<ExpensesTypesPage />);

        // Ensure ExpensesTypesTable is in the document
        expect(screen.getByTestId('expensesTypes-table')).toBeInTheDocument();

        // Ensure only one instance of ExpensesTypesTable is rendered
        expect(container.querySelectorAll('[data-testid="expensesTypes-table"]').length).toBe(1);
    });

    it('closes AddExpenseTypeModal when Close button is clicked', () => {
        render(<ExpensesTypesPage />);

        // Open the modal
        fireEvent.click(screen.getByText('Add Expenses Type'));

        // Close the modal
        fireEvent.click(screen.getByText('Close'));

        // Ensure AddExpenseTypeModal is closed
        expect(screen.queryByTestId('add-expensesTypes-modal')).not.toBeInTheDocument();
    });

    // it('calls handleReload when the modal is closed', () => {
    //     const handleReload = jest.fn();
    //     render(<ExpensesTypesPage />);

    //     // Open the modal
    //     fireEvent.click(screen.getByText('Add Expenses Types'));

    //     // Simulate modal close (e.g., "Close" button clicked)
    //     fireEvent.click(screen.getByText('Close'));

    //     // Ensure handleReload was called after closing the modal
    //     expect(handleReload).toHaveBeenCalledTimes(1);
    // });
});
