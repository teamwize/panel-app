import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom';
import {updateOrganization} from "@/services/organizationService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {OrganizationResponse, OrganizationUpdateRequest} from "@/constants/types/organizationTypes";
import { DayOffType} from "@/constants/types/enums";
import {Button} from "@/components/ui/button";
import {AlertDescription, Alert} from "@/components/ui/alert";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";

const FormSchema = z.object({
    vacation: z.number().min(0, {message: "Vacation is required"}),
    sick: z.number().min(0, {message: "Sick leave is required"}),
    paidTime: z.number().min(0, {message: "Paid time is required"}),
});

export default function Policy() {
    const [balanceInfo, setBalanceInfo] = useState<DayOffType>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            vacation: 0,
            sick: 0,
            paidTime: 0,
        },
    });

    // useEffect(() => {
    //     getOrganization()
    //         .then((response: OrganizationResponse) => {
    //             setBalanceInfo(response);
    //             console.log(response);
    //             form.reset({
    //                 vacation: response.vacation,
    //                 sick: response.sick,
    //                 paidTime: response.paidTime,
    //             });
    //         })
    //         .catch((error) => {
    //             const errorMessage = getErrorMessage(error);
    //             toast({
    //                 title: "Error",
    //                 description: errorMessage,
    //                 variant: "destructive",
    //             });
    //         });
    // }, []);

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload = {
            VACATION: data.vacation,
            SICK_LEAVE: data.sick,
            PAID_TIME: data.paidTime,
        };
        setBalance(payload);
    }

    const setBalance = (payload: { VACATION: number; SICK_LEAVE: number; PAID_TIME: number; }) => {
        setIsProcessing(true);

        // updateOrganization(payload)
        //     .then((response: OrganizationResponse) => {
        //         setIsProcessing(false);
        //         console.log('Success:', response);
        //         toast({
        //             title: 'Success',
        //             description: 'Balance updated successfully',
        //             variant: 'default'
        //         });
        //     })
        //     .catch((error: string) => {
        //         setIsProcessing(false);
        //         console.error('Error:', error);
        //         const errorMessage = getErrorMessage(error);
        //         setErrorMessage(errorMessage);
        //         toast({
        //             title: 'Error',
        //             description: errorMessage,
        //             variant: 'destructive'
        //         });
        //     });
    }

    return (
        <>
            <div className="flex flex-wrap text-lg font-medium px-4 pt-4 gap-2">
                <h1 className="text-lg font-semibold md:text-2xl">Policy</h1>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
                            <FormField
                                control={form.control}
                                name="vacation"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Vacation</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Vacation"
                                                type="number"
                                                min="0"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sick"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Sick Leave</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Sick Leave"
                                                type="number"
                                                min="0"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paidTime"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Paid Time</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Paid Time"
                                                type="number"
                                                min="0"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-fit" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Save'}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    )
}