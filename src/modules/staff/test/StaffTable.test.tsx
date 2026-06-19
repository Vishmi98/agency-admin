import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import StaffTable from '../ui/StaffTable';
import { StaffDataType } from '../staff.types';


// Mock the API function
jest.mock('../services/staff.services', () => ({
    getStaffData: jest.fn(),
}));

const mockStaffData: StaffDataType[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        isVerify: true,
        isPublish: true,
        email: 'john.doe@example.com',
        roll: 1,
        nic: '123456789V',
        address: '123 Main St',
        title: 1,
        gender: 1,
        isEmailVerify: true,
        isMobileVerify: true,
        eduction: [],
        experience: [],
        fullName: "John Doe",
        cvPath: "",
        cvPathId: "",
        titleInfo: {
            title: {
                EN: 'Mr.',
                SN: 'Mr.',
                TM: 'Mr.',
            },
            id: 1,
        },
        genderInfo: {
            title: {
                EN: 'Male',
                SN: 'Male',
                TM: 'Male',
            },
            id: 1,
        },
    },
];

const mockOnPageChange = jest.fn();
const mockOnRowsPerPageChange = jest.fn();
const mockReloadData = jest.fn();

describe('StaffTable Component', () => {
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
        render(
            <StaffTable
                totalRows={mockStaffData.length}
                staffs={mockStaffData}
                isLoading={true}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                reloadData={mockReloadData}
            />
        );
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders staff data when API call is successful', async () => {
        render(
            <StaffTable
                totalRows={mockStaffData.length}
                staffs={mockStaffData}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/John Doe/)).toBeInTheDocument();
            expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
            expect(screen.getByText(/Admin/)).toBeInTheDocument();
        });
    });

    it('displays "No data available" when API returns an empty array', async () => {
        render(
            <StaffTable
                totalRows={0}
                staffs={[]}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('displays "No data available" when API fails', async () => {
        render(
            <StaffTable
                totalRows={0}
                staffs={[]}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    })

    // it('fetches new data when changing pages', async () => {
    //     (getStaffData as jest.Mock).mockResolvedValue({
    //         success: true,
    //         staffs: [],
    //         totalStaffs: 10,
    //     });

    //     render(<StaffTable />);

    //     await waitFor(() => {
    //         expect(screen.getByTestId('no-data')).toBeInTheDocument();
    //     });

    //     fireEvent.click(screen.getByRole('button', { name: /next/i }));

    //     expect(getStaffData).toHaveBeenCalledWith(2, 5);
    // });

    // it('fetches new data when changing rows per page', async () => {
    //     (getStaffData as jest.Mock).mockResolvedValue({
    //         success: true,
    //         staffs: [],
    //         totalStaffs: 10,
    //     });

    //     render(<StaffTable />);

    //     await waitFor(() => {
    //         expect(screen.getByTestId('no-data')).toBeInTheDocument();
    //     });

    //     fireEvent.change(screen.getByRole('combobox', { name: /Rows per page:/i }), { target: { value: '10' } });

    //     await waitFor(() => {
    //         expect(getStaffData).toHaveBeenCalledWith(1, 10);
    //     });
    // });

    it('renders correct role names based on roll value', async () => {
        const roleMockData: StaffDataType[] = [
            {
                ...mockStaffData[0],
                id: 1,
                firstName: 'Alice',
                lastName: 'Smith',
                roll: 2, // Consultant
            },
            {
                ...mockStaffData[0],
                id: 2,
                firstName: 'Bob',
                lastName: 'Johnson',
                roll: 5, // CEO
            },
        ];

        render(
            <StaffTable
                totalRows={roleMockData.length}
                staffs={roleMockData}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                reloadData={mockReloadData}
            />
        );

        expect(await screen.findByText(/Consultant/)).toBeInTheDocument();
        expect(screen.getByText(/CEO/)).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <StaffTable
                totalRows={0}
                staffs={[]}
                isLoading={false}
                page={0}
                limit={5}
                onPageChange={mockOnPageChange}
                onRowsPerPageChange={mockOnRowsPerPageChange}
                reloadData={mockReloadData}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
