import {
    IconBook,
    IconBuildingCommunity,
    IconCalendar,
    IconCalendarTime,
    IconCash,
    IconClock,
    IconCurrencyDollar,
    IconFileText,
    IconGlobe,
    IconLayoutDashboard,
    IconMapPin,
    IconMoneybag,
    IconPhoneCall,
    IconReceipt,
    IconSchool,
    IconSettings,
    IconTrophy,
    IconUser,
    IconUserHeart,
    IconUserPlus,
    IconUsersGroup,
    IconWorld,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

import { PromotionType } from "@/modules/promotion/promotion.types";
import { LeaveType } from "@/modules/leave/leave.types";
import { UserType } from "@/modules/users/user.types";


export const ROLES = [
    { id: 1, label: 'Admin' },
    { id: 2, label: 'Consultant' },
    { id: 3, label: 'HR' },
    { id: 4, label: 'Accounts' },
    { id: 5, label: 'CEO' },
    { id: 6, label: 'Marketing Manager' },
    { id: 7, label: 'Branch Manager' },
    { id: 8, label: 'Operation Manager' },
    { id: 9, label: 'Coordinator' },
    { id: 10, label: 'Junior Consultant' }
];

export const Branches = [
    {
        id: 100,
        location: "Colombo",
        address: "No.47/1, Jawatta Rod, Colombo 05"
    },
    {
        id: 101,
        location: "Ratnapura",
        address: "Ratnapura"
    }
]

export const ADMIN_MENU_ITEMS = [

    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/universities",
    },
    // {
    //     id: uniqueId(),
    //     title: "Courses",
    //     icon: IconBook,
    //     href: "/admin/course",
    // },
    {
        id: uniqueId(),
        title: "Users",
        icon: IconUsersGroup,
        href: "/admin/users",
    },
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add Student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
            {
                id: uniqueId(),
                title: "Qualifications Types",
                icon: IconMoneybag,
                href: "/admin/qualifications",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Countries",
        icon: IconGlobe,
        href: "/admin/countries",
    },
    {
        id: uniqueId(),
        title: "Payment types",
        icon: IconGlobe,
        href: "/admin/payment-types",
    },
    {
        id: uniqueId(),
        title: "Packages",
        icon: IconMoneybag,
        href: "/admin/packages",
    },
    {
        id: uniqueId(),
        title: "Attendance",
        icon: IconCalendar,
        href: "/admin/attendance",
    },
];

export const SALES_EXECUTIVE_MENU_ITEMS = [
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/universities",
    },
    {
        id: uniqueId(),
        title: "Packages",
        icon: IconMoneybag,
        href: "/admin/packages",
    },
    {
        id: uniqueId(),
        title: "Account",
        icon: IconReceipt,
        children: [
            {
                id: uniqueId(),
                title: "Expenses Types",
                icon: IconMoneybag,
                href: "/admin/expenses-types",
            },
            {
                id: uniqueId(),
                title: "Add Expenses",
                icon: IconMoneybag,
                href: "/admin/add-expenses",
            },
            {
                id: uniqueId(),
                title: "University Payments",
                icon: IconMoneybag,
                href: "/admin/university-payments",
            }
        ]
    },
    {
        id: uniqueId(),
        title: "Roster",
        icon: IconCalendar,
        href: "/admin/roster",
    },
    {
        id: uniqueId(),
        title: "All Attendances",
        icon: IconCalendar,
        href: "/admin/all-attendance",
    },
    {
        id: uniqueId(),
        title: "My Attendances",
        icon: IconCalendar,
        href: "/admin/my-attendance",
    },
];

export const HR_MENU_ITEMS = [

    {
        id: uniqueId(),
        title: "Staff",
        icon: IconUsersGroup,
        href: "/admin/staff",
    },
    {
        id: uniqueId(),
        title: "Roster",
        icon: IconCalendar,
        href: "/admin/roster",
    },
    {
        id: uniqueId(),
        title: "Enter Attendance",
        icon: IconUser,
        href: "/admin/today-attendance",
    },
    {
        id: uniqueId(),
        title: "Attendance",
        icon: IconUser,
        href: "/admin/attendance",
    },
    {
        id: uniqueId(),
        title: "Create Roster",
        icon: IconCalendar,
        href: "/admin/create-roster",
    },
];

