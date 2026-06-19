import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import { getInvoiceData } from '../services/invoice.services';
import InvoicesPage from '@/app/admin/invoices/page';


jest.mock('../services/invoice.services', () => ({
    getInvoiceData: jest.fn(),
}));

describe('InvoicesPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders InvoicesPage component', () => {
        render(<InvoicesPage />);
        expect(screen.getByText('Invoices')).toBeInTheDocument();
    });

    it('fetches and displays invoices data', async () => {
        (getInvoiceData as jest.Mock).mockResolvedValue({
            success: true,
            invoices: [{
                id: 1,
                packageId: 1,
                invoiceDate: '2023-01-01',
                extraPayment: [10, 20],
                totalPrice: 1000,
                dueAmount: 500,
                studentId: 1,
                staffId: 1,
                exchangeRate: 300,
                currency: 'USD',
                branchId: 1,
                status: 1,
                packageInfo: { id: 1, title: 'Package 1', price: 1000 },
                extraPaymentInfo: [
                    { id: 1, title: { SN: 'Extra 1', EN: 'Extra 1', TM: 'Extra 1' }, amount: 10, currency: 'USD' },
                    { id: 2, title: { SN: 'Extra 2', EN: 'Extra 2', TM: 'Extra 2' }, amount: 20, currency: 'USD' },
                ],
                studentInfo: { id: 1, firstName: 'John', lastName: 'Doe', phone: '123', email: 'john@doe.com', titleInfo: { title: { SN: 'Mr', EN: 'Mr', TM: 'Mr' }, id: 1 } },
                staffInfo: { id: 1, firstName: 'Jane', lastName: 'Smith' },
                branchInfo: { id: 1, title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'Branch 1' } },
                paymentInfo: [{ id: 1, paymentDate: '2023-01-02', amountLkr: 500 }],
                statusInfo: { id: 1, title: { SN: 'Paid', EN: 'Paid', TM: 'Paid' }, color: 'green' },
            }],
            totalInvoices: 1,
        });

        await act(async () => {
            render(<InvoicesPage />);
        });

        await waitFor(() => {
            expect(screen.getByText('Package 1')).toBeInTheDocument();
        });
    });

    it('handles search input', async () => {
        (getInvoiceData as jest.Mock).mockResolvedValue({
            success: true,
            invoices: [{
                id: 1,
                packageId: 1,
                invoiceDate: '2023-01-01',
                extraPayment: [10, 20],
                totalPrice: 1000,
                dueAmount: 500,
                studentId: 1,
                staffId: 1,
                exchangeRate: 300,
                currency: 'USD',
                branchId: 1,
                status: 1,
                packageInfo: { id: 1, title: 'Package 1', price: 1000 },
                extraPaymentInfo: [
                    { id: 1, title: { SN: 'Extra 1', EN: 'Extra 1', TM: 'Extra 1' }, amount: 10, currency: 'USD' },
                    { id: 2, title: { SN: 'Extra 2', EN: 'Extra 2', TM: 'Extra 2' }, amount: 20, currency: 'USD' },
                ],
                studentInfo: { id: 1, firstName: 'John', lastName: 'Doe', phone: '123', email: 'john@doe.com', titleInfo: { title: { SN: 'Mr', EN: 'Mr', TM: 'Mr' }, id: 1 } },
                staffInfo: { id: 1, firstName: 'Jane', lastName: 'Smith' },
                branchInfo: { id: 1, title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'Branch 1' } },
                paymentInfo: [{ id: 1, paymentDate: '2023-01-02', amountLkr: 500 }],
                statusInfo: { id: 1, title: { SN: 'Paid', EN: 'Paid', TM: 'Paid' }, color: 'green' },
            }],
            totalInvoices: 1,
        });

        render(<InvoicesPage />);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'USD' } });

        const searchButton = screen.getByRole('button', { name: 'Search' });
        await act(async () => {
            fireEvent.click(searchButton);
        });

        await waitFor(() => {
            expect(getInvoiceData).toHaveBeenCalledWith(1, 5, 'USD');
        });
    });

    it('clears search input', async () => {
        (getInvoiceData as jest.Mock).mockResolvedValue({
            success: true,
            invoices: [],
            totalInvoices: 0,
        });

        render(<InvoicesPage />);

        const clearButton = screen.getByRole('button', { name: 'Clear' });
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(getInvoiceData).toHaveBeenCalledWith(1, 5, '');
        });
    });
});

