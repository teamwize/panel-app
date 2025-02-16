import React, {useEffect, useState} from 'react';
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {TeamResponse} from "@/core/types/team.ts";
import {deleteTeam, getTeams, updateTeam} from "@/core/services/teamService.ts";
import {Pencil, Trash} from "lucide-react";
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

    return (
        <>
            <PageHeader title='Teams'>
                <TeamCreateDialog
                    teamList={teamList}
                    onTeamCreated={() => {
                        handleUpdateSuccess();
                    }}
                />
            </PageHeader>
            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border bg-white shadow-sm p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-sm font-semibold text-gray-700">Name</TableHead>
                                <TableHead
                                    className="text-right pr-8 text-sm font-semibold text-gray-700">Actions</TableHead>
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
            <TableCell className="font-medium text-gray-900">{t.name}</TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        className="px-2 hover:bg-gray-100 transition-colors"
                        variant="ghost"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setSelectedTeamForUpdate(t)}
                    >
                        <Pencil className="h-4 text-gray-600"/>
                    </Button>

                    <Button
                        className="px-2 hover:bg-red-50 transition-colors"
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