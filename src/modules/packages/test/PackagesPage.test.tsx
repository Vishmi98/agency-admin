import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import PackagesPage from '@/app/admin/packages/page';


// Mocking PackagesTable and AddPackageModal components
jest.mock('../../../modules/packages/ui/PackagesTable', () => jest.fn(() => <div data-testid="packages-table" />));
jest.mock('../../../modules/packages/ui/AddPackageModal', () => jest.fn(({ isOpen, onClose, handleReload }) => (
    isOpen ? <div data-testid="add-packages-modal">
        <button onClick={() => { 
            onClose();        // Close the modal
            handleReload();   // Call handleReload
        }}>Close</button>
    </div> : null
)));

describe('PackagesPage Component', () => {
    it('renders PackagesPage component correctly', () => {
        render(<PackagesPage />);

        // Check if the title is displayed
        expect(screen.getByText('Packages')).toBeInTheDocument();

        // Check if PackagesTable is rendered
        expect(screen.getByTestId('packages-table')).toBeInTheDocument();

        // Check if AddPackageModal is rendered (hidden by default)
        expect(screen.queryByTestId('add-packages-modal')).not.toBeInTheDocument();
    });

    it('opens AddPackageModal when Add Package button is clicked', () => {
        render(<PackagesPage />);

        // Click the Add Package button
        fireEvent.click(screen.getByText('Add Package'));

        // Check if AddPackageModal is now open
        expect(screen.getByTestId('add-packages-modal')).toBeInTheDocument();
    });

    it('calls PackagesTable component once', () => {
        const { container } = render(<PackagesPage />);

        // Ensure PackagesTable is in the document
        expect(screen.getByTestId('packages-table')).toBeInTheDocument();

        // Ensure only one instance of PackagesTable is rendered
        expect(container.querySelectorAll('[data-testid="packages-table"]').length).toBe(1);
    });

    it('closes AddPackageModal when Close button is clicked', () => {
        render(<PackagesPage />);

        // Open the modal
        fireEvent.click(screen.getByText('Add Package'));

        // Close the modal
        fireEvent.click(screen.getByText('Close'));

        // Ensure AddPackageModal is closed
        expect(screen.queryByTestId('add-packages-modal')).not.toBeInTheDocument();
    });

    // it('calls handleReload when the modal is closed', () => {
    //     const handleReload = jest.fn();
    //     render(<PackagesPage />);

    //     // Open the modal
    //     fireEvent.click(screen.getByText('Add Package'));

    //     // Simulate modal close (e.g., "Close" button clicked)
    //     fireEvent.click(screen.getByText('Close'));

    //     // Ensure handleReload was called after closing the modal
    //     expect(handleReload).toHaveBeenCalledTimes(1);
    // });
});
