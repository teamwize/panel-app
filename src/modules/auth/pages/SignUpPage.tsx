import React, {useContext, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {signup} from "@/core/services/authService";
import {UserContext} from "~/contexts/UserContext.tsx";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {country} from '@/core/types/country.ts';
import {AuthenticationResponse, RegistrationRequest} from "@/core/types/authentication.ts";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Eye, EyeOff} from 'lucide-react';
import Logo from "@/components/icon/Logo.tsx";

const FormSchema = z.object({
    email: z.string().email({message: "Email format is not correct"}),
    password: z.string().min(8, {message: "Password must be over 8 characters"}),
    firstName: z.string().min(2, {message: "First Name must be at least 2 characters"}),
    lastName: z.string().min(2, {message: "Last Name must be at least 2 characters"}),
    organization: z.string().min(2, {message: "organization must be at least 2 characters"}),
    phone: z.string().optional(),
    country: z.string().min(1, {message: "Country is required"}),
});

export default function SignUpPage() {
    const {authenticate} = useContext(UserContext);
    const navigate = useNavigate();
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
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <Logo className="h-14 mx-auto mb-8 opacity-90"/>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Create your account
                    </h1>
                    <p className="mt-3 text-gray-500">
                        Join Teamwize and start collaborating with your team
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Organization Section */}
                            <div className="space-y-6 pb-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Organization Details</h2>
                                <OrganizationField form={form}/>
                                <CountryField form={form}/>
                            </div>

                            {/* Personal Details Section */}
                            <div className="space-y-6 pb-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                                <FullNameField form={form}/>
                                <PhoneField form={form}/>
                            </div>

                            {/* Account Security Section */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Account</h2>
                                <EmailField form={form}/>

                                <PasswordField form={form}/>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Creating Account..." : "Create Account"}
                                </Button>

                                <p className="mt-4 text-center text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </Form>
                </div>
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
                    <FormMessage/>
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
                        <FormMessage/>
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
                        <FormMessage/>
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
                        <Input id="email" placeholder="Email"{...field}/>
                    </FormControl>
                    <FormMessage/>
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
                                placeholder="Create a secure password"
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                                {...field}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
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

function CountryField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="country"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <select className="block w-full rounded-md border border-gray-300 bg-white p-2 h-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"{...field}>
                            <option value="">Choose your country</option>
                            {country.map((country) => (
                                <option key={country.code} value={country.code}>{country.name}</option>
                            ))}
                        </select>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}