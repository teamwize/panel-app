import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

type UserStatusBadgeProps = {
    status: string;
};

export function UserStatusBadge({status}: UserStatusBadgeProps) {
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50';
            case 'inactive':
                return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50';
        }
    };

    return (
        <Badge
            variant="outline"
            className={cn(getStatusStyles(status))}
        >
            {status}
        </Badge>
    );
}