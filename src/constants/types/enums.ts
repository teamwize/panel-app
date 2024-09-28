//user enum

export enum UserStatus {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED",
    ARCHIVED = "ARCHIVED"
}

export enum UserRole {
    Admin = "ORGANIZATION_ADMIN",
    Employee = "EMPLOYEE",
    API = "API"
}

//dayOff enum and const

export enum DayOffType {
    PAID_TIME = 'Paid time',
    VACATION = 'Vacation',
    SICK_LEAVE = 'Sick Leave'
}

export enum DayOffStatus {
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
    PENDING = 'Pending'
}

export enum LabelType {
    GREEN = 'GREEN',
    RED = 'RED',
    BLUE = 'BLUE',
    YELLOW = 'YELLOW',
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