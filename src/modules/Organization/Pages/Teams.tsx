import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {TeamResponse} from "@/constants/types/teamTypes";
import {deleteTeam, getTeams, updateTeam} from "@/services/teamService";
import {Pencil, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Pagination} from '../../../core/components';
import UpdateTeamDialog from "@/modules/Organization/Components/UpdateTeamDialog.tsx";
import {DeleteModal} from "@/modules/Organization/Components/DeleteTeamDialog.tsx";
import PageContent from "@/core/components/PageContent.tsx";
import {PageHeader} from "@/core/components";

export default function Teams() {
    const [teamList, setTeamList] = useState<TeamResponse[]>([]);
    const [selectedTeamForUpdate, setSelectedTeamForUpdate] = useState<TeamResponse | null>(null);
    const [selectedTeamForDelete, setSelectedTeamForDelete] = useState<TeamResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 10;

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
                description: "Team removed successfully!",
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

    const paginatedTeamList = teamList.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <>
            <PageHeader title='Teams'>
                <Button className="px-2 h-9" onClick={() => navigate('/organization/team/create')}>Create</Button>
            </PageHeader>
            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTeamList.map((t) => (
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
                        <UpdateTeamDialog
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

                    {teamList.length > recordsPerPage && (
                        <Pagination
                            pageSize={recordsPerPage}
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalContents={teamList.length}
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
        <TableRow>
            <TableCell>{t.name}</TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-4">
                    <Button
                        className="px-1"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setSelectedTeamForUpdate(t)}
                    >
                        <Pencil className="h-4" />
                    </Button>

                    <Button
                        className="px-1"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setSelectedTeamForDelete(t)}
                    >
                        <Trash className="h-4 text-[#ef4444]" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}