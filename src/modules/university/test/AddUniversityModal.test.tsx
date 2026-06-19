import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";

import AddUniversityModal from '../ui/AddUniversityModal';


// Mock external services
jest.mock("../services/university.services", () => ({
    createUniversity: jest.fn(),
}));

jest.mock("../../countries/services/countries.services", () => ({
    getCountriesData: jest.fn(),
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: jest.fn(),
}));

describe("AddUniversityModal", () => {
    const onClose = jest.fn();
    const handleReload = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("opens when `isOpen` is true", () => {
        render(<AddUniversityModal isOpen={true} onClose={onClose} handleReload={handleReload} />);
        expect(screen.getByText("Add New University")).toBeInTheDocument();
    });

    it("closes when close button is clicked", () => {
        render(<AddUniversityModal isOpen={true} onClose={onClose} handleReload={handleReload} />);
        fireEvent.click(screen.getByTestId("CloseIcon"));
        expect(onClose).toHaveBeenCalled();
    });

    // it("submits form with valid input", async () => {
    //     (getCountriesData as jest.Mock).mockResolvedValueOnce({
    //         success: true,
    //         countries: [
    //             { id: 1, title: { EN: "Sri Lanka", SN: "Sri Lanka", TM: "Sri Lanka" } },
    //             { id: 2, title: { EN: "India", SN: "India", TM: "India" } },
    //         ],
    //     });

    //     (createUniversity as jest.Mock).mockResolvedValueOnce({
    //         success: true,
    //         message: "University added successfully",
    //     });

    //     render(<AddUniversityModal isOpen={true} onClose={onClose} handleReload={handleReload} />);

    //     // Wait for countries to load
    //     await waitFor(() => screen.getByText("Sri Lanka"));

    //     // Fill the form using roles or placeholder text
    //     fireEvent.change(screen.getByRole('textbox', { name: /University Name/i }), { target: { value: "Test University" } });
    //     fireEvent.change(screen.getByRole('textbox', { name: /Short Code/i }), { target: { value: "TU" } });
    //     fireEvent.change(screen.getByRole('textbox', { name: /Address/i }), { target: { value: "123 Street" } });
    //     fireEvent.change(screen.getByRole('textbox', { name: /Phone Number/i }), { target: { value: "123456789" } });
    //     fireEvent.change(screen.getByRole('textbox', { name: /Email Address/i }), { target: { value: "test@example.com" } });
    //     fireEvent.change(screen.getByRole('textbox', { name: /Rank/i }), { target: { value: "1" } });
    //     fireEvent.change(screen.getByRole('combobox', { name: /Country/i }), { target: { value: "1" } });

    //     fireEvent.click(screen.getByText("Add"));

    //     await waitFor(() => expect(createUniversity).toHaveBeenCalledTimes(1));

    //     expect(toast.success).toHaveBeenCalledWith("University added successfully");
    //     expect(handleReload).toHaveBeenCalled();
    //     expect(onClose).toHaveBeenCalled();
    // });


    // it("shows validation errors for invalid input", async () => {
    //     render(<AddUniversityModal isOpen={true} onClose={onClose} handleReload={handleReload} />);

    //     // Try submitting the form with invalid data
    //     fireEvent.click(screen.getByText("Add"));

    //     await waitFor(() => expect(screen.getByText("University Name")).toBeInTheDocument());
    //     expect(screen.getByText("Short Code")).toBeInTheDocument();
    //     expect(screen.getByText("Address")).toBeInTheDocument();
    //     expect(screen.getByText("Phone Number")).toBeInTheDocument();
    //     expect(screen.getByText("Email Address")).toBeInTheDocument();

    //     // Check for validation errors
    //     expect(screen.getByText("Required")).toBeInTheDocument();
    // });

    // it("displays error toast if university creation fails", async () => {
    //     (createUniversity as jest.Mock).mockResolvedValueOnce({
    //         success: false,
    //         message: "Failed to add university",
    //     });

    //     render(<AddUniversityModal isOpen={true} onClose={onClose} handleReload={handleReload} />);

    //     // Fill in valid values
    //     fireEvent.change(screen.getByLabelText("University Name"), { target: { value: "Test University" } });
    //     fireEvent.change(screen.getByLabelText("Short Code"), { target: { value: "TU" } });
    //     fireEvent.change(screen.getByLabelText("Address"), { target: { value: "123 Street" } });
    //     fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "123456789" } });
    //     fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "test@example.com" } });
    //     fireEvent.change(screen.getByLabelText("Rank"), { target: { value: "1" } });

    //     fireEvent.change(screen.getByLabelText("Country"), { target: { value: "1" } });

    //     fireEvent.click(screen.getByText("Add"));

    //     await waitFor(() => expect(createUniversity).toHaveBeenCalledTimes(1));

    //     expect(toast.error).toHaveBeenCalledWith("Failed to add university");
    // });

    // it("fetches countries when the modal opens", async () => {
    //     (getCountriesData as jest.Mock).mockResolvedValueOnce({
    //         success: true,
    //         countries: [{ id: 1, title: { EN: "Sri Lanka" } }],
    //     });

    //     render(<AddUniversityModal isOpen={true} onClose={onClose} handleReload={handleReload} />);

    //     // Wait for countries to load and verify the dropdown contains the country
    //     await waitFor(() => expect(screen.getByText("Sri Lanka")).toBeInTheDocument());
    // });
});
