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

export type DayOffleaveType = {
  name: string;
  value: string
}

export type WeekDays = {
  day: string
}

export type OrganizationResponse = {
  id: number;
  name: string;
}

export type OrganizationUpdateRequest = {
  name: string
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

export type UserResponse = {
  id: number;
  status: UserStatus;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  organization: OrganizationResponse;
}

export type UserCreateRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string ;
  phone?: string;
  organizationName: String;
  timezone?: string;
  countryCode: string

}

export type UserUpdateRequest = {
  id: number;
  status: UserStatus;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  organization: OrganizationResponse;
}

export enum DayOffRequestStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING'
}

export type DayOffStatusUpdatePayload = {
  status: DayOffRequestStatus;
}

export enum DayOffType {
  PAID_TIME = 'PAID_TIME',
  VACATION = 'VACATION',
  SICK_LEAVE = 'SICK_LEAVE'
}

export type DayOffCreateRequest = {
  type: DayOffType;
  start: string;
  end: string
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

export type PagedResponse<T> = {
  contents: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalContents: number
}

export type Location = {
  pathname: string
}

export type AuthenticationResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserResponse
}

export type LoginRequest = {
  email: string;
  password: string
}

export type ChangePasswordRequest = {
  currPass: string;
  newPass: string
}