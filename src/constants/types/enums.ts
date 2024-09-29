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

//dayOff enum and const

export const DAY_OFF_TYPE = {
    PAID_TIME: 'Paid time',
    VACATION: 'Vacation',
    SICK_LEAVE: 'Sick Leave'
} as const;
export type DayOffType = keyof typeof DAY_OFF_TYPE;

export const DAY_OFF_STATUS = {
    ACCEPTED : 'Accepted',
    REJECTED : 'Rejected',
    PENDING : 'Pending'
}
export type DayOffStatus = keyof typeof DAY_OFF_STATUS;

export enum Week {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}