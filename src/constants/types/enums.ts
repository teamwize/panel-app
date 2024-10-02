//user enum

export enum UserStatus {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED",
    ARCHIVED = "ARCHIVED"
}

export const USER_ROLE = {
    ORGANIZATION_ADMIN : "ORGANIZATION_ADMIN",
    EMPLOYEE : "EMPLOYEE",
} as const;
export type UserRole = keyof typeof USER_ROLE;

//leave enum and const

export const LEAVE_TYPE = {
    PAID_TIME: 'Paid time',
    VACATION: 'Vacation',
    SICK_LEAVE: 'Sick Leave'
} as const;
export type LeaveType = keyof typeof LEAVE_TYPE;

export const LEAVE_STATUS = {
    ACCEPTED : 'Accepted',
    REJECTED : 'Rejected',
    PENDING : 'Pending'
}
export type LeaveStatus = keyof typeof LEAVE_STATUS;

export enum Week {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}