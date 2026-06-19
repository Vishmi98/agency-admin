/* eslint-disable no-unused-vars */
import { SelectChangeEvent } from "@mui/material";

export type PickerProps = {
    name: string;
    label: string;
}

export type OptionType = {
    value?: string;
    label?: string;
}

export type InputProps = PickerProps & {
    fullWidth?: boolean;
    size?: 'small' | 'medium';
};

export type SelectProps = InputProps & {
    options?: OptionType[];
    value: string;
    disabled?: boolean;
};

export type TextBoxProps = InputProps & {
    as: any;
    type: string;
    error?: boolean;
    helperText?: string | boolean;
    multiline?: boolean;
    rows?: number;
    disabled?: boolean;
}

export type SelectBoxProps = SelectProps & {
    id: string;
    labelId: string;
    onChange: (event: SelectChangeEvent<string>) => void;
    color?: string;
}

export type AutoCompleteBoxProps = SelectProps & {
    id: string;
    labelId: string;
    onChange: (event: React.ChangeEvent<{}>, value: OptionType | null) => void;
}

export type DashboardCardProps = {
    title?: string;
    subtitle?: string;
    action?: JSX.Element | any;
    footer?: JSX.Element;
    cardHeading?: string | JSX.Element;
    headTitle?: string | JSX.Element;
    headSubtitle?: string | JSX.Element;
    children?: JSX.Element;
    middleContent?: string | JSX.Element;
};

export type PageContainerProps = {
    description?: string;
    children: JSX.Element | JSX.Element[];
    title?: string;
};

export type SidebarItemType = {
    isMobileSidebarOpen: boolean;
    onSidebarClose: (event?: React.MouseEvent<HTMLElement> | KeyboardEvent) => void;
    isSidebarOpen: boolean;
}

export type NavGroupProps = {
    [x: string]: any;
    id?: string;
    navLabel?: boolean;
    subheader?: string;
    title?: string;
    icon?: any;
    href?: any;
    children?: NavGroupProps[];
    chip?: string;
    chipColor?: any;
    variant?: string | any;
    external?: boolean;
    level?: number;
    onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};

export type NavItemProps = {
    item: NavGroupProps;
    level?: number | any;
    pathDirect: string;
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
    hideMenu?: any;
}

export type NavGroupType = {
    navLabel?: boolean;
    subheader?: string;
};

export type NavGroupItemType = {
    item: NavGroupType;
}

export type HeaderProps = {
    toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

export type Title = {
    SN: string;
    EN: string;
    TM: string;
}

export type DropdownType = {
    id: number;
    title: Title;
    mainId?: number
}

export type ColumnType = {
    label: string;
    key: string;
    align?: 'center' | 'left' | 'right';
    isCustom?: boolean
}

export type CommonTableProps<T> = {
    totalRows: number;
    data: T[];
    columns: ColumnType[];
    expandedContent?: (row: T) => React.ReactNode;
    loading: boolean;
    page: number;
    rowsPerPage: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newRowsPerPage: number) => void;
    showPreviewButton?: boolean;
    handlePreview?: (row: T) => void;
    showEditButton?: boolean;
    handleEdit?: (row: T) => void;
    showUpdateButton?: boolean;
    handleUpdate?: (row: T) => void;
}

export type UserStoreUserType = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    isVerify: boolean;
    title: string;
    type: string;
    roll: number;
    avatarPath?: string,
    updateAvatarPath?: string,
}

export interface multiLanguageType {
    SN: string;
    EN: string;
    TM: string;
}

export interface AdminTypeJwt {
    id: number;              // Unique identifier, e.g., 2000000002
    firstName: string;       // First name of the teacher
    lastName: string;        // Last name of the teacher
    email: string;           // Email address of the teacher
    roll: number;
}

export type TableColumnType = {
    label: string;
    width: string;
    align?: "left" | "center" | "right" | "justify" | "inherit";
};

export interface CropModalProps {
    imageFile: File;
    onCropComplete: (file: File) => void;
    onClose: () => void;
    cropWidth?: number;
    cropHeight?: number;
}