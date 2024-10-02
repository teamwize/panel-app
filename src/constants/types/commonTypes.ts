export type PagedResponse<T> = {
    contents: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalContents: number
}

export type Navigation = {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string
}

export type Country = {
    name: string;
    code: string
}

export type Balance = {
    label: 'Vacation' | 'Sick leave' | 'Paid time off';
    leaveQuantity: number;
    leaveUsed: number;
    leaveColor: string;
};