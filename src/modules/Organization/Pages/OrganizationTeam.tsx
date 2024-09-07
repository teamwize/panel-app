import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {TeamResponse} from "~/constants/types.ts";
import {deleteTeam, getTeam} from "~/services/WorkiveApiClient.ts";
import {ChevronLeft, Pencil, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";

export default function OrganizationTeam() {
    const [teamList, setTeamList] = useState<TeamResponse[]>([])
    const [selectedTeam, setSelectedTeam] = useState<TeamResponse | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const navigate = useNavigate()

    const goBack = () => navigate('/organization');

    useEffect(() => {
        getTeam()
            .then((response: TeamResponse[]) => {
                setTeamList(response);
                console.log((response))
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
        navigate('/organization/team/create')
    }

    const updateTeam = (teamName: string, id: number) => {
        navigate(`/organization/team/update/${teamName}/${id}`)
    }

    const removeTeam = (id: number) => {
        deleteTeam(id)
            .then((data: TeamResponse) => {
                setIsProcessing(false);
                console.log('Success:', data);
                setTeamList(teamList.filter((team: TeamResponse) => team.id !== id));
            })
            .catch(error => {
                setIsProcessing(false);
                console.error('Error:', error);
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }

    const handleAccept = async (team: TeamResponse) => {
        setIsProcessing(true);
        try {
            setTeamList((prevExamples) => prevExamples.filter((e) => e.name !== team.name));
            toast({
                title: "Success",
                description: "Team removed successfully!",
                variant: "default",
            });
        } catch (error) {
            const errorMessage = getErrorMessage(error as string | Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedTeam(null);
        }
    }

    return (
        <>
            <div className="flex flex-wrap justify-between text-lg font-medium px-4 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={goBack}>
                        <ChevronLeft className="h-6 w-6"/>
                    </button>
                    <h1 className="text-lg font-semibold md:text-2xl">Teams</h1>
                </div>
                <Button onClick={viewCreateTeam}>Create</Button>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                        {teamList.map((t) => (
                            <TeamItem key={t.id} t={t} removeTeam={removeTeam} isProcessing={isProcessing} updateTeam={updateTeam}/>
                        ))}
                    </div>

                    {selectedTeam &&
                        <DeleteModal team={selectedTeam} handleReject={() => setSelectedTeam(null)} handleAccept={handleAccept}/>}
                </Card>
            </main>
        </>
    )
}

type TeamItemProps = {
    t: TeamResponse;
    isProcessing: boolean;
    removeTeam: (id: number) => void;
    updateTeam: (name: string, id: number) => void;
}

function TeamItem({t, isProcessing, removeTeam, updateTeam}: TeamItemProps) {
    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium text-center border-b pb-2 w-full">{t.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-2">
                <div className="flex">
                    <Button
                        onClick={() => updateTeam(t.name, t.id)}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                        disabled={isProcessing}
                    >
                        <Pencil className="h-4 w-4"/>
                        {isProcessing ? "Waiting..." : "Edit"}
                    </Button>
                    <Button
                        onClick={() => removeTeam(t.id)}
                        variant="destructive"
                        className="flex-1 flex items-center justify-center gap-2 ml-2"
                        disabled={isProcessing}
                    >
                        <Trash className="h-4 w-4"/>
                        {isProcessing ? "Waiting..." : "Delete"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

type DeleteModalProps = {
    handleAccept: (team: TeamResponse) => void;
    handleReject: () => void;
    team: TeamResponse;
}

function DeleteModal({handleAccept, handleReject, team}: DeleteModalProps) {
    return (
        <Dialog open={true} onOpenChange={handleReject}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Remove Team</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to remove the {team.name} team?</DialogDescription>
                <DialogFooter className="flex justify-center">
                    <Button
                        onClick={handleReject}
                        variant="outline"
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => handleAccept(team)}
                        variant="destructive"
                        className="ml-4"
                    >
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}