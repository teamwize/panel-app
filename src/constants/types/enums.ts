//user enum

export enum UserStatus {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED",
    ARCHIVED = "ARCHIVED"
}

// export const USER_ROLE = {
//     ORGANIZATION_ADMIN : "ORGANIZATION_ADMIN",
//     EMPLOYEE : "EMPLOYEE",
// } as const;
// export type UserRole = keyof typeof USER_ROLE;

export enum UserRole {
    Admin = "ORGANIZATION_ADMIN",
    Employee = "EMPLOYEE",
}

//leave enum and const

// export const LEAVE_TYPE = {
//     PAID_TIME: 'Paid time',
//     VACATION: 'Vacation',
//     SICK_LEAVE: 'Sick Leave'
// } as const;
// export type LeaveType = keyof typeof LEAVE_TYPE;

export enum LeaveType {
    PAID_TIME = 'PAID_TIME',
    VACATION = 'VACATION',
    SICK_LEAVE = 'SICK_LEAVE'
}
export enum LeaveTypeJson {
    VACATION = "Vacation",
    SICK_LEAVE = "Sick leave",
    PAID_TIME = "Paid time"
}

// export const LEAVE_STATUS = {
//     ACCEPTED : 'Accepted',
//     REJECTED : 'Rejected',
//     PENDING : 'Pending'
// }
// export type LeaveStatus = keyof typeof LEAVE_STATUS;

export enum LeaveStatus {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}
export enum LeaveStatusJson {
    PENDING = "Pending",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected"
}

export enum Week {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

