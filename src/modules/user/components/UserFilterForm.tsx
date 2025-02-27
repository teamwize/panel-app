import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {TeamResponse} from "@/core/types/team.ts";
import {getTeams} from "@/core/services/teamService";
import {Search} from "lucide-react";
import {Card} from "@/components/ui/card";

type FilterEmployeesFormProps = {
    onFilter: (query: string, teamId: string) => void;
};

export default function UserFilterForm({onFilter}: FilterEmployeesFormProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [teams, setTeams] = useState<TeamResponse[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamData = await getTeams();
                setTeams(teamData);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            }
        };

        fetchTeams();
    }, []);

    const handleSearch = () => {
        onFilter(searchQuery, selectedTeam);
    };

    return (
        <Card className="p-5 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-96">
                        <div className="relative flex-1">
                            <Search className="absolute text-gray-500 left-3 top-3 h-4 w-4"/>
                            <Input
                                placeholder="Search by name, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-muted-foreground/20"
                            />
                        </div>
                    </div>

                    <div className="w-full sm:w-48">
                        <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value)}>
                            <SelectTrigger className="w-full sm:w-[200px] border-muted-foreground/20">
                                <SelectValue placeholder="Select a team"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Teams</SelectItem>
                                {teams.map((team) => (
                                    <SelectItem
                                        key={team.id}
                                        value={team.id.toString()}
                                        className="cursor-pointer"
                                    >
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={handleSearch}
                    className="px-3"
                >
                    <Search className="h-4 w-4 mr-2"/>
                    Search
                </Button>
            </div>
        </Card>
    );
}