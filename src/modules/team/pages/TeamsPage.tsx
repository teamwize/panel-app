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
import {Badge} from "@/components/ui/badge.tsx";
import {z} from "zod";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Team name must be at least 2 characters long",
    }).max(20, {
        message: "Team name must be under 20 characters",
    }),
    teamApprovers: z.array(z.string()).min(1, {
        message: "Please select at least one team approver.",
    }),
    approvalMode: z.enum(["ALL", "ANY"], {
        required_error: "Please select an approval mode.",
    }),
});

type UpdateTeamInputs = z.infer<typeof FormSchema>;

export default function TeamsPage() {
    const [teamList, setTeamList] = useState<TeamResponse[]>([]);
    const [selectedTeamForUpdate, setSelectedTeamForUpdate] = useState<TeamResponse | null>(null);
    const [selectedTeamForDelete, setSelectedTeamForDelete] = useState<TeamResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await getTeams();
            setTeamList(response);
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        }
    };

    const handleRemoveTeam = async () => {
        if (!selectedTeamForDelete) return;

        setIsProcessing(true);
        try {
            await deleteTeam(selectedTeamForDelete.id);
            setTeamList((prev) => prev.filter((team) => team.id !== selectedTeamForDelete.id));
            toast({
                title: "Success",
                description: "Team removed successfully!",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedTeamForDelete(null);
        }
    };

    const handleUpdateTeam = async (data: UpdateTeamInputs, teamId: number) => {
        try {
            await updateTeam(
                {
                    name: data.name,
                    metadata: {},
                    teamApprovers: data.teamApprovers,
                    approvalMode: data.approvalMode,
                },
                teamId
            );
            await fetchTeams();
            toast({
                title: "Success",
                description: "Team updated successfully!",
                variant: "default",
            });
            setSelectedTeamForUpdate(null);
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        }
    };

    const handleCreateTeam = async (name: string, teamApprovers: string[], approvalMode: "ALL" | "ANY") => {
        try {
            setIsProcessing(true);

            if (teamList.some((t) => t.name === name)) {
                toast({
                    title: "Error",
                    description: "A team with this name already exists.",
                    variant: "destructive",
                });
                return;
            }

            await createTeam({
                name,
                metadata: {},
                teamApprovers,
                approvalMode,
            });

            toast({
                title: "Success",
                description: "Team created successfully!",
                variant: "default",
            });

            await fetchTeams();
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setIsCreateDialogOpen(false);
        }
    };

    return (
        <>
            <PageHeader title="Teams">
                <Button className="px-2 h-9" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                </Button>
            </PageHeader>
            <PageContent>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead>Approval Mode</TableHead>
                                <TableHead>Approver</TableHead>
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
                        onSubmit={handleCreateTeam}
                    />

                    {selectedTeamForUpdate && (
                        <TeamUpdateDialog
                            team={selectedTeamForUpdate}
                            onClose={() => setSelectedTeamForUpdate(null)}
                            onSubmit={handleUpdateTeam}
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

// Rest of the code remains the same...

type TeamItemProps = {
    t: TeamResponse;
    isProcessing: boolean;
    setSelectedTeamForUpdate: (team: TeamResponse | null) => void;
    setSelectedTeamForDelete: (team: TeamResponse | null) => void;
};

function TeamRowItem({t, isProcessing, setSelectedTeamForUpdate, setSelectedTeamForDelete}: TeamItemProps) {
    const exampleData = [
        {teamApprover: ['Rozita Hasani', 'Team Admin'], approvalMode: 'ALL'},
        {teamApprover: ['Team Admin'], approvalMode: 'ANY'},
    ];
    const mockData = exampleData[Math.floor(Math.random() * exampleData.length)];

    return (
        <TableRow className="hover:bg-gray-50 transition-colors">
            <TableCell>{t.name}</TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        mockData.approvalMode === "ALL"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                    }`}
                >
                    {mockData.approvalMode === "ALL" ? "All" : "Any"}
                </span>
            </TableCell>
            <TableCell className="space-x-1">
                {mockData.teamApprover.map((approver) => (<Badge variant='outline'>{approver}</Badge>))}
            </TableCell>
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