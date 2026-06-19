import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { InvoiceDataType } from '../invoice.types';

import InvoicesTable from '../ui/InvoicesTable';



const mockInvoices: InvoiceDataType[] = [
    {
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
    },
    {
        id: 2,
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
    },
];

const mockOnPageChange = jest.fn();
const mockOnRowsPerPageChange = jest.fn();
const mockSetSelectedInvoice = jest.fn();
const mockReloadData = jest.fn();

describe('InvoicesTable', () => {
    it('renders loading state initially', async () => {
        render(
            <InvoicesTable
                totalRows={mockInvoices.length}
                invoices={mockInvoices}
                isLoading={true}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedInvoice={null}
                setSelectedInvoice={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    // it('should render invoices table with data', () => {
    //     render(
    //         <InvoicesTable
    //             totalRows={mockInvoices.length}
    //             invoices={mockInvoices}
    //             isLoading={false}
    //             page={0}
    //             limit={5}
    //             onPageChange={mockOnPageChange}
    //             onRowsPerPageChange={mockOnRowsPerPageChange}
    //             selectedInvoice={null}
    //             setSelectedInvoice={mockSetSelectedInvoice}
    //             reloadData={mockReloadData}
    //         />
    //     );

    //     // Check if the table is rendered
    //     expect(screen.getByText('Invoice ID')).toBeInTheDocument();
    //     expect(screen.getByTestId('invoice-package-title')).toHaveTextContent('Package Title');
    //     expect(screen.getByText(/Mr John Doe/)).toBeInTheDocument();
    //     expect(screen.getByText('1000')).toBeInTheDocument();
    //     expect(screen.getByText('500')).toBeInTheDocument();
    //     expect(screen.getByText('Paid')).toBeInTheDocument();
    // });

    it('should show loading message when isLoading is true', () => {
        render(
            <InvoicesTable
                totalRows={0}
                invoices={[]}
                isLoading={true}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedInvoice={null}
                setSelectedInvoice={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        // Check for loading message
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays "No data available" when API returns an empty array', async () => {
        render(
            <InvoicesTable
                totalRows={0}
                invoices={[]}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedInvoice={null}
                setSelectedInvoice={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('displays "No data available" when API fails', async () => {
        render(
            <InvoicesTable
                totalRows={0}
                invoices={[]}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedInvoice={null}
                setSelectedInvoice={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    })

    // it('should call handlePreviewClick when the preview button is clicked', async () => {
    //     render(
    //         <InvoicesTable
    //             totalRows={mockInvoices.length}
    //             invoices={mockInvoices}
    //             isLoading={false}
    //             page={0}
    //             limit={5}
    //             onPageChange={mockOnPageChange}
    //             onRowsPerPageChange={mockOnRowsPerPageChange}
    //             selectedInvoice={null}
    //             setSelectedInvoice={mockSetSelectedInvoice}
    //             reloadData={mockReloadData}
    //         />
    //     );

    //     const previewButton = screen.getAllByRole('img', { name: /preview-button/i })[0];

    //     fireEvent.click(previewButton);

    //     // Check if the modal is open
    //     expect(screen.getByRole('dialog')).toBeInTheDocument();

    //     // Check if the selected invoice details are passed to the modal
    //     expect(mockSetSelectedInvoice).toHaveBeenCalledWith(mockInvoices[0]);
    // });
});
