import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {getCurrentUser} from "@/services/userService";
import {updateUserPassword} from "@/services/userService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {ChevronLeft} from 'lucide-react';
import {AlertDescription, Alert} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
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
import {ChangePasswordRequest, UserResponse} from "@/constants/types/userTypes";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";

const FormSchema = z.object({
    password: z.string().min(8, {
        message: "Current Password is incorrect, please try again",
    }),
    newPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmNewPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
});

export default function ChangePassword() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [employeeInfo, setEmployeeInfo] = useState<UserResponse | null>(null)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    // Fetch employee information on mount
    useEffect(() => {
        getCurrentUser()
            .then(data => {
                setEmployeeInfo(data);
            })
            .catch(error => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, [])

    const goBack = () => navigate('/settings');

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if (data.newPassword !== data.confirmNewPassword) {
            setErrorMessage("Passwords don't match. Try again");
            return;
        }
        if (errorMessage) {
            setErrorMessage('');
        }
        changePasswordInfo(data);
    };

    const changePasswordInfo = (data: z.infer<typeof FormSchema>) => {
        const payload: ChangePasswordRequest = {
            currentPassword: data.password,
            newPassword: data.newPassword,
        };

        setIsProcessing(true);
        updateUserPassword(payload, employeeInfo.id)
            .then(() => {
                setIsProcessing(false);
                toast({
                    title: "Success",
                    description: "Profile updated successfully!",
                    variant: "default",
                });
                navigate('/settings');
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
                    <ChevronLeft className="h-6 w-6"/>
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Change Password</h1>
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
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New Password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmNewPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Confirm New Password" {...field} />
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
    );
}