import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTeam } from "~/services/WorkiveApiClient.ts";
import { toast } from "@/components/ui/use-toast";
import { getErrorMessage } from "~/utils/errorHandler.ts";
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TeamCreateRequest } from "~/constants/types";

const FormSchema = z.object({
    name: z.string().min(2, { message: "Team Name must be over 2 characters" }).max(20, {
        message: "Team Name must be under 20 characters",
    }),
});

export default function UpdateTeam() {
    const navigate = useNavigate();
    const { name, id } = useParams();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: name || "",
        },
    });

    const goBack = () => navigate('/organization/team');

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if (errorMessage) {
            setErrorMessage('');
        }
        updateTeamInfo(data);
    };

    const updateTeamInfo = (data: z.infer<typeof FormSchema>) => {
        const payload: TeamCreateRequest = {
            name: data.name,
            metadata: {},
        };

        setIsProcessing(true);
        updateTeam(payload, Number(id))
            .then(() => {
                setIsProcessing(false);
                toast({
                    title: "Success",
                    description: "Team updated successfully!",
                    variant: "default",
                });
                navigate('/organization/team');
            })
            .catch(error => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error);
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
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Update Team</h1>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                                {isProcessing ? 'Processing...' : 'Submit'}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    );
}