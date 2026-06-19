import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { getPackagesData } from '../services/packages.service';
import PackagesTable from '../ui/PackagesTable';
import { PackageTableProps } from '../package.types';


// Mock the API function
jest.mock('../services/packages.service', () => ({
    getPackagesData: jest.fn(),
}));

const mockProps: PackageTableProps = {
    totalRows: 0,
    packages: [],
    isLoading: false,
    page: 1,
    limit: 10,
    onPageChange: jest.fn(),
    onRowsPerPageChange: jest.fn(),
    reloadData: jest.fn(),
};

describe('PackagesTable Component', () => {
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
        render(<PackagesTable {...mockProps} isLoading={true} />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });


    it('renders "No data available" when API returns empty', async () => {
        (getPackagesData as jest.Mock).mockResolvedValue({
            success: true,
            packages: [],
            totalPackages: 0,
        });

        render(<PackagesTable {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getPackagesData as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<PackagesTable {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
