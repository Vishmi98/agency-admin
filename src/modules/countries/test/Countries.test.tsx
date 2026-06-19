import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { getCountriesData } from '../services/countries.services';
import CountriesTable from '../ui/Countries';


// Mock the API function
jest.mock('../services/countries.services', () => ({
    getCountriesData: jest.fn(),
}));

describe('Countries Component', () => {
    it('renders loading state initially', async () => {
        render(<CountriesTable />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders "no data available" when there are no countries', async () => {
        // Mock API call to return no countries
        (getCountriesData as jest.Mock).mockResolvedValue({
            success: true,
            countries: [],
        });

        render(<CountriesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('renders country data when API call is successful', async () => {
        // Mock the API call to return sample countries data
        (getCountriesData as jest.Mock).mockResolvedValue({
            success: true,
            countries: [
                { id: 1, title: { SN: 'Sri Lanka', EN: 'Sri Lanka', TM: 'Sri Lanka' } },
                { id: 2, title: { SN: 'India', EN: 'India', TM: 'India' } },
            ],
        });

        render(<CountriesTable />);

        // Wait for the data to be loaded
        await waitFor(() => {
            // Ensure the country data is rendered
            expect(screen.getByText('Sri Lanka')).toBeInTheDocument();
            expect(screen.getByText('India')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getCountriesData as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<CountriesTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
