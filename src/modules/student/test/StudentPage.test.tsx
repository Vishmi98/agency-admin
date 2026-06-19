import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import { getStudentData } from '../services/student.services';
import StudentPage from '@/app/admin/students/page';


jest.mock('../services/student.services', () => ({
    getStudentData: jest.fn(),
}));

describe('StudentPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders StudentPage component', () => {
        render(<StudentPage />);
        expect(screen.getByText('Students')).toBeInTheDocument();
    });

    it('fetches and displays student data', async () => {
        (getStudentData as jest.Mock).mockResolvedValue({
            success: true,
            students: [{
                id: 1,
                title: 1,
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe',
                passportNo: '123456789',
                issueDate: '2023-01-01',
                expireDate: '2028-01-01',
                phone: '123-456-7890',
                visaIssueDate: '2023-02-01',
                visaExpireDate: '2024-02-01',
                email: 'john.doe@example.com',
                address: '123 Main St',
                nic: '987654321',
                createdBy: 1,
                visaStatus: 1,
                status: 1,
                branchId: 1,
                titleInfo: { title: { SN: 'Mr', EN: 'Mr', TM: 'Mr' }, id: 1 },
                statusInfo: { title: { SN: 'Active', EN: 'Active', TM: 'Active' }, id: 1 },
                visaStatusInfo: { title: { SN: 'Pending', EN: 'Pending', TM: 'Pending' }, id: 1 },
                branchInfo: { title: { SN: 'Colombo', EN: 'Colombo', TM: 'Colombo' }, id: 1 },
            }],
            total: 1,
        });

        await act(async () => {
            render(<StudentPage />);
        });

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    it('handles search input', async () => {
        (getStudentData as jest.Mock).mockResolvedValue({
            success: true,
            students: [{
                id: 1,
                title: 1,
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe',
                passportNo: '123456789',
                issueDate: '2023-01-01',
                expireDate: '2028-01-01',
                phone: '123-456-7890',
                visaIssueDate: '2023-02-01',
                visaExpireDate: '2024-02-01',
                email: 'john.doe@example.com',
                address: '123 Main St',
                nic: '987654321',
                createdBy: 1,
                visaStatus: 1,
                status: 1,
                branchId: 1,
                titleInfo: { title: { SN: 'Mr', EN: 'Mr', TM: 'Mr' }, id: 1 },
                statusInfo: { title: { SN: 'Active', EN: 'Active', TM: 'Active' }, id: 1 },
                visaStatusInfo: { title: { SN: 'Pending', EN: 'Pending', TM: 'Pending' }, id: 1 },
                branchInfo: { title: { SN: 'Colombo', EN: 'Colombo', TM: 'Colombo' }, id: 1 },
            }],
            total: 1,
        });

        render(<StudentPage />);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'John' } });

        const searchButton = screen.getByRole('button', { name: 'Search' });
        await act(async () => {
            fireEvent.click(searchButton);
        });

        await waitFor(() => {
            expect(getStudentData).toHaveBeenCalledWith(1, 5, 'John');
        });
    });

    it('clears search input', async () => {
        (getStudentData as jest.Mock).mockResolvedValue({
            success: true,
            students: [],
            total: 0,
        });

        render(<StudentPage />);

        const clearButton = screen.getByRole('button', { name: 'Clear' });
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(getStudentData).toHaveBeenCalledWith(1, 5, '');
        });
    });
});

