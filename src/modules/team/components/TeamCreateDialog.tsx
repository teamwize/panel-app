import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {TeamResponse} from "@/core/types/team.ts";
import {createTeam} from "@/core/services/teamService.ts";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Team Name must be over 2 characters"
    }).max(20, {
        message: "Team Name must be under 20 characters"
    }),
});

type CreateTeamInputs = z.infer<typeof FormSchema>;

interface TeamCreateDialogProps {
    teamList: TeamResponse[];
    onTeamCreated: () => void;
}

export default function TeamCreateDialog({teamList, onTeamCreated}: TeamCreateDialogProps) {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<CreateTeamInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    });

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
                setOpen(false);
                form.reset();
                onTeamCreated();
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Team</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Team</DialogTitle>
                </DialogHeader>

                {errorMessage && (
                    <Alert>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-fit" disabled={isProcessing}>
                            {isProcessing ? 'Creating...' : 'Create'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}