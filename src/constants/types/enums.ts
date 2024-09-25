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
    PAID_TIME = 'PAID_TIME',
    VACATION = 'VACATION',
    SICK_LEAVE = 'SICK_LEAVE'
}

export const DayOffJson:  { [key in DayOffType]: string } = {
    [DayOffType.VACATION] : 'Vacation',
    [DayOffType.SICK_LEAVE] : 'Sick leave',
    [DayOffType.PAID_TIME] : 'Paid time off',
}

export enum Status {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}

export const DayOffStatusJson: { [key in Status]: string } = {
    [Status.PENDING]: 'Pending',
    [Status.ACCEPTED]: 'Accepted',
    [Status.REJECTED]: 'Rejected',
};

export enum LabelType {
    GREEN = 'GREEN',
    RED = 'RED',
    BLUE = 'BLUE',
    YELLOW = 'YELLOW',
}

export const DayOffColor: { [key in DayOffType]: LabelType } = {
    [DayOffType.VACATION] : LabelType.GREEN,
    [DayOffType.SICK_LEAVE] : LabelType.RED,
    [DayOffType.PAID_TIME] : LabelType.BLUE,
}

export const DayOffStatusColor: { [key in Status]: LabelType } = {
    [Status.PENDING]: LabelType.YELLOW,
    [Status.ACCEPTED]: LabelType.GREEN,
    [Status.REJECTED]: LabelType.RED,
};


export enum Week {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}