import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import ExtraPaymentsPage from '@/app/admin/extra-payments/page';


// Mocking ExtraPaymentsTable and AddExtraPaymentModal components
jest.mock('../../../modules/extraPayment/ui/ExtraPaymentsTable', () => jest.fn(() => <div data-testid="extraPayment-table" />));
jest.mock('../../../modules/extraPayment/ui/AddExtraPaymentModal', () => jest.fn(({ isOpen, onClose, handleReload }) => (
    isOpen ? <div data-testid="add-extraPayment-modal">
        <button onClick={() => { 
            onClose();        // Close the modal
            handleReload();   // Call handleReload
        }}>Close</button>
    </div> : null
)));

describe('ExtraPaymentsPage Component', () => {
    it('renders ExtraPaymentsPage component correctly', () => {
        render(<ExtraPaymentsPage />);

        // Check if the title is displayed
        expect(screen.getByText('Extra Payments')).toBeInTheDocument();

        // Check if ExtraPaymentsTable is rendered
        expect(screen.getByTestId('extraPayment-table')).toBeInTheDocument();

        // Check if AddExtraPaymentModal is rendered (hidden by default)
        expect(screen.queryByTestId('add-extraPayment-modal')).not.toBeInTheDocument();
    });

    it('opens AddExtraPaymentModal when Add Extra Payment button is clicked', () => {
        render(<ExtraPaymentsPage />);

        // Click the Add Extra Payment button
        fireEvent.click(screen.getByText('Add Extra Payment'));

        // Check if AddExtraPaymentModal is now open
        expect(screen.getByTestId('add-extraPayment-modal')).toBeInTheDocument();
    });

    it('calls ExtraPaymentsTable component once', () => {
        const { container } = render(<ExtraPaymentsPage />);

        // Ensure ExtraPaymentsTable is in the document
        expect(screen.getByTestId('extraPayment-table')).toBeInTheDocument();

        // Ensure only one instance of ExtraPaymentsTable is rendered
        expect(container.querySelectorAll('[data-testid="extraPayment-table"]').length).toBe(1);
    });

    it('closes AddExtraPaymentModal when Close button is clicked', () => {
        render(<ExtraPaymentsPage />);

        // Open the modal
        fireEvent.click(screen.getByText('Add Extra Payment'));

        // Close the modal
        fireEvent.click(screen.getByText('Close'));

        // Ensure AddExtraPaymentModal is closed
        expect(screen.queryByTestId('add-extraPayment-modal')).not.toBeInTheDocument();
    });

    // it('calls handleReload when the modal is closed', () => {
    //     const handleReload = jest.fn();
    //     render(<ExtraPaymentsPage />);

    //     // Open the modal
    //     fireEvent.click(screen.getByText('Add Extra Payments'));

    //     // Simulate modal close (e.g., "Close" button clicked)
    //     fireEvent.click(screen.getByText('Close'));

    //     // Ensure handleReload was called after closing the modal
    //     expect(handleReload).toHaveBeenCalledTimes(1);
    // });
});
