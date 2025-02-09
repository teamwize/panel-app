import React, {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {LeaveStatus} from "@/core/types/enum.ts";
import {PagedResponse} from "@/core/types/common.ts";
import {UserResponse} from "@/core/types/user.ts";
import {TeamResponse} from "@/core/types/team.ts";
import {GetLeavesFilter} from "@/core/types/leave.ts";

type FilterEmployeesFormProps = {
    onFilter: (filters: GetLeavesFilter) => void;
    usersList: PagedResponse<UserResponse>;
    teamList: TeamResponse[];
};

export default function LeaveFilterForm({onFilter, teamList, usersList}: FilterEmployeesFormProps) {
    const [filters, setFilters] = useState<GetLeavesFilter>({
        teamId: undefined,
        userId: undefined,
        status: LeaveStatus.PENDING
    });

    const handleSearch = () => {
        onFilter(filters);
    };

    return (
        <div className="flex gap-4 items-center p-4 m-4 border rounded-lg">

            <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({...prev, status: value as LeaveStatus}))}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select a status"/>
                </SelectTrigger>
                <SelectContent>
                    {Object.values(LeaveStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.teamId?.toString() || ""}
                onValueChange={(value) =>
                    setFilters((prev) => ({...prev, teamId: value ? Number(value) : undefined}))
                }
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select a team"/>
                </SelectTrigger>
                <SelectContent>
                    {teamList.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.userId?.toString() || ""}
                onValueChange={(value) =>
                    setFilters((prev) => ({...prev, userId: value ? Number(value) : undefined}))
                }
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select a User"/>
                </SelectTrigger>
                <SelectContent>
                    {usersList?.contents.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                            {user.firstName} {user.lastName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button className="px-3 h-9 w-10" onClick={handleSearch}>
                <Search className="w-4 h-4"/>
            </Button>
        </div>
    );
}