export const ACCOUNTANTS_MENU_ITEMS = [

    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Expenses Types",
        icon: IconMoneybag,
        href: "/admin/expenses-types",
    },
    {
        id: uniqueId(),
        title: "Add Expenses",
        icon: IconMoneybag,
        href: "/admin/add-expenses",
    },
    {
        id: uniqueId(),
        title: "Attendance",
        icon: IconCalendar,
        href: "/admin/attendance",
    },
];

export const HR_ACCOUNTANT_MENU_ITEMS = [
    {
        id: uniqueId(),
        title: "Staff",
        icon: IconUsersGroup,
        href: "/admin/staff",
    },
    {
        id: uniqueId(),
        title: "HR",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Enter Attendance",
                icon: IconUser,
                href: "/admin/today-attendance",
            },
            {
                id: uniqueId(),
                title: "Add Leave",
                icon: IconUser,
                href: "/admin/add-leave",
            },
            {
                id: uniqueId(),
                title: "Staff Leaves",
                icon: IconUser,
                href: "/admin/staff-leaves",
            },
            {
                id: uniqueId(),
                title: "Mark Out Time",
                icon: IconClock,
                href: "/admin/mark-out-time",
            },
            {
                id: uniqueId(),
                title: "Attendance",
                icon: IconUser,
                href: "/admin/attendance",
            },
            {
                id: uniqueId(),
                title: "Roster",
                icon: IconCalendar,
                href: "/admin/roster",
            },
            {
                id: uniqueId(),
                title: "Create Roster",
                icon: IconCalendar,
                href: "/admin/create-roster",
            },
            {
                id: uniqueId(),
                title: "Edit Roster",
                icon: IconCalendar,
                href: "/admin/edit-roster",
            },
            {
                id: uniqueId(),
                title: "All Attendances",
                icon: IconCalendar,
                href: "/admin/all-attendance",
            },
            {
                id: uniqueId(),
                title: "My Attendances",
                icon: IconCalendar,
                href: "/admin/my-attendance",
            },

        ]
    },
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/universities",
    },
    {
        id: uniqueId(),
        title: "Packages",
        icon: IconMoneybag,
        href: "/admin/packages",
    },
    {
        id: uniqueId(),
        title: "Account",
        icon: IconReceipt,
        children: [
            {
                id: uniqueId(),
                title: "Expenses Types",
                icon: IconMoneybag,
                href: "/admin/expenses-types",
            },
            {
                id: uniqueId(),
                title: "Add Expenses",
                icon: IconMoneybag,
                href: "/admin/add-expenses",
            },
        ]
    }
];

export const TEMP_CEO_MENU_ITEMS = [
    // {
    //     id: uniqueId(),
    //     title: "DashBoard",
    //     icon: IconCalendar,
    //     href: "/admin",
    // },
    {
        id: uniqueId(),
        title: "Leads",
        icon: IconReceipt,
        href: "/admin/leads",
    },
    {
        id: uniqueId(),
        title: "Inquiries",
        icon: IconReceipt,
        href: "/admin/inquiries",
    },
    {
        id: uniqueId(),
        title: "Countries",
        icon: IconWorld,
        href: "/admin/countries",
    },
    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/universities",
    },
    {
        id: uniqueId(),
        title: "Courses",
        icon: IconSchool,
        href: "/admin/courses",
    },
    {
        id: uniqueId(),
        title: "Staff",
        icon: IconUsersGroup,
        href: "/admin/staff",
    },
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUserPlus,
                href: "/admin/add-student",
            },
        ]
    },
];

export const CONSULTANT_MENU_ITEMS = [
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/universities",
    },
    {
        id: uniqueId(),
        title: "Packages",
        icon: IconMoneybag,
        href: "/admin/packages",
    },
    {
        id: uniqueId(),
        title: "Roster",
        icon: IconCalendar,
        href: "/admin/roster",
    },
    {
        id: uniqueId(),
        title: "All Attendances",
        icon: IconCalendar,
        href: "/admin/all-attendance",
    },
    {
        id: uniqueId(),
        title: "Call Center",
        icon: IconPhoneCall,
        href: "/admin/call-center",
    },
    {
        id: uniqueId(),
        title: "Success Stories",
        icon: IconTrophy,
        href: "/admin/success-stories",
    },
];

