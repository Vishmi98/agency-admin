import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import SearchAttendance from "../ui/SearchAttendance";

const theme = createTheme();

describe("SearchAttendance Component", () => {
    let onSearchMock: jest.Mock;

    beforeEach(() => {
        onSearchMock = jest.fn();
    });

    it("renders without crashing", () => {
        render(
            <ThemeProvider theme={theme}>
                <SearchAttendance onSearch={onSearchMock} />
            </ThemeProvider>
        );

        expect(screen.getByText("Search Attendance")).toBeInTheDocument();
        expect(screen.getByText("Date")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    });

    // it("calls onSearch with the selected date when the form is submitted", async () => {
    //     render(
    //         <ThemeProvider theme={theme}>
    //             <SearchAttendance onSearch={onSearchMock} />
    //         </ThemeProvider>
    //     );

    //     const dateInput = screen.getByRole("textbox");
    //     fireEvent.change(dateInput, { target: { value: "2023-10-27" } });

    //     const searchButton = screen.getByRole("button", { name: "Search" });
    //     fireEvent.click(searchButton);

    //     await waitFor(() => {
    //         expect(onSearchMock).toHaveBeenCalledTimes(1);
    //         expect(onSearchMock).toHaveBeenCalledWith("2023-10-27");
    //     });
    // });

    // it("displays an error message when the date is not selected", async () => {
    //     render(
    //         <ThemeProvider theme={theme}>
    //             <SearchAttendance onSearch={onSearchMock} />
    //         </ThemeProvider>
    //     );

    //     const searchButton = screen.getByRole("button", { name: "Search" });
    //     fireEvent.click(searchButton);

    //     await waitFor(() => {
    //         expect(screen.getByText("Date is required")).toBeInTheDocument();
    //     });

    //     expect(onSearchMock).not.toHaveBeenCalled();
    // });

    // it("sets the initial value of the date input to today's date", () => {
    //     const today = new Date().toISOString().split("T")[0];

    //     render(
    //         <ThemeProvider theme={theme}>
    //             <SearchAttendance onSearch={onSearchMock} />
    //         </ThemeProvider>
    //     );

    //     const dateInput = screen.getByRole("textbox");
    //     expect(dateInput).toHaveValue(today);
    // });
});