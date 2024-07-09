export type Logo = {
  src: string;
  alt: string
}

export type Country = {
  name: string;
  code: string
}

export type Navigation = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string
}

export type LeaveType = {
  name: string;
  value: string
}

export type WeekDays = {
  day: string
}

export type Organization = {
  id: number;
  name: string;
}

export enum UserStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  ARCHIVED = "ARCHIVED"
}

export enum UserRole {
  ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN",
  SITE_ADMIN = "SITE_ADMIN",
  EMPLOYEE = "EMPLOYEE",
  API = "API"
}

export type User = {
  id: number;
  status: UserStatus;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  organization: Organization;
}

export enum DayOffRequestStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING'
}

export enum DayOffType {
  PAID_TIME = 'PAID_TIME',
  VACATION = 'VACATION',
  SICK_LEAVE = 'SICK_LEAVE'
}

export type DayOffResponse = {
  id: number;
  createdAt: string;
  updatedAt: string;
  startAt: string;
  endAt: string;
  status: DayOffRequestStatus;
  type: DayOffType;
}

export type PagedResponseDayOffResponse = {
  contents: DayOffType[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalContents: number
}

export type Location = {
  pathname: string
}