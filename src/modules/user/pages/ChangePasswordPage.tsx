import React, {useContext, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {useForm, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateUserPassword} from "@/core/services/userService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {ChangePasswordRequest} from "@/core/types/user.ts";
import {UserContext} from "@/contexts/UserContext.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";

const FormSchema = z
    .object({
        password: z.string().min(8, {
            message: "Current Password is must be over 8 characters, please try again",
        }),
        newPassword: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        confirmNewPassword: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        })
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match.",
        path: ["confirmNewPassword"],
    });

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const {user} = useContext(UserContext);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const {handleSubmit} = form;

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload: ChangePasswordRequest = {
            currentPassword: data.password,
            newPassword: data.newPassword,
        };

        setIsProcessing(true);
        updateUserPassword(payload, user.id)
            .then(() => {
                setIsProcessing(false);
                toast({
                    title: "Success",
                    description: "Password updated successfully!",
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
            <PageHeader backButton='/settings' title='Change Password'></PageHeader>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <PasswordInputField form={form} name="password" label="Current Password" placeholder="Enter current password" />
                            <PasswordInputField form={form} name="newPassword" label="New Password" placeholder="Enter new password" />
                            <PasswordInputField form={form} name="confirmNewPassword" label="Confirm New Password" placeholder="Re-enter new password" />
                            <Button type="submit" className="w-fit" disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Save'}</Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    );
}

type PasswordInputFieldProps = {
    form: UseFormReturn;
    name: string;
    label: string;
    placeholder: string;
};

function PasswordInputField({form, name, label, placeholder}: PasswordInputFieldProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type="password"
                            {...field}
                            onBlur={() => {
                                if (name === "confirmNewPassword") {
                                    form.trigger("confirmNewPassword")
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}