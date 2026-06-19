import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import UniversitiesPage from '@/app/admin/universities/page';


// Mocking UniversitiesTable and AddUniversityModal components
jest.mock('../../../modules/university/ui/UniversitiesTable', () => jest.fn(() => <div data-testid="universities-table" />));
jest.mock('../../../modules/university/ui/AddUniversityModal', () => jest.fn(({ isOpen, onClose, handleReload }) => (
    isOpen ? <div data-testid="add-university-modal">
        <button onClick={() => { 
            onClose();        // Close the modal
            handleReload();   // Call handleReload
        }}>Close</button>
    </div> : null
)));

describe('UniversitiesPage Component', () => {
    it('renders UniversitiesPage component correctly', () => {
        render(<UniversitiesPage />);

        // Check if the title is displayed
        expect(screen.getByText('Universities')).toBeInTheDocument();

        // Check if UniversitiesTable is rendered
        expect(screen.getByTestId('universities-table')).toBeInTheDocument();

        // Check if AddUniversityModal is rendered (hidden by default)
        expect(screen.queryByTestId('add-university-modal')).not.toBeInTheDocument();
    });

    it('opens AddUniversityModal when Add University button is clicked', () => {
        render(<UniversitiesPage />);

        // Click the Add University button
        fireEvent.click(screen.getByText('Add University'));

        // Check if AddUniversityModal is now open
        expect(screen.getByTestId('add-university-modal')).toBeInTheDocument();
    });

    it('calls UniversitiesTable component once', () => {
        const { container } = render(<UniversitiesPage />);

        // Ensure UniversitiesTable is in the document
        expect(screen.getByTestId('universities-table')).toBeInTheDocument();

        // Ensure only one instance of UniversitiesTable is rendered
        expect(container.querySelectorAll('[data-testid="universities-table"]').length).toBe(1);
    });

    it('closes AddUniversityModal when Close button is clicked', () => {
        render(<UniversitiesPage />);

        // Open the modal
        fireEvent.click(screen.getByText('Add University'));

        // Close the modal
        fireEvent.click(screen.getByText('Close'));

        // Ensure AddUniversityModal is closed
        expect(screen.queryByTestId('add-university-modal')).not.toBeInTheDocument();
    });

    // it('calls handleReload when the modal is closed', () => {
    //     const handleReload = jest.fn();
    //     render(<UniversitiesPage />);

    //     // Open the modal
    //     fireEvent.click(screen.getByText('Add University'));

    //     // Simulate modal close (e.g., "Close" button clicked)
    //     fireEvent.click(screen.getByText('Close'));

    //     // Ensure handleReload was called after closing the modal
    //     expect(handleReload).toHaveBeenCalledTimes(1);
    // });
});
