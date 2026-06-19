import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import { getPaymentData } from '../services/payment.services';
import PaymentsPage from '@/app/admin/payments/page';


jest.mock('../services/payment.services', () => ({
    getPaymentData: jest.fn(),
}));

describe('PaymentsPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders PaymentsPage component', () => {
        render(<PaymentsPage />);
        expect(screen.getByText('Payments')).toBeInTheDocument();
    });

    it('fetches and displays payments data', async () => {
        (getPaymentData as jest.Mock).mockResolvedValue({
            success: true,
            payments: [{
                id: 1,
                invoiceId: 1,
                paymentDate: '2023-01-01',
                amountLkr: 1000,
                studentId: 1,
                paymentType: 1,
                createdBy: 1,
                invoiceInfo: { id: 1, packageId: 1, packageInfo: { id: 1, title: 'Package 1' } },
                studentInfo: { id: 1, fullName: 'John Doe', passportNo: '123456789' },
                staffInfo: { id: 1, fullName: 'Jane Smith' },
                branchInfo: { title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'Branch 1' }, id: 1 },
                paymentTypeInfo: { title: { SN: 'Cash', EN: 'Cash', TM: 'Cash' }, id: 1 },
            }],
            totalPayments: 1,
        });

        await act(async () => {
            render(<PaymentsPage />);
        });
    });

    it('handles search input', async () => {
        (getPaymentData as jest.Mock).mockResolvedValue({
            success: true,
            payments: [{
                id: 1,
                invoiceId: 1,
                paymentDate: '2023-01-01',
                amountLkr: 1000,
                studentId: 1,
                paymentType: 1,
                createdBy: 1,
                invoiceInfo: { id: 1, packageId: 1, packageInfo: { id: 1, title: 'Package 1' } },
                studentInfo: { id: 1, fullName: 'John Doe', passportNo: '123456789' },
                staffInfo: { id: 1, fullName: 'Jane Smith' },
                branchInfo: { title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'Branch 1' }, id: 1 },
                paymentTypeInfo: { title: { SN: 'Cash', EN: 'Cash', TM: 'Cash' }, id: 1 },
            }],
            totalPayments: 1,
        });

        render(<PaymentsPage />);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 1000 } });

        const searchButton = screen.getByRole('button', { name: 'Search' });
        await act(async () => {
            fireEvent.click(searchButton);
        });

        await waitFor(() => {
            expect(getPaymentData).toHaveBeenLastCalledWith(1, 5, "1000");
        });
    });

    it('clears search input', async () => {
        (getPaymentData as jest.Mock).mockResolvedValue({
            success: true,
            payments: [],
            totalPayments: 0,
        });

        render(<PaymentsPage />);

        const clearButton = screen.getByRole('button', { name: 'Clear' });
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(getPaymentData).toHaveBeenCalledWith(1, 5, '');
        });
    });
});

