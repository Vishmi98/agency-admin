/* eslint-disable no-unused-vars */
import { MonthDataType } from "../attendance/attendance.types";
import { AttendanceDataType_ } from "../attendanceMark/attendanceMarks.types";
import { MainCommissionDataType, SubCommissionDataType } from "../commission/commission.types";
import { InvoiceDataType } from "../invoice/invoice.types";
import { StaffDataType } from "../staff/staff.types";
import { DropdownType } from "@/type/common.types";


export type SalaryAdvanceType = {
    staffId: number | string;
    amount: number;
    approvalBy: number;
    isSettle: boolean;
    isPaid: boolean;
    date: string;
}

export type SalaryAdvanceDataType = {
    id: number;
    staffId: number;
    amount: number;
    date: string;
    staffInfo: StaffDataType;
    isSettle: boolean;
    isPaid: boolean;
}

export type SalaryAdvancesTableProps = {
    reload?: boolean;
    handleReload: () => void;
    selectedMonth: string;
}

export type SalaryAdvanceFormValues = {
    handleReload: () => void;
    reload: boolean;
    staffMembers: StaffDataType[]
}

export type CreateSalaryAdvanceResponseType = {
    success: boolean;
    message: string;
    data: SalaryAdvanceType;
}

export type CreateSalaryAdvanceResponseDataType = {
    success: boolean;
    message: string;
    data: {
        salaryAdvance: SalaryAdvanceType;
    }
}

export type SalaryAdvanceResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalSalaryAdvance: number;
    salaryAdvances: SalaryAdvanceDataType[];
}

export type SalaryAdvanceResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalSalaryAdvance: number;
        salaryAdvances: SalaryAdvanceDataType[];
    }
}

export type BasicSalaryResponseDataType = {
    success: boolean;
    message: string;
    data: BasicSalaryDataType[];
}

export type BasicSalaryResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalBasicSalary: number;
        basicSalaries: BasicSalaryDataType[];
    }
}

export type BasicSalaryType = {
    role?: number | string;
    title: string;
    basicSalary: number | string;
}

export type BasicSalaryType_ = {
    roll: number | string;
    title: string;
    basicSalary: number | string;
}

export type BasicSalaryDataType = {
    roll: number | string;
    role?: number | string;
    title: string;
    basicSalary: number | string;
}

export type AddBasicSalaryResponseType = {
    success: boolean;
    message: string;
    data: BasicSalaryType_;
}

export type AddBasicSalaryResponseDataType = {
    success: boolean;
    message: string;
    data: BasicSalaryType_;
}

export type AddBasicSalaryFormValues = {
    handleReload: () => void;
    reload: boolean;
}

export type BasicSalaryByStaffResponseType = {
    success: boolean;
    message: string;
    data: BasicSalaryDataType;
}

export type RoleNotHaveBasicSalaryResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalBasicSalary: number;
    paginatedData: DropdownType[];
}

export type RoleNotHaveBasicSalaryResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalBasicSalary: number;
        paginatedData: DropdownType[];
    }
}

export type EditBasicSalaryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: BasicSalaryType | null;
}

export type UpdateBasicSalaryResponseDataType = {
    success: boolean;
    message: string;
    data: BasicSalaryType_
}

export type UpdateBasicSalaryResponseType = {
    success: boolean;
    message: string;
    data: BasicSalaryType_;
}

export type DeleteBasicSalaryResponseDataType = {
    success: boolean;
    message: string;
    data: BasicSalaryType_
}

export type DeleteBasicSalaryResponseType = {
    success: boolean;
    message: string;
    data: BasicSalaryType_;
}

export type DeleteBasicSalaryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedData: BasicSalaryDataType | null;
    reloadData: () => void;
};

export type SearchSalariesFormValues = {
    month: string
}

export type SalariesTableProps = {
    reload?: boolean;
    handleReload: () => void;
    month: string
}

export type SalaryType = {
    id: number;
    month: string;
    staffId: number;
    basicSalary: number;
    commissionAmount: number;
    attendances: string[];
    leaves: string[];
    workingDays: number;
    workedDays: number;
    salaryAdvance: number[];
    totalDeduction: number;
    totalSalaryAdvance: number;
    commissionAvailableInvoiceIds: number[];
    totalNoPayDeduction: number;
    noPayPerDay: number;
    grossSalary: number;
    netSalary: number;
    isPaid: boolean;
    additional: AdditionalIncentiveType[] | [];
}

export type SalaryDataType = {
    id: number;
    month: string;
    staffId: number;
    basicSalary: number;
    commissionAmount: number;
    attendances: string[];
    leaves: string[];
    workingDays: number;
    workedDays: number;
    salaryAdvance: number[];
    totalDeduction: number;
    totalSalaryAdvance: number;
    commissionAvailableInvoiceIds: number[];
    totalNoPayDeduction: number;
    noPayPerDay: number;
    grossSalary: number;
    netSalary: number;
    staffInfo: StaffDataType;
    monthInfo: MonthDataType;
    attendanceInfo: AttendanceDataType_[];
    salaryAdvanceInfo: SalaryAdvanceDataType[];
    isPaid: boolean;
    additional: AdditionalIncentiveType[];
    invoices: InvoiceDataType[];
    mainCommissionIds: number[];
    subCommissionIds: number[];
    mainCommissionAmount: number;
    subCommissionAmount: number;
    invoiceIdsWithMainCommission: InvoiceDataType[];
    invoiceIdsWithSubCommission: InvoiceDataType[];
    mainCommissionInfo: MainCommissionDataType[];
    subCommissionInfo: SubCommissionDataType[];
}

export type SalariesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalSalaries: number;
    salaries: SalaryDataType[];
}

export type SalariesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalSalaries: number;
        salaries: SalaryDataType[];
    }
}

export type SalaryProp = {
    salary: SalaryDataType,
    setIsModalOpen: (open: boolean) => void
}

export type AdditionalIncentiveType = {
    title: string;
    amount: number;
};

export type CreateSalaryResponseDataType = {
    success: boolean;
    message: string;
    data: SalaryType;
}

export type GetSalaryAdvancesByStaffIdResponseDataType = {
    success: boolean;
    message: string;
    salaryAdvances: SalaryAdvanceDataType[];
}

export type GetSalaryAdvancesByStaffIdResponseType = {
    success: boolean;
    message: string;
    data: {
        salaryAdvances: SalaryAdvanceDataType[];
    }
}

export type ConfirmGenerateModalProps = {
    open: boolean;
    onClose: () => void;
    staffId: number | null;
    month: string;
    onSuccess: (staffId: number) => void;
};

export type PreviewSalaryByStaffIdResponseDataType = {
    success: boolean;
    message: string;
    salaryPreview: SalaryDataType;
}

export type PreviewSalaryByStaffIdResponseType = {
    success: boolean;
    message: string;
    data: {
        salaryPreview: SalaryDataType;
    }
}
