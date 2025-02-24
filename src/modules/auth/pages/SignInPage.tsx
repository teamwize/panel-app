import React, {useContext, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {signin} from "@/core/services/authService";
import {UserContext} from "~/contexts/UserContext.tsx";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {AuthenticationResponse, LoginRequest} from "@/core/types/authentication.ts";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Eye, EyeOff, LogIn} from 'lucide-react';
import Logo from "@/components/icon/Logo.tsx";
import {Card} from "@/components/ui/card";
import PageContent from "@/components/layout/PageContent";

const FormSchema = z.object({
    email: z.string().email({message: "Email format is not correct"}),
    password: z.string().min(8, {message: "Password must be over 8 characters"}),
});

export default function SignInPage() {
    const {authenticate} = useContext(UserContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentURL = searchParams.get('redirect');
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

        signin(payload)
            .then((response: AuthenticationResponse) => {
                setIsProcessing(false);
                authenticate(response.accessToken);
                navigate(currentURL || '/');
            })
            .catch((error: string | null) => {
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
        <div
            className="min-h-[100dvh] w-full bg-[#f9f9f9f9] from-primary/5 via-primary/10 to-secondary/20 overflow-auto">
            <div className="container flex items-center justify-center min-h-[100dvh] lg:max-w-none lg:px-0">
                <div className="relative w-full py-6 lg:py-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[420px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <Logo className="h-12 w-12 mx-auto"/>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome back
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Sign in with your email and password to access your account.
                            </p>
                        </div>

                        <PageContent>
                            <Card className="mx-auto p-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
                                        <EmailField form={form}/>
                                        <PasswordField form={form}/>

                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant="link"
                                                className="px-0 font-medium text-sm"
                                            >
                                                Forgot password?
                                            </Button>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isProcessing}
                                        >
                                            <LogIn className="w-4 h-4 mr-2"/>
                                            {isProcessing ? 'Signing In...' : 'Sign In'}
                                        </Button>
                                    </form>
                                </Form>
                            </Card>
                        </PageContent>

                        <p className="px-8 text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


type FieldProps = {
    form: UseFormReturn
}

function EmailField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="email"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input id="email" placeholder="Email"{...field}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}


function PasswordField({form}: FieldProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <FormField
            control={form.control}
            name="password"
            render={({field}) => (
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
                                {showPassword ? (<EyeOff className="h-5 w-5"/>) : (<Eye className="h-5 w-5"/>)}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}