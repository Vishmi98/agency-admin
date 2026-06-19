import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import QualificationsPage from '@/app/admin/qualifications/page';


// Mocking QualificationsTable and AddQualificationModal components
jest.mock('../../../modules/qualification/ui/QualificationsTable', () => jest.fn(() => <div data-testid="qualification-table" />));
jest.mock('../../../modules/qualification/ui/AddQualificationModal', () => jest.fn(({ isOpen, onClose, handleReload }) => (
    isOpen ? <div data-testid="add-qualification-modal">
        <button onClick={() => { 
            onClose();        // Close the modal
            handleReload();   // Call handleReload
        }}>Close</button>
    </div> : null
)));

describe('QualificationsPage Component', () => {
    it('renders QualificationsPage component correctly', () => {
        render(<QualificationsPage />);

        // Check if the title is displayed
        expect(screen.getByText('Qualifications')).toBeInTheDocument();

        // Check if QualificationsTable is rendered
        expect(screen.getByTestId('qualification-table')).toBeInTheDocument();

        // Check if AddQualificationModal is rendered (hidden by default)
        expect(screen.queryByTestId('add-qualification-modal')).not.toBeInTheDocument();
    });

    it('opens AddQualificationModal when Add Qualification button is clicked', () => {
        render(<QualificationsPage />);

        // Click the Add Qualification button
        fireEvent.click(screen.getByText('Add Qualification'));

        // Check if AddQualificationModal is now open
        expect(screen.getByTestId('add-qualification-modal')).toBeInTheDocument();
    });

    it('calls QualificationsTable component once', () => {
        const { container } = render(<QualificationsPage />);

        // Ensure QualificationsTable is in the document
        expect(screen.getByTestId('qualification-table')).toBeInTheDocument();

        // Ensure only one instance of QualificationsTable is rendered
        expect(container.querySelectorAll('[data-testid="qualification-table"]').length).toBe(1);
    });

    it('closes AddQualificationModal when Close button is clicked', () => {
        render(<QualificationsPage />);

        // Open the modal
        fireEvent.click(screen.getByText('Add Qualification'));

        // Close the modal
        fireEvent.click(screen.getByText('Close'));

        // Ensure AddQualificationModal is closed
        expect(screen.queryByTestId('add-qualification-modal')).not.toBeInTheDocument();
    });

    // it('calls handleReload when the modal is closed', () => {
    //     const handleReload = jest.fn();
    //     render(<QualificationsPage />);

    //     // Open the modal
    //     fireEvent.click(screen.getByText('Add Qualification'));

    //     // Simulate modal close (e.g., "Close" button clicked)
    //     fireEvent.click(screen.getByText('Close'));

    //     // Ensure handleReload was called after closing the modal
    //     expect(handleReload).toHaveBeenCalledTimes(1);
    // });
});
