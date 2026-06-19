import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { getExtraPaymentData } from '../services/extraPayment.services';
import ExtraPaymentsTable from '../ui/ExtraPaymentsTable';


// Mock the API function
jest.mock('../services/extraPayment.services', () => ({
    getExtraPaymentData: jest.fn(),
}));

describe('ExtraPaymentsTable Component', () => {
    beforeEach(() => {
        // Mock JWT token in localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-jwt-token'),
            },
            writable: true,
        });
    });

    it('renders loading state initially', async () => {
        render(<ExtraPaymentsTable />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders "No data available" when API returns empty', async () => {
        (getExtraPaymentData as jest.Mock).mockResolvedValue({
            success: true,
            extraPayments: [],
        });

        render(<ExtraPaymentsTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('renders extra payments data when API call is successful', async () => {
        (getExtraPaymentData as jest.Mock).mockResolvedValue({
            success: true,
            extraPayments: [
                {
                    title: {
                        SN: "Performance Bonus",
                        EN: "Performance Bonus",
                        TM: "Performance Bonus"
                    },
                    id: 1,
                    amount: 500,
                    currency: "USD"
                },
                {
                    title: {
                        SN: "New Year Bonus",
                        EN: "New Year Bonus",
                        TM: "New Year Bonus"
                    },
                    id: 2,
                    amount: 1000,
                    currency: "USD"
                },],
        });

        render(<ExtraPaymentsTable />);

        await waitFor(() => {
            expect(screen.getByText('New Year Bonus')).toBeInTheDocument();
            expect(screen.getByText('Performance Bonus')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getExtraPaymentData as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<ExtraPaymentsTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
