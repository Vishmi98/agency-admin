import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { StudentDataType } from '../student.types';
import StudentsTable from '../ui/StudentsTable';


const mockStudents: StudentDataType[] = [
    {
        id: 1,
        title: 1,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        passportNo: 'A1234567',
        issueDate: '2021-01-01',
        expireDate: '2026-01-01',
        phone: '1234567890',
        visaIssueDate: '2021-01-01',
        visaExpireDate: '2026-01-01',
        email: 'john.doe@example.com',
        address: '123 Main St',
        nic: '987654321V',
        createdBy: 1,
        visaStatus: 1,
        status: 1,
        branchId: 1,
        titleInfo: { title: { SN: 'Mr.', EN: 'Mr.', TM: 'திரு' }, id: 1 },
        statusInfo: { title: { SN: 'Active', EN: 'Active', TM: 'செயலில்' }, id: 1 },
        visaStatusInfo: { title: { SN: 'Valid', EN: 'Valid', TM: 'சரியானது' }, id: 1 },
        branchInfo: { title: { SN: 'Branch 1', EN: 'Branch 1', TM: 'கிளை 1' }, id: 1 },
    },
    {
        id: 2,
        title: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        fullName: 'Jane Doe',
        passportNo: 'B2345678',
        issueDate: '2021-02-01',
        expireDate: '2026-02-01',
        phone: '2345678901',
        visaIssueDate: '2021-02-01',
        visaExpireDate: '2026-02-01',
        email: 'jane.doe@example.com',
        address: '456 Main St',
        nic: '876543210V',
        createdBy: 2,
        visaStatus: 2,
        status: 2,
        branchId: 2,
        titleInfo: { title: { SN: 'Ms.', EN: 'Ms.', TM: 'கனியாள்' }, id: 2 },
        statusInfo: { title: { SN: 'Inactive', EN: 'Inactive', TM: 'செயலற்ற' }, id: 2 },
        visaStatusInfo: { title: { SN: 'Expired', EN: 'Expired', TM: 'முடிந்தது' }, id: 2 },
        branchInfo: { title: { SN: 'Branch 2', EN: 'Branch 2', TM: 'கிளை 2' }, id: 2 },
    },
];

const mockOnPageChange = jest.fn();
const mockOnRowsPerPageChange = jest.fn();
const mockSetSelectedStudent = jest.fn();
const mockReloadData = jest.fn();

describe('StudentsTable', () => {
    it('should render students table with data', () => {
        render(
            <StudentsTable
                totalRows={mockStudents.length}
                students={mockStudents}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedStudent={null}
                setSelectedStudent={mockSetSelectedStudent}
                reloadData={mockReloadData}
            />
        );

        // Check if the table is rendered
        expect(screen.getByText('Student Name')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
    });

    it('should show loading message when isLoading is true', () => {
        render(
            <StudentsTable
                totalRows={0}
                students={[]}
                isLoading={true}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedStudent={null}
                setSelectedStudent={mockSetSelectedStudent}
                reloadData={mockReloadData}
            />
        );

        // Check for loading message
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should call handleEditClick when the edit button is clicked', async () => {
        render(
            <StudentsTable
                totalRows={mockStudents.length}
                students={mockStudents}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                selectedStudent={null}
                setSelectedStudent={mockSetSelectedStudent}
                reloadData={mockReloadData}
            />
        );

        // Find the edit button and click it
        const editButton = screen.getAllByLabelText('edit')[0];
        fireEvent.click(editButton);

        // Check if setSelectedStudent was called
        expect(mockSetSelectedStudent).toHaveBeenCalledWith(mockStudents[0]);
    });

    // it('should display the expanded content when expand button is clicked', async () => {
    //     render(
    //         <StudentsTable
    //             totalRows={mockStudents.length}
    //             students={mockStudents}
    //             isLoading={false}
    //             page={0}
    //             limit={5}
    //             onPageChange={mockOnPageChange}
    //             onRowsPerPageChange={mockOnRowsPerPageChange}
    //             selectedStudent={null}
    //             setSelectedStudent={mockSetSelectedStudent}
    //             reloadData={mockReloadData}
    //         />
    //     );

    //     // Click the expand button for the first row
    //     const expandButton = screen.getAllByLabelText('expand more');
    //     fireEvent.click(expandButton[0]);

    //     // Ensure the expanded content is displayed
    //     await waitFor(() => {
    //         expect(screen.getByText('Passport Details:')).toBeInTheDocument();
    //         expect(screen.getByText('Full Name: John Doe')).toBeInTheDocument();  // Ensure mockStudents contains this data
    //     });
    // });

    // it('should handle pagination and rows per page change', () => {
    //     render(
    //         <StudentsTable
    //             totalRows={mockStudents.length}
    //             students={mockStudents}
    //             isLoading={false}
    //             page={0}
    //             limit={5}
    //             onPageChange={mockOnPageChange}
    //             onRowsPerPageChange={mockOnRowsPerPageChange}
    //             selectedStudent={null}
    //             setSelectedStudent={mockSetSelectedStudent}
    //             reloadData={mockReloadData}
    //         />
    //     );

    //     // Trigger page change
    //     fireEvent.change(screen.getByLabelText('Rows per page'), { target: { value: '10' } });
    //     expect(mockOnRowsPerPageChange).toHaveBeenCalledWith(10);

    //     fireEvent.click(screen.getByLabelText('Go to next page'));
    //     expect(mockOnPageChange).toHaveBeenCalledWith(1);
    // });
});
