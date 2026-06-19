import { IdInitValues, IdType } from "../../enums/common.enum";
import PaymentTypeModel from "@/models/common/paymentType.model";
import EducationLevelModel from "@/models/common/educationLevel.model";
import EmploymentTypeModel from "@/models/common/employmentType.model";
import GenderModel from "@/models/common/gender.model";
import TitleModel from "@/models/common/title.model";
import MainCommissionModel from "@/models/office/mainCommission.model";
import StaffModel from "@/models/office/staff.model";
import InvoiceModel from "@/models/invoice/invoice.model";
import SubCommissionModel from "@/models/office/subCommission.model";
import { StudentModel } from "@/models/student/student.model";
import { StaffType } from "@/modules/staff/staff.types";
import { StudentType } from "@/modules/student/student.types";


export const generateId = async (idType: IdType): Promise<number> => {
    let startingId: number;
    let existingObject: any;

    switch (idType) {
        case IdType.PaymentType:
            startingId = IdInitValues.PaymentType
            existingObject = await PaymentTypeModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
            break;


        case IdType.Gender:
            startingId = IdInitValues.Gender
            existingObject = await GenderModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
            break;

        case IdType.Title:
            startingId = IdInitValues.Title
            existingObject = await TitleModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
            break;


        case IdType.EducationLevel:
            startingId = IdInitValues.EducationLevel
            existingObject = await EducationLevelModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
            break;


        case IdType.EmploymentType:
            startingId = IdInitValues.EmploymentType
            existingObject = await EmploymentTypeModel.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
            break;

        default:
            startingId = 10000;
            console.log("Invalid user type")
    }

    // If no users exist yet, return the starting ID
    if (!existingObject) {
        return startingId;
    }

    // If users exist, increment the last user's ID by 1
    return existingObject.id + 1;
};

export function getNext12Months(): string[] {
    const result: string[] = [];
    const start = new Date();

    for (let i = 1; i <= 12; i++) { // start from next month
        const next = new Date(start);
        next.setMonth(start.getMonth() + i);

        const formatted = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`;

        result.push(formatted);
    }

    return result;
}

export async function createMainCommission(
    invoiceId: number,
    percentage: number = 25,
    date?: string,
    isAutoCreated: boolean = true,
    commissionStatus: "pending" | "available" | "paid" = "pending"
) {
    // 1. Find invoice
    const invoice = await InvoiceModel.findOne({ id: invoiceId }).populate("packageInfo");

    if (!invoice) {
        throw new Error("Invoice not found");
    }

    // 2. Get staff
    const staff = await StaffModel.findOne(
        { id: invoice.staffId },
        { _id: 0, __v: 0 }
    ).lean<StaffType>();

    if (!staff) {
        throw new Error("Staff not found");
    }

    // 3. Get student
    const student = await StudentModel.findOne(
        { id: invoice.studentId },
        { _id: 0, __v: 0 }
    ).lean<StudentType>();

    if (!student) {
        throw new Error("Student not found");
    }

    // 4. Calculate commission
    const amount = staff.commissionAmount || 0;
    const introduceAmount = (percentage / 100) * amount;
    const monthlyAmount = amount - introduceAmount;

    // 5. Get university id
    const uniId = invoice.packageInfo
        ? (invoice.packageInfo as any).uniId
        : null;

    // 6. Generate next commission id
    const lastRecord = await MainCommissionModel.findOne().sort({ id: -1 });

    const nextId = lastRecord ? lastRecord.id + 1 : 1;

    // 7. Create Main Commission
    const commission = await MainCommissionModel.create({
        id: nextId,

        date: date || new Date().toISOString(),

        invoiceId: invoice.id,
        studentId: invoice.studentId,
        packageId: invoice.packageId,
        uniId,
        branchId: invoice.branchId,
        staffId: invoice.staffId,

        amount,
        percentage,

        dueAmount: amount,
        paidAmount: 0,

        introduceAmount,
        monthlyAmount,

        status: commissionStatus,
        introduceAmountPaid: false,
        isAutoCreated,

        // Student Snapshot
        studentDetails: {
            id: student.id,
            title: student.title,
            firstName: student.firstName,
            lastName: student.lastName,
            fullName: student.fullName,
            phone: student.phone,
            email: student.email,
            nic: student.nic,
            address: student.address,
            passportNo: student.passportNo,
            issueDate: student.issueDate,
            expireDate: student.expireDate,
            visaIssueDate: student.visaIssueDate,
            visaExpireDate: student.visaExpireDate,
            createdBy: student.createdBy,
            visaStatus: student.visaStatus,
            branchId: student.branchId,
        },

        // Staff Snapshot
        staffDetails: {
            id: staff.id,
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email,
            roll: staff.roll,
            title: staff.title,
            nic: staff.nic,
            gender: staff.gender,
            fullName: staff.fullName,
            address: staff.address,
            branchId: staff.branchId,
            basicSalary: staff.basicSalary,
            commissionAmount: staff.commissionAmount,
        },
    });

    // 8. Create 12 Monthly Sub Commissions
    const next12Months = getNext12Months();

    const lastSub = await SubCommissionModel.findOne().sort({ id: -1 });

    let subIdCounter = lastSub ? lastSub.id + 1 : 1;

    const subCommissions = next12Months.map((month) => ({
        id: subIdCounter++,
        commissionId: commission.id,

        month,
        staffId: invoice.staffId,

        amount: monthlyAmount / 12,

        paidDateAndTime: null,
        status: "available",

        isAutoCreated,

        createDate: new Date(),
        updatedDate: new Date(),
    }));

    await SubCommissionModel.insertMany(subCommissions);

    return {
        commission,
        subCommissions,
    };
}

export async function markMainCommissionsByInvoicePaid(
    invoiceId: number,
) {
    // 1️⃣ Find all main commissions related to this invoice
    const commissions = await MainCommissionModel.find({ invoiceId, status: { $ne: "paid" } });
    if (!commissions.length) return { commissions: [] };

    const updatedCommissions = [];

    for (const commission of commissions) {
        commission.status = "paid";
        commission.paidAmount = commission.introduceAmount;
        commission.dueAmount = commission.dueAmount - commission.introduceAmount;
        commission.introduceAmountPaid = true;
        commission.updatedDate = new Date();
        await commission.save();
        updatedCommissions.push(commission);
    }

    // 3️⃣ Update invoice status to 3
    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
        { id: invoiceId },
        { status: 3, updatedDate: new Date() },
        { new: true }
    );

    return { commissions: updatedCommissions, invoice: updatedInvoice };
}