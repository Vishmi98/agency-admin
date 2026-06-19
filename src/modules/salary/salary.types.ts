/* eslint-disable no-unused-vars */
import { StaffDataType, StaffType } from "../staff/staff.types";


export type ModalProps = {
    open: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: StaffType | null;
}

export type TableProps = {
    totalRows: number,
    staffs: StaffDataType[],
    isLoading: boolean,
    page: number,
    limit: number,
    onPageChange: (i: number) => void
    onRowsPerPageChange: (i: number) => void
    selectedStaff: StaffDataType | null,
    setSelectedStaff: (i: StaffDataType) => void,
    reloadData: () => void
}

export type AddBasicAndCommissionResponseDataType = {
    success: boolean;
    message: string;
    data: {
        staff: StaffType;
    }
}

export type AddBasicAndCommissionResponseType = {
    success: boolean;
    message: string;
    data: StaffType;
}