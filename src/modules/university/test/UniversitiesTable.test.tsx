import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import UniversitiesTable from '../ui/UniversitiesTable';
import { getUniversityData } from '../services/university.services';


// Mock the API function
jest.mock('../services/university.services', () => ({
    getUniversityData: jest.fn(),
}));

describe('UniversitiesTable Component', () => {
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
        render(<UniversitiesTable />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders university data when API call is successful', async () => {
        (getUniversityData as jest.Mock).mockResolvedValue({
            success: true,
            universities: [
                {
                    id: 1,
                    name: 'University of Colombo',
                    address: '123 University St',
                    countryId: 1,
                    staffId: 1,
                    rank: 1,
                    code: 123,
                    phoneNumber: '123-456-7890',
                    email: 'university@example.com',
                    isPublish: true,
                    countryInfo: { title: { SN: 'Sri lanka', EN: 'Sri lanka', TM: 'Sri lanka' }, id: 1 },
                    staffInfo: { id: 1, firstName: 'John', lastName: 'Doe' },
                }
            ],
            totalUniversities: 1,
        });

        render(<UniversitiesTable />);

        await waitFor(() => {
            expect(screen.getByText('University of Colombo')).toBeInTheDocument();
            expect(screen.getByText('123-456-7890')).toBeInTheDocument();
            expect(screen.getByText('university@example.com')).toBeInTheDocument();
        });
    });

    it('renders "No data available" when API returns empty', async () => {
        (getUniversityData as jest.Mock).mockResolvedValue({
            success: true,
            universities: [],
            totalUniversities: 0,
        });

        render(<UniversitiesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getUniversityData as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<UniversitiesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
