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

    const onStatusChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            status: value === "ALL" ? undefined : value as LeaveStatus
        }));
    };

    const onTeamChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            teamId: value === "ALL" ? undefined : Number(value)
        }));
    }

    const onUserChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            userId: value === "ALL" ? undefined : Number(value)
        }));
    }

    return (
        <div className="flex gap-4 items-center p-4 m-4 border rounded-lg">

            <Select
                value={filters.status}
                onValueChange={onStatusChange}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder='All'/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key='all' value="ALL">All</SelectItem>
                    {Object.values(LeaveStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.teamId?.toString() || ""}
                onValueChange={onTeamChange}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select a team"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key='all' value="ALL">All</SelectItem>
                    {teamList.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.userId?.toString() || ""}
                onValueChange={onUserChange}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select a User"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key='all' value="ALL">All</SelectItem>
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