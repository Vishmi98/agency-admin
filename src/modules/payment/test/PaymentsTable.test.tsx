import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { PaymentDataType } from '../payment.types';
import PaymentsTable from '../ui/PaymentsTable';


const mockPayments: PaymentDataType[] = [
    {
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
    },
    {
        id: 2,
        invoiceId: 2,
        paymentDate: '2023-01-03',
        amountLkr: 1500,
        studentId: 1,
        paymentType: 1,
        createdBy: 1,
        invoiceInfo: { id: 1, packageId: 1, packageInfo: { id: 1, title: 'Package 1' } },
        studentInfo: { id: 1, fullName: 'John Doe', passportNo: '123456789' },
        staffInfo: { id: 1, fullName: 'Jane Smith' },
        branchInfo: { title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'Branch 1' }, id: 1 },
        paymentTypeInfo: { title: { SN: 'Cash', EN: 'Cash', TM: 'Cash' }, id: 1 },
    },
];

const mockOnPageChange = jest.fn();
const mockOnRowsPerPageChange = jest.fn();
const mockSetSelectedInvoice = jest.fn();
const mockReloadData = jest.fn();

describe('PaymentsTable', () => {
    it('renders loading state initially', async () => {
        render(
            <PaymentsTable
                totalRows={mockPayments.length}
                payments={mockPayments}
                isLoading={true}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedPayment={null}
                setSelectedPayment={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    // it('should render payments table with data', () => {
    //     render(
    //         <PaymentsTable
    //             totalRows={mockPayments.length}
    //             payments={mockPayments}
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
            <PaymentsTable
                totalRows={0}
                payments={[]}
                isLoading={true}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedPayment={null}
                setSelectedPayment={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        // Check for loading message
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays "No data available" when API returns an empty array', async () => {
        render(
            <PaymentsTable
                totalRows={0}
                payments={[]}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedPayment={null}
                setSelectedPayment={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('displays "No data available" when API fails', async () => {
        render(
            <PaymentsTable
                totalRows={0}
                payments={[]}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedPayment={null}
                setSelectedPayment={mockSetSelectedInvoice}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    })

    // it('should call handlePreviewClick when the preview button is clicked', async () => {
    //     render(
    //         <PaymentsTable
    //             totalRows={mockPayments.length}
    //             payments={mockPayments}
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
    //     expect(mockSetSelectedInvoice).toHaveBeenCalledWith(mockPayments[0]);
    // });
});
