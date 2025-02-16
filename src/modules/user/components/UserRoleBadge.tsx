import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

type UserRoleBadgeProps = {
    role: string;
};

export function UserRoleBadge({role}: UserRoleBadgeProps) {
    const getRoleStyles = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50';
            case 'manager':
                return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50';
            case 'employee':
                return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50';
        }
    };

    return (
        <Badge
            variant="outline"
            className={cn(getRoleStyles(role))}
        >
            {role}
        </Badge>
    );
}