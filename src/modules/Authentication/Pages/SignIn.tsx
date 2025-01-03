import React, {useState, useContext} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {useNavigate, useSearchParams, Link} from 'react-router-dom';
import {signin} from "@/services/authService";
import {UserContext} from "~/contexts/UserContext.tsx";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {Logo} from '../../../core/components';
import {AuthenticationResponse, LoginRequest} from "@/constants/types/authTypes";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Eye, EyeOff} from 'lucide-react';

const FormSchema = z.object({
    email: z.string().email({message: "Email format is not correct"}),
    password: z.string().min(8, {message: "Password must be over 8 characters"}),
});

export default function SignIn() {
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
        <div className="relative min-h-screen bg-gray-100 flex flex-col gap-6 items-center justify-center px-4">
            <div className="flex flex-col justify-center">
                <Logo className="h-14 border-2 rounded mb-2 mx-auto"/>
                <h1 className="text-xl font-semibold text-gray-700">Teamwize</h1>
            </div>

            <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <EmailField form={form}/>
                        <PasswordField form={form}/>
                        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 block">Forgot your password?</a>
                        <Button type="submit" className="w-full mt-4">{isProcessing ? "Waiting ..." : "Sign in"}</Button>
                        <div className="mt-4 text-center text-sm">
                            Don't have an account?
                            <Link to="/signup" className="underline ml-1">Sign up</Link>
                        </div>
                    </form>
                </Form>
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