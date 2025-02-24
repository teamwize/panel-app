import React, {useEffect, useState} from 'react';
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {TeamResponse} from "@/core/types/team.ts";
import {createTeam, deleteTeam, getTeams, updateTeam} from "@/core/services/teamService.ts";
import {Pencil, Plus, Trash} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import TeamUpdateDialog from "@/modules/team/components/TeamUpdateDialog.tsx";
import {DeleteModal} from "@/modules/team/components/TeamDeleteDialog.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import TeamCreateDialog from "@/modules/team/components/TeamCreateDialog.tsx";

export default function TeamsPage() {
    const [teamList, setTeamList] = useState<TeamResponse[]>([]);
    const [selectedTeamForUpdate, setSelectedTeamForUpdate] = useState<TeamResponse | null>(null);
    const [selectedTeamForDelete, setSelectedTeamForDelete] = useState<TeamResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await getTeams();
                setTeamList(response);
            } catch (error) {
                const errorMessage = getErrorMessage(error as Error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        };

        fetchTeams();
    }, []);

    const handleRemoveTeam = async () => {
        if (!selectedTeamForDelete) return;

        setIsProcessing(true);
        try {
            await deleteTeam(selectedTeamForDelete.id);
            setTeamList(teamList.filter((team) => team.id !== selectedTeamForDelete.id));
            toast({
                title: "Success",
                description: "team removed successfully!",
                variant: "default",
            });
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedTeamForDelete(null);
        }
    };

    const handleUpdateSuccess = async () => {
        try {
            const response = await getTeams();
            setTeamList(response);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to refresh team list",
                variant: "destructive",
            });
        }
    };

    const createOrganizationTeam = async (name: string) => {
        try {
            setIsProcessing(true);
            setIsCreateDialogOpen(false);

            // Check if the team name already exists
            const exists = teamList.some((t) => t.name === name);
            if (exists) {
                toast({
                    title: "Error",
                    description: "A team with this name already exists.",
                    variant: "destructive",
                });
                return;
            }

            await createTeam({
                name: name,
                metadata: {},
            });

            toast({
                title: "Success",
                description: "Team created successfully!",
                variant: "default",
            });

            // Refresh team list after creation
            const updatedTeams = await getTeams();
            setTeamList(updatedTeams);

        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <PageHeader title='Teams'>
                <Button className="px-2 h-9" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Create
                </Button>
            </PageHeader>
            <PageContent>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamList.map((t) => (
                                <TeamRowItem
                                    key={t.id}
                                    t={t}
                                    setSelectedTeamForUpdate={setSelectedTeamForUpdate}
                                    setSelectedTeamForDelete={setSelectedTeamForDelete}
                                    isProcessing={isProcessing}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    <TeamCreateDialog
                        isOpen={isCreateDialogOpen}
                        onClose={() => setIsCreateDialogOpen(false)}
                        teamList={teamList}
                        onSubmit={(name) => createOrganizationTeam(name)}
                    />

                    {selectedTeamForUpdate && (
                        <TeamUpdateDialog
                            teamId={selectedTeamForUpdate.id}
                            teamName={selectedTeamForUpdate.name}
                            onClose={() => setSelectedTeamForUpdate(null)}
                            onSuccess={handleUpdateSuccess}
                            updateTeam={updateTeam}
                        />
                    )}

                    {selectedTeamForDelete && (
                        <DeleteModal
                            team={selectedTeamForDelete}
                            handleReject={() => setSelectedTeamForDelete(null)}
                            handleAccept={handleRemoveTeam}
                        />
                    )}
                </Card>
            </PageContent>
        </>
    );
}

type TeamItemProps = {
    t: TeamResponse;
    isProcessing: boolean;
    setSelectedTeamForUpdate: (team: TeamResponse | null) => void;
    setSelectedTeamForDelete: (team: TeamResponse | null) => void;
};

function TeamRowItem({ t, isProcessing, setSelectedTeamForUpdate, setSelectedTeamForDelete }: TeamItemProps) {
    return (
        <TableRow className="hover:bg-gray-50 transition-colors">
            <TableCell>{t.name}</TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Button
                        className="h-8 w-8 p-0"
                        variant="ghost"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setSelectedTeamForUpdate(t)}
                    >
                        <Pencil className="h-4 text-gray-600"/>
                    </Button>

                    <Button
                        className="h-8 w-8 p-0"
                        variant="ghost"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setSelectedTeamForDelete(t)}
                    >
                        <Trash className="h-4 text-red-500"/>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}