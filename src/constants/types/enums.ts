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

//dayOff enum

export enum DayOffType {
    PAID_TIME = 'PAID_TIME',
    VACATION = 'VACATION',
    SICK_LEAVE = 'SICK_LEAVE'
}

export enum DayOffJson {
    VACATION = "Vacation",
    SICK_LEAVE = "Sick leave",
    PAID_TIME = "Paid time"
}

export enum Status {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}

export enum DayOffStatusJson {
    PENDING = "Pending",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected"
}

export enum DayOffColor {
    VACATION = "GREEN",
    SICK_LEAVE = "RED",
    PAID_TIME = "BLUE"
}

export enum DayOffStatusColor {
    PENDING = "YELLOW",
    ACCEPTED = "GREEN",
    REJECTED = "RED"
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