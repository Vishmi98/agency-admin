import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";

import AddPackageModal from '../ui/AddPackageModal';


// Mock external services
jest.mock("../services/packages.service", () => ({
    createPackage: jest.fn(),
}));

jest.mock("../../countries/services/countries.services", () => ({
    getCountriesData: jest.fn(),
}));

jest.mock("../../university/services/university.services", () => ({
    getUniversityData: jest.fn(),
}));

jest.mock("../../qualification/services/qualification.services", () => ({
    getQualificationData: jest.fn(),
}));

jest.mock("../services/packages.service", () => ({
    getStudyTypeData: jest.fn(),
}));

jest.mock("../services/packages.service", () => ({
    getLanguageData: jest.fn(),
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: jest.fn(),
}));

describe("AddPackageModal", () => {
    const onClose = jest.fn();
    const handleReload = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("opens when `isOpen` is true", () => {
        render(<AddPackageModal isOpen={true} onClose={onClose} handleReload={handleReload} />);
        expect(screen.getByText("Add New Package")).toBeInTheDocument();
    });

    it("closes when close button is clicked", () => {
        render(<AddPackageModal isOpen={true} onClose={onClose} handleReload={handleReload} />);
        fireEvent.click(screen.getByTestId("CloseIcon"));
        expect(onClose).toHaveBeenCalled();
    });

    
});
