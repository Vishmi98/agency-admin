import '@testing-library/jest-dom';

import apiCall from '../../../services/api.services';
import { LoginFormType, UserLoginResponseType } from '../authForm.types';
import { handleUserLogin } from '../services/authForm.service';
import { URL } from '@/constants/config';


jest.mock('../../../services/api.services', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe("handleUserLogin", () => {
    const mockLoginData: LoginFormType = {
        email: "test@example.com",
        password: "password123"
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success with token on successful login", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: true,
            message: "Login successful",
            data: { token: "mocked_token" }
        });

        const result: UserLoginResponseType = await handleUserLogin(mockLoginData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/auth/login-staff`,
            method: "POST",
            body: mockLoginData,
            isAuth: false
        });

        expect(result).toEqual({
            success: true,
            message: "Login successful",
            token: "mocked_token"
        });
    });

    it("should return failure message on login failure", async () => {
        (apiCall as jest.Mock).mockResolvedValue({
            success: false,
            message: "Invalid credentials"
        });

        const result: UserLoginResponseType = await handleUserLogin(mockLoginData);

        expect(apiCall).toHaveBeenCalledWith({
            url: `${URL}/auth/login-staff`,
            method: "POST",
            body: mockLoginData,
            isAuth: false
        });

        expect(result).toEqual({
            success: false,
            message: "Invalid credentials"
        });
    });

    it("should handle API call rejection gracefully", async () => {
        (apiCall as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(handleUserLogin(mockLoginData)).rejects.toThrow("Network error");
    });
});
