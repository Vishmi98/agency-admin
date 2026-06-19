import { render, screen, waitFor } from "@testing-library/react";

import { getAttendanceMarkData } from "../../attendanceMark/services/attendanceMark.services";
import SearchAttendanceTable from "../ui/SearchAttendanceTable";

jest.mock("../../attendanceMark/services/attendanceMark.services", () => ({
    getAttendanceMarkData: jest.fn(),
}));

describe("SearchAttendanceTable Component", () => {

    it("renders loading state initially", async () => {
        render(
            <SearchAttendanceTable reload={false} handleReload={jest.fn()} todayDate="2024-03-20" />
        );
        expect(await screen.findByTestId("loading")).toBeInTheDocument();
    });

    it('renders "No data available" when API returns empty', async () => {
        (getAttendanceMarkData as jest.Mock).mockResolvedValue({
            success: true,
            attendance: [],
            totalAttendance: 0,
        });

        render(
            <SearchAttendanceTable reload={false} handleReload={jest.fn()} todayDate="2024-03-20" />
        );

        await waitFor(() => {
            expect(screen.getByTestId("no-data")).toBeInTheDocument();
        });
    });

    it('renders attendance data when API call is successful', async () => {
        (getAttendanceMarkData as jest.Mock).mockResolvedValue({
            success: true,
            attendance: [
                {
                    id: 1,
                    staffId: 101,
                    date: '2024-03-20',
                    inTime: '09:00 AM',
                    outTime: '05:00 PM',
                    leave: 0,
                    createdBy: 1,
                    staffInfo: {
                        id: 101,
                        firstName: 'John',
                        lastName: 'Doe',
                    },
                    leaveInfo: null,
                },
            ],
            totalAttendance: 1,
        });

        render(
            <SearchAttendanceTable reload={false} handleReload={jest.fn()} todayDate="2024-03-20" />
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('09:00 AM')).toBeInTheDocument();
            expect(screen.getByText('05:00 PM')).toBeInTheDocument();
        });
    });
});