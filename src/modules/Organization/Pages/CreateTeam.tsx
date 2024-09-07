import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {TeamResponse} from "~/constants/types";
import {getTeam, createTeam} from "~/services/WorkiveApiClient.ts";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Card} from "@/components/ui/card";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Team Name must be over 2 characters"
    }).max(20, {
        message: "Team Name must be under 20 characters"
    }),
});

type CreateTeamInputs = z.infer<typeof FormSchema>;

export default function CreateTeam() {
    const navigate = useNavigate();
    const [teamList, setTeamList] = useState<TeamResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<CreateTeamInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    });

    const goBack = () => navigate('/organization/team');

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

    const onSubmit = (data: CreateTeamInputs) => {
        createOrganizationTeam(data);
    };

    const createOrganizationTeam = (data: CreateTeamInputs) => {
        const exists = teamList.some(t => t.name === data.name);

        if (exists) {
            setErrorMessage('A team already exists with this name.');
            return;
        }

        const payload = {
            name: data.name,
            metadata: {},
        };
        setIsProcessing(true);

        createTeam(payload)
            .then(() => {
                setIsProcessing(false);
                navigate('/organization/team');
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error?.message);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <div className="flex flex-wrap text-lg font-medium px-4 pt-4 gap-2">
                <button onClick={goBack}>
                    <ChevronLeft className="h-6 w-6"/>
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Create Team</h1>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Team Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Team Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-fit" disabled={isProcessing}>
                                {isProcessing ? 'Creating...' : 'Create'}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    );
}