export const OPERATION_MENU_ITEMS = [
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/universities",
    },
    {
        id: uniqueId(),
        title: "Packages",
        icon: IconMoneybag,
        href: "/admin/packages",
    }
];

export const JUNIOR_CONSULTANT_MENU_ITEMS = [
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
        ]
    },
];

export const CEO_MENU_ITEMS = [
    {
        id: uniqueId(),
        title: "Dashboard",
        icon: IconLayoutDashboard,
        href: "/admin",
    },
    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/university",
    },
    {
        id: uniqueId(),
        title: "Packages",
        icon: IconBook,
        href: "/admin/packages",
    },
    {
        id: uniqueId(),
        title: "Users",
        icon: IconUsersGroup,
        href: "/admin/users",
    },
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
            {
                id: uniqueId(),
                title: "Qualifications Types",
                icon: IconMoneybag,
                href: "/admin/qualifications",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Staff",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Staff",
                icon: IconUsersGroup,
                href: "/admin/staff",
            },
            {
                id: uniqueId(),
                title: "Leaves",
                icon: IconMoneybag,
                href: "/admin/leaves",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Attendance",
        icon: IconCalendar,
        href: "/admin/attendance",
    },
];

export const MANAGER_MENU_ITEMS = [

    {
        id: uniqueId(),
        title: "Universities",
        icon: IconSchool,
        href: "/admin/universities",
    },
    {
        id: uniqueId(),
        title: "Users",
        icon: IconUsersGroup,
        href: "/admin/users",
    },
    {
        id: uniqueId(),
        title: "Students",
        icon: IconUsersGroup,
        children: [
            {
                id: uniqueId(),
                title: "Students",
                icon: IconUsersGroup,
                href: "/admin/students",
            },
            {
                id: uniqueId(),
                title: "Add Student",
                icon: IconUsersGroup,
                href: "/admin/add-student",
            },
            {
                id: uniqueId(),
                title: "Qualifications Types",
                icon: IconMoneybag,
                href: "/admin/qualifications",
            },
        ]
    },
    {
        id: uniqueId(),
        title: "Attendance",
        icon: IconCalendar,
        href: "/admin/attendance",
    },
];

export const PROMOTION_DATA: PromotionType[] = [
    {
        id: 1,
        title: "Summer Sale",
        description: "Get 20% off on all courses this summer.",
        amount: 20,
    },
    {
        id: 2,
        title: "New Year Special",
        description: "Celebrate the New Year with a flat $50 discount on tuition fees.",
        amount: 50,
    },
    {
        id: 3,
        title: "Referral Bonus",
        description: "Refer a friend and earn a $30 discount on your next enrollment.",
        amount: 30,
    },
    {
        id: 4,
        title: "Early Bird Offer",
        description: "Register before the 15th and save 10% on your course fee.",
        amount: 10,
    },
    {
        id: 5,
        title: "Black Friday Deal",
        description: "Exclusive Black Friday offer: Save $100 on premium courses.",
        amount: 100,
    },
    {
        id: 6,
        title: "Early Bird Offer",
        description: "Register before the 15th and save 10% on your course fee.",
        amount: 10,
    },
    {
        id: 7,
        title: "Black Friday Deal",
        description: "Exclusive Black Friday offer: Save $100 on premium courses.",
        amount: 100,
    },
];

