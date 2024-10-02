import React, {useState, useContext} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {signup} from "@/services/authService";
import {UserContext} from "~/contexts/UserContext.tsx";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {countries} from '~/constants/countries.ts';
import {AuthenticationResponse, RegistrationRequest} from "@/constants/types/authTypes";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Eye, EyeOff} from 'lucide-react';
import {Logo} from "../../../core/components";

const FormSchema = z.object({
    email: z.string().email({message: "Email format is not correct"}),
    password: z.string().min(8, {message: "Password must be over 8 characters"}),
    firstName: z.string().min(2, {message: "First Name must be at least 2 characters"}),
    lastName: z.string().min(2, {message: "Last Name must be at least 2 characters"}),
    organization: z.string().min(2, {message: "Organization must be at least 2 characters"}),
    phone: z.string().optional(),
    country: z.string().min(1, {message: "Country is required"}),
});

export default function SignUp() {
    const {authenticate} = useContext(UserContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            organization: "",
            phone: "",
            country: "",
        },
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const payload: RegistrationRequest = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            organizationName: data.organization,
            phone: data.phone,
            country: data.country,
            timezone: userTimezone,
        };

        setIsProcessing(true);
        signup(payload)
            .then((response: AuthenticationResponse) => {
                setIsProcessing(false);
                authenticate(response.accessToken);
                navigate('/');
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
        <div className="relative min-h-screen bg-gray-100 flex flex-col gap-6 items-center justify-center">
            <div className="flex flex-col justify-center">
                <Logo className="h-14 border-2 rounded mb-2 mx-auto"/>
                <h1 className="text-xl font-semibold text-gray-700">Teamwize</h1>
            </div>

            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
                {errorMessage && (
                    <Alert>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <OrganizationField form={form}/>
                        <FullNameField form={form}/>
                        <EmailField form={form}/>
                        <PhoneField form={form}/>
                        <PasswordField form={form}/>
                        <CountryField form={form}/>
                        <Button type="submit" className="w-full mt-4">{isProcessing ? "Waiting..." : "Sign Up"}</Button>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?
                            <Link to="/signin" className="underline ml-1">Sign in</Link>
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

function OrganizationField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="organization"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Organization Name" {...field}/>
                    </FormControl>
                </FormItem>
            )}
        />
    )
}

function FullNameField({form}: FieldProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="firstName"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="First Name" {...field}/>
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="lastName"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Last Name" {...field}/>
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    )
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
                        <Input
                            id="email"
                            placeholder="Email"
                            {...field}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}

function PhoneField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="phone"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                        <Input placeholder="Phone" {...field}/>
                    </FormControl>
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
                                {showPassword
                                    ?
                                    (<EyeOff className="h-5 w-5"/>)
                                    :
                                    (<Eye className="h-5 w-5"/>)}
                            </button>
                        </div>
                    </FormControl>
                </FormItem>
            )}
        />
    )
}

function CountryField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="country"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <select
                            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            {...field}
                        >
                            <option value="">Choose your country</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>{country.name}</option>
                            ))}
                        </select>
                    </FormControl>
                </FormItem>
            )}
        />
    )
}