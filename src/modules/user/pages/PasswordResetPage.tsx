import React, {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useForm, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Card, CardContent} from "@/components/ui/card";
import {Eye, EyeOff, Save} from "lucide-react";
import Logo from "@/components/icon/Logo.tsx";
import {resetPassword} from "@/core/services/authService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {PageSection} from "@/components/layout/PageSection.tsx";

const FormSchema = z
    .object({
        newPassword: z.string().min(8, {message: "Password must be at least 8 characters."}),
        confirmNewPassword: z.string().min(8, {message: "Password must be at least 8 characters."}),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match.",
        path: ["confirmNewPassword"],
    });

export default function PasswordResetPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {newPassword: "", confirmNewPassword: ""},
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setIsProcessing(true);
            await resetPassword({token, newPassword: data.newPassword});
            toast({title: "Success", description: "Password reset successfully!", variant: "default"});
            navigate("/signin");
        } catch (error) {
            toast({title: "Error", description: getErrorMessage(error as Error), variant: "destructive"});
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col">
                    <Logo className="h-12 w-12 text-primary right-0 left-0 mx-auto"/>
                    <PageSection title="Reset Password"
                                 description="Enter a new password below to reset your account password."/>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <PasswordInputField form={form} name="newPassword" label="New Password"
                                                    placeholder="Enter new password"/>
                                <PasswordInputField form={form} name="confirmNewPassword" label="Confirm New Password"
                                                    placeholder="Re-enter new password"/>

                                <Button type="submit" className="w-full" disabled={isProcessing}>
                                    <Save className="mr-2 h-4 w-4"/>
                                    {isProcessing ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

type PasswordInputFieldProps = {
    form: UseFormReturn;
    name: string;
    label: string;
    placeholder: string;
};

function PasswordInputField({form, name, label, placeholder}: PasswordInputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={placeholder}
                                {...field}
                                onBlur={() => {
                                    if (name === "confirmNewPassword") {
                                        form.trigger("confirmNewPassword");
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}