export const LEAVE_DATA: LeaveType[] = [
    {
        id: 1,
        type: 0,
        title: "Flu Recovery",
        description: "Taking leave to recover from flu for 3 days."
    },
    {
        id: 2,
        type: 4,
        title: "Vacation in Hawaii",
        description: "Annual leave for a one-week vacation in Hawaii."
    },
    {
        id: 3,
        type: 1,
        title: "Family Event",
        description: "Leave for attending a family wedding event."
    },
    {
        id: 4,
        type: 2,
        title: "Maternity Leave for Childbirth",
        description: "Maternity leave for childbirth for 6 weeks."
    },
    {
        id: 5,
        type: 3,
        title: "Funeral Leave",
        description: "Leave due to the passing of a close family member."
    },
    {
        id: 6,
        type: 2,
        title: "Maternity Leave for Childbirth",
        description: "Maternity leave for childbirth for 6 weeks."
    },
    {
        id: 7,
        type: 3,
        title: "Funeral Leave",
        description: "Leave due to the passing of a close family member."
    }
];

export const USERS_DATA: UserType[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        type: 1, // Admin
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+1987654321',
        type: 2, // HR
    },
    {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@example.com',
        phoneNumber: '+1122334455',
        type: 3, // Sales Executive
    },
    {
        id: 4,
        firstName: 'Jackson',
        lastName: 'Anthony',
        email: 'jackson@example.com',
        phoneNumber: '+1122334455',
        type: 4, // Sales Executive
    },
    {
        id: 5,
        firstName: 'Merry',
        lastName: 'Jeen',
        email: 'merry@example.com',
        phoneNumber: '+1122334455',
        type: 5, // Sales Executive
    },
    {
        id: 6,
        firstName: 'Robert',
        lastName: 'Nock',
        email: 'robert@example.com',
        phoneNumber: '+1122334455',
        type: 6, // Sales Executive
    },
];

export const REDIRECT_ROUTE: Record<string, string> = {
    "2": "/admin/university",    // admin
    "3": "/admin/students",      // sales executive
    // "2": "/admin",                  // ceo
    // "3": "/admin/staff",            // hr
};

export const CALENDAR_EVENTS = [
    {
        id: "1",
        title: "Meeting with John",
        start: new Date("2025-01-07T10:00:00"),
        end: new Date("2025-01-07T11:00:00"),
        allDay: false,
        type: "meeting"
    },
    {
        id: "2",
        title: "Project Deadline",
        start: new Date("2025-01-08T00:00:00"),
        end: new Date("2025-01-08T23:59:59"),
        allDay: false,
    },
    {
        id: "3",
        title: "Lunch with Sarah",
        start: new Date("2025-01-09T12:00:00"),
        end: new Date("2025-01-09T13:00:00"),
        allDay: false,
    },
    {
        id: "4",
        title: "Team Meeting",
        start: new Date("2025-01-10T14:00:00"),
        end: new Date("2025-01-10T15:00:00"),
        allDay: false,
    },
    {
        id: "5",
        title: "Doctor's Appointment",
        start: new Date("2025-01-11T09:00:00"),
        end: new Date("2025-01-11T10:00:00"),
        allDay: false,
    },
];

export const USER_TYPES = [
    { value: 'salesExecutive', label: 'Sales Executive' },
    { value: 'hr', label: 'HR' },
    { value: 'ceo', label: 'CEO' },
    { value: 'admin', label: 'Admin' },
];

export const TIME_PERIODS = [
    { value: 'jan', label: 'January' },
    { value: 'feb', label: 'February' },
    { value: 'mar', label: 'March' },
    { value: 'apr', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'jun', label: 'June' },
    { value: 'jul', label: 'July' },
    { value: 'aug', label: 'August' },
    { value: 'sep', label: 'September' },
    { value: 'oct', label: 'October' },
    { value: 'nov', label: 'November' },
    { value: 'dec', label: 'December' },
    { value: 'q1', label: 'Quarter 1' },
    { value: 'q2', label: 'Quarter 2' },
    { value: 'q3', label: 'Quarter 3' },
    { value: 'q4', label: 'Quarter 4' },
    { value: 'yearly', label: 'Yearly' },
];

export const PAYMENT_STATUSES = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
];

export const DATE_TYPES = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
];

export const STEPS = [
    {
        label: "Center Care",
        price: "$48",
        hours: "1"
    },
    {
        label: "Diagnostics",
        price: "$78",
        hours: "2"
    },
    {
        label: "Inner Cleaning",
        price: "$78",
        hours: "1"
    }
];