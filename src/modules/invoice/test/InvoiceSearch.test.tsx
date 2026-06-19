import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import InvoiceSearch from '../ui/InvoiceSearch';


describe('InvoiceSearch Component', () => {
    let mockOnSearch: jest.Mock;
    let mockSetSearch: jest.Mock;
    let mockHandleClearSearch: jest.Mock;

    beforeEach(() => {
        mockOnSearch = jest.fn();
        mockSetSearch = jest.fn();
        mockHandleClearSearch = jest.fn();
    });

    it('renders InvoiceSearch component', () => {
        render(
            <InvoiceSearch
                onSearch={mockOnSearch}
                setSearch={mockSetSearch}
                search=""
                loading={false}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        expect(screen.getByLabelText('Search Invoice')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('updates input value on change', () => {
        render(
            <InvoiceSearch
                onSearch={mockOnSearch}
                setSearch={mockSetSearch}
                search=""
                loading={false}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const input = screen.getByLabelText('Search Invoice') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'John' } });

        expect(mockSetSearch).toHaveBeenCalledWith('John');
    });

    it('calls onSearch function when clicking search button', () => {
        render(
            <InvoiceSearch
                onSearch={mockOnSearch}
                setSearch={mockSetSearch}
                search="John"
                loading={false}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const searchButton = screen.getByRole('button', { name: 'Search' });
        fireEvent.click(searchButton);

        expect(mockOnSearch).toHaveBeenCalled();
    });

    it('does not call onSearch when search input is empty', () => {
        render(
            <InvoiceSearch
                onSearch={mockOnSearch}
                setSearch={mockSetSearch}
                search=""
                loading={false}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const searchButton = screen.getByRole('button', { name: 'Search' });
        fireEvent.click(searchButton);

        expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('calls handleClearSearch function when clicking clear button', () => {
        render(
            <InvoiceSearch
                onSearch={mockOnSearch}
                setSearch={mockSetSearch}
                search="John"
                loading={false}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        const clearButton = screen.getByRole('button', { name: 'Clear' });
        fireEvent.click(clearButton);

        expect(mockHandleClearSearch).toHaveBeenCalled();
    });

    it('displays loading indicator when loading is true', () => {
        render(
            <InvoiceSearch
                onSearch={mockOnSearch}
                setSearch={mockSetSearch}
                search="John"
                loading={true}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('does not display loading indicator when loading is false', () => {
        render(
            <InvoiceSearch
                onSearch={mockOnSearch}
                setSearch={mockSetSearch}
                search="John"
                loading={false}
                handleClearSearch={mockHandleClearSearch}
            />
        );

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
});
