import { render, screen, waitFor, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { getStaffData } from '../../staff/services/staff.services';
import SalaryAdvancePage from '@/app/admin/salary-advance/page';
import AddSalaryAdvance from '../ui/AddSalaryAdvance';
import SalaryAdvanceTable from '../ui/SalaryAdvanceTable';

jest.mock('../../staff/services/staff.services');
let addSalaryAdvanceProps: any = null;
jest.mock('../ui/AddSalaryAdvance', () => ({
    __esModule: true,
    default: jest.fn((props) => {
        addSalaryAdvanceProps = props; // <-- store props here
        return <div>AddSalaryAdvance</div>;
    }),
}));
jest.mock('../ui/SalaryAdvanceTable', () => ({
    __esModule: true,
    default: jest.fn(() => <div>SalaryAdvanceTable</div>),
}));

const mockStaffData = {
    success: true,
    staffs: [
        { id: 1, fullName: 'John Doe', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: 2, fullName: 'Jane Smith', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    ],
};

describe('SalaryAdvancePage Component', () => {
    const theme = createTheme();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing and displays title', async () => {
        (getStaffData as jest.Mock).mockResolvedValue(mockStaffData);

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <SalaryAdvancePage />
                </ThemeProvider>
            );
        });

        expect(screen.getByText('Salary Advances')).toBeInTheDocument();

        await waitFor(() => {
            expect(getStaffData).toHaveBeenCalledWith(1, 100);
        });
    });

    it('displays fetched staff data in AddSalaryAdvance', async () => {
        (getStaffData as jest.Mock).mockResolvedValue(mockStaffData);

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <SalaryAdvancePage />
                </ThemeProvider>
            );
        });

        await waitFor(() => {
            expect(addSalaryAdvanceProps?.staffMembers).toEqual(mockStaffData.staffs);
        });
    });

    it('passes handleReload and reload to SalaryAdvanceTable', async () => {
        (getStaffData as jest.Mock).mockResolvedValue(mockStaffData);

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <SalaryAdvancePage />
                </ThemeProvider>
            );
        });

        await waitFor(() => {
            const props = (SalaryAdvanceTable as jest.Mock).mock.calls[0][0];
            expect(typeof props.reload).toBe('boolean');
            expect(typeof props.handleReload).toBe('function');
        });
    });

    it('handles failed response from API (success: false)', async () => {
        (getStaffData as jest.Mock).mockResolvedValue({ success: false, staffs: [] });

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <SalaryAdvancePage />
                </ThemeProvider>
            );
        });

        await waitFor(() => {
            expect(getStaffData).toHaveBeenCalledWith(1, 100);
            const props = (AddSalaryAdvance as jest.Mock).mock.calls[0][0];
            expect(props.staffMembers).toEqual([]);
        });
    });

    it('handles thrown error from API', async () => {
        (getStaffData as jest.Mock).mockRejectedValue(new Error('API Error'));

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <SalaryAdvancePage />
                </ThemeProvider>
            );
        });

        await waitFor(() => {
            expect(getStaffData).toHaveBeenCalledWith(1, 100);
            const props = (AddSalaryAdvance as jest.Mock).mock.calls[0][0];
            expect(props.staffMembers).toEqual([]);
        });
    });
});
