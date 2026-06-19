import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import CountriesPage from '../../../app/admin/countries/page';


// Mock CountryTable component
jest.mock('../ui/Countries', () => jest.fn(() => <div data-testid="country-table" />));

describe('CountriesPage Component', () => {
    it('renders CountriesPage component correctly', () => {
        render(<CountriesPage />);
        
        // Check if title is displayed
        expect(screen.getByText('Countries')).toBeInTheDocument();
        
        // Check if CountryTable is rendered
        expect(screen.getByTestId('country-table')).toBeInTheDocument();
    });

    it('calls CountryTable component once', () => {
        const { container } = render(<CountriesPage />);
        
        // Ensure CountryTable is in the document
        expect(screen.getByTestId('country-table')).toBeInTheDocument();

        // Ensure only one instance of CountryTable is rendered
        expect(container.querySelectorAll('[data-testid="country-table"]').length).toBe(1);
    });
});
