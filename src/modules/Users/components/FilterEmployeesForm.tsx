import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TeamResponse } from "@/constants/types/teamTypes";
import { getTeams } from "@/services/teamService";
import {Search} from "lucide-react";

type FilterEmployeesFormProps = {
    onFilter: (query: string, teamId: string) => void;
};

export default function FilterEmployeesForm({ onFilter }: FilterEmployeesFormProps) {
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
        <div className="flex gap-4 items-center p-4 m-4 border rounded-lg">
            {/* Search Input */}
            <Input
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
            />

            {/* Team Select */}
            <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value)}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                    {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Search Button */}
            <Button className='px-2 h-9 w-10' onClick={handleSearch}>
                <Search className='w-4 h-4'/>
            </Button>
        </div>
    );
}