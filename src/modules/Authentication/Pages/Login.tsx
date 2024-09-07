import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from "~/services/WorkiveApiClient.ts";
import { UserContext } from "~/contexts/UserContext.tsx";
import { toast } from "@/components/ui/use-toast";
import { getErrorMessage } from "~/utils/errorHandler.ts";
import { Logo } from '../../../core/components';
import { AuthenticationResponse, LoginRequest } from "~/constants/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from 'lucide-react';

const FormSchema = z.object({
    email: z.string().email({ message: "Email format is not correct" }),
    password: z.string().min(8, { message: "Password must be over 8 characters" }),
});

export default function Login() {
    const { authenticate } = useContext(UserContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentURL = searchParams.get('redirect');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload: LoginRequest = {
            email: data.email,
            password: data.password,
        };

        setIsProcessing(true);
        login(payload)
            .then((response: AuthenticationResponse) => {
                setIsProcessing(false);
                authenticate(response.accessToken, response.user);
                navigate(currentURL || '/calendar');
            })
            .catch((error: string | null) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error);
                setErrorMessage(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
                <div className="flex flex-col items-center mb-6">
                    <Logo className="h-10 w-auto" />
                    <h2 className="text-2xl font-semibold mt-4">Login</h2>
                </div>

                {errorMessage && (
                    <Alert>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                placeholder="Password"
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center px-2"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
                        </div>

                        <Button type="submit" className="w-full mt-4">{isProcessing ? "Waiting ..." : "Sign in"}</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}