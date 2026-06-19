import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import PaymentTypesPage from '@/app/admin/payment-types/page';


// Mocking PaymentTypesTable and AddPaymentTypeModal components
jest.mock('../../../modules/paymentTypes/ui/PaymentTypesTable', () => jest.fn(() => <div data-testid="paymentTypes-table" />));
jest.mock('../../../modules/paymentTypes/ui/AddPaymentTypeModal', () => jest.fn(({ isOpen, onClose, handleReload }) => (
    isOpen ? <div data-testid="add-paymentTypes-modal">
        <button onClick={() => { 
            onClose();        // Close the modal
            handleReload();   // Call handleReload
        }}>Close</button>
    </div> : null
)));

describe('PaymentTypesPage Component', () => {
    it('renders PaymentTypesPage component correctly', () => {
        render(<PaymentTypesPage />);

        // Check if the title is displayed
        expect(screen.getByText('Payment Types')).toBeInTheDocument();

        // Check if PaymentTypesTable is rendered
        expect(screen.getByTestId('paymentTypes-table')).toBeInTheDocument();

        // Check if AddPaymentTypeModal is rendered (hidden by default)
        expect(screen.queryByTestId('add-paymentTypes-modal')).not.toBeInTheDocument();
    });

    it('opens AddPaymentTypeModal when Add Payment Type button is clicked', () => {
        render(<PaymentTypesPage />);

        // Click the Add Payment Types button
        fireEvent.click(screen.getByText('Add Payment Type'));

        // Check if AddPaymentTypeModal is now open
        expect(screen.getByTestId('add-paymentTypes-modal')).toBeInTheDocument();
    });

    it('calls PaymentTypesTable component once', () => {
        const { container } = render(<PaymentTypesPage />);

        // Ensure PaymentTypesTable is in the document
        expect(screen.getByTestId('paymentTypes-table')).toBeInTheDocument();

        // Ensure only one instance of PaymentTypesTable is rendered
        expect(container.querySelectorAll('[data-testid="paymentTypes-table"]').length).toBe(1);
    });

    it('closes AddPaymentTypeModal when Close button is clicked', () => {
        render(<PaymentTypesPage />);

        // Open the modal
        fireEvent.click(screen.getByText('Add Payment Type'));

        // Close the modal
        fireEvent.click(screen.getByText('Close'));

        // Ensure AddPaymentTypeModal is closed
        expect(screen.queryByTestId('add-paymentTypes-modal')).not.toBeInTheDocument();
    });

    // it('calls handleReload when the modal is closed', () => {
    //     const handleReload = jest.fn();
    //     render(<PaymentTypesPage />);

    //     // Open the modal
    //     fireEvent.click(screen.getByText('Add Payment Types'));

    //     // Simulate modal close (e.g., "Close" button clicked)
    //     fireEvent.click(screen.getByText('Close'));

    //     // Ensure handleReload was called after closing the modal
    //     expect(handleReload).toHaveBeenCalledTimes(1);
    // });
});
