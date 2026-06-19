import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { getPaymentTypes } from '../services/paymentTypes.services';
import PaymentTypesTable from '../ui/PaymentTypesTable';


// Mock the API function
jest.mock('../services/paymentTypes.services', () => ({
    getPaymentTypes: jest.fn(),
}));

describe('Payment types Component', () => {
    it('renders loading state initially', async () => {
        render(<PaymentTypesTable />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders "no data available" when there are no paymentTypes', async () => {
        // Mock API call to return no paymentTypes
        (getPaymentTypes as jest.Mock).mockResolvedValue({
            success: true,
            paymentTypes: [],
        });

        render(<PaymentTypesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('renders country data when API call is successful', async () => {
        // Mock the API call to return sample paymentTypes data
        (getPaymentTypes as jest.Mock).mockResolvedValue({
            success: true,
            paymentTypes: [
                { id: 1, title: { EN: 'Registration', TM: 'Registration', SN: 'Registration' } },
            ],
        });

        render(<PaymentTypesTable />);

        // Wait for the data to be loaded
        await waitFor(() => {
            // Ensure the country data is rendered
            expect(screen.getByText('Registration')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getPaymentTypes as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<PaymentTypesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
