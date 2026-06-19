import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import QualificationsTable from '../ui/QualificationsTable';
import { getQualificationData } from '../services/qualification.services';


// Mock the API function
jest.mock('../services/qualification.services', () => ({
    getQualificationData: jest.fn(),
}));

describe('Qualifications table Component', () => {
    it('renders loading state initially', async () => {
        render(<QualificationsTable />);
        expect(await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('renders "no data available" when there are no qualifications', async () => {
        // Mock API call to return no qualifications
        (getQualificationData as jest.Mock).mockResolvedValue({
            success: true,
            qualifications: [],
        });

        render(<QualificationsTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('renders country data when API call is successful', async () => {
        // Mock the API call to return sample qualifications data
        (getQualificationData as jest.Mock).mockResolvedValue({
            success: true,
            qualifications: [
                { id: 1, title: { EN: 'Ordinary level', TM: 'Ordinary level', SN: 'Ordinary level' } },
            ],
        });

        render(<QualificationsTable />);

        // Wait for the data to be loaded
        await waitFor(() => {
            // Ensure the country data is rendered
            expect(screen.getByText('Ordinary level')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        // Suppress console.log for this test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        (getQualificationData as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<QualificationsTable />);

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });

        // Restore console.log after the test
        (console.log as jest.Mock).mockRestore();
    });
});
