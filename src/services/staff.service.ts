import bcrypt from "bcryptjs";

import { AuthProvider } from "@/constants/key";
import StaffModel from "@/models/office/staff.model";


export async function registerStaffService(data: {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    roll: number;
    title: number;
    nic: string;
    gender: number;
    fullName: string;
    address: string;
    branchId: number;
}) {
    const {
        firstName,
        lastName,
        password,
        email,
        roll,
        title,
        nic,
        gender,
        fullName,
        address,
        branchId,
    } = data;

    let id = 100;
    const lastUser = await StaffModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
    if (lastUser) {
        id = lastUser.id + 1;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await StaffModel.create({
        id,
        firstName,
        lastName,
        password: hashedPassword,
        roll,
        email,
        authProvider: AuthProvider.Local,
        googleId: "",
        facebookId: "",
        isVerify: true,
        isPublish: true,
        title,
        nic,
        gender,
        fullName,
        address,
        branchId,
        createDate: new Date(),
        updatedDate: new Date(),
    });
}


export async function resetStaffPassword(staffId: number, newPassword: string) {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update staff by numeric id
    const updatedStaff = await StaffModel.findOneAndUpdate(
        { id: staffId },
        { password: hashedPassword, updatedDate: new Date() },
        { new: true }
    );

    return updatedStaff;
}