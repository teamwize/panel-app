import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { getErrorMessage } from "~/utils/errorHandler.ts";
import { TeamResponse } from "@/constants/types/teamTypes";
import {deleteTeam, getTeam} from "@/services/teamService";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination } from '../../../core/components';

export default function Teams() {
    const [teamList, setTeamList] = useState<TeamResponse[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<TeamResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 10;

    useEffect(() => {
        getTeam()
            .then((response: TeamResponse[]) => {
                setTeamList(response);
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, []);

    const viewCreateTeam = () => {
        navigate('/organization/team/create');
    };

    const updateTeam = (teamName: string, id: number) => {
        navigate(`/organization/team/update/${teamName}/${id}`);
    };

    const handleRemoveTeam = () => {
        if (selectedTeam) {
            setIsProcessing(true);
            deleteTeam(selectedTeam.id)
                .then(() => {
                    setIsProcessing(false);
                    setTeamList(teamList.filter((team) => team.id !== selectedTeam.id));
                    toast({
                        title: "Success",
                        description: "Team removed successfully!",
                        variant: "default",
                    });
                })
                .catch((error) => {
                    setIsProcessing(false);
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
                    });
                })
                .finally(() => setSelectedTeam(null));
        }
    };

    const paginatedTeamList = teamList.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <>
            <div className="flex flex-wrap justify-between text-lg font-medium px-4 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg font-semibold md:text-2xl">Teams</h1>
                </div>
                <Button onClick={viewCreateTeam}>Create</Button>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col  p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 ">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className='text-right pr-8'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTeamList.map((t) => (
                                <TeamRowItem
                                    key={t.id}
                                    t={t}
                                    setSelectedTeam={setSelectedTeam}
                                    isProcessing={isProcessing}
                                    updateTeam={updateTeam}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    {selectedTeam && (
                        <DeleteModal
                            team={selectedTeam}
                            handleReject={() => setSelectedTeam(null)}
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
            </main>
        </>
    );
}

type TeamItemProps = {
    t: TeamResponse;
    isProcessing: boolean;
    setSelectedTeam: (team: TeamResponse | null) => void;
    updateTeam: (name: string, id: number) => void;
};

function TeamRowItem({ t, isProcessing, setSelectedTeam, updateTeam }: TeamItemProps) {
    return (
        <TableRow>
            <TableCell>{t.name}</TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-4">
                    <Button
                        className={"px-1"}
                        variant="outline"
                        size="sm"
                        onClick={() => updateTeam(t.name, t.id)}
                            disabled={isProcessing}>
                        <Pencil className="h-4" />
                    </Button>

                    <Button
                        className={"px-1"}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTeam(t)}
                        disabled={isProcessing}
                    >
                        <Trash className="h-4 text-[#ef4444]" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

type DeleteModalProps = {
    handleAccept: () => void;
    handleReject: () => void;
    team: TeamResponse;
};

function DeleteModal({ handleAccept, handleReject, team }: DeleteModalProps) {
    return (
        <Dialog open={true} onOpenChange={handleReject}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Remove Team</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to remove the {team.name} team?
                </DialogDescription>
                <DialogFooter className="flex justify-center">
                    <Button onClick={handleReject} variant="outline">
                        No
                    </Button>
                    <Button onClick={handleAccept} variant="destructive" className="ml-4">
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}