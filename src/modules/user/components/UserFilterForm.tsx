import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {TeamResponse} from "@/core/types/team.ts";
import {getTeams} from "@/core/services/teamService";
import {Search} from "lucide-react";

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
        <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search by name, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-muted/50 border-muted-foreground/20"
                        />
                    </div>

                    <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value)}>
                        <SelectTrigger className="w-full sm:w-[200px] bg-muted/50 border-muted-foreground/20">
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

                    <Button
                        onClick={handleSearch}
                        className="sm:w-[100px] bg-primary hover:bg-primary/90 text-primary-foreground shadow transition-colors"
                    >
                        <Search className="h-4 w-4 mr-2"/>
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}