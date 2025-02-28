//user enum

export enum UserStatus {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED",
    ARCHIVED = "ARCHIVED"
}

export enum UserRole {
    Admin = "ORGANIZATION_ADMIN",
    Employee = "EMPLOYEE",
    TeamAdmin = "TEAM_ADMIN"
}

export const userRoles = [
    {value: UserRole.Admin, label: "Admin"},
    {value: UserRole.Employee, label: "Employee"},
    {value: UserRole.TeamAdmin, label: "Team Admin"}
];

//leave enum and const

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

export enum LeaveTypeCycle {
    UNLIMITED = 'UNLIMITED',
    PER_MONTH = 'PER_MONTH',
    PER_YEAR = 'PER_YEAR'
}

export enum LeaveTypeCycleJson {
    UNLIMITED = 'Unlimited',
    PER_MONTH = 'Per Month',
    PER_YEAR = 'Per Year'
}

export enum LeaveTypeStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED'
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

