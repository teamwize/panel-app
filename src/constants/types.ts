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
  name :string;
  value: string
}

export type WeekDays = {
  day: string
}
