import React, {useContext, useEffect, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {createUser} from "@/core/services/userService";
import {getTeams} from "@/core/services/teamService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UserCreateRequest} from "@/core/types/user.ts";
import {TeamResponse} from "@/core/types/team.ts";
import {country} from "@/core/types/country.ts";
import {UserContext} from "@/contexts/UserContext";
import {UserRole} from "@/core/types/enum.ts";
import {getLeavesPolicies} from "@/core/services/leaveService.ts";
import {LeavePolicyResponse} from "@/core/types/leave.ts";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import {Loader2, UserPlus, X} from "lucide-react";


const FormSchema = z.object({
    firstName: z.string().min(2, { message: "First Name must be over 2 characters" }).max(20, { message: "First Name must be under 20 characters" }),
    lastName: z.string().min(2, { message: "Last Name must be over 2 characters" }).max(20, { message: "Last Name must be under 20 characters" }),
    email: z.string().email({ message: "Email format is not correct" }),
    password: z.string().min(8, { message: "Password must be over 8 characters" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    country: z.string().min(1, { message: "Country is required" }),
    teamId: z.number({invalid_type_error: "team selection is required"}).positive(),
    leavePolicyId: z.number({invalid_type_error: "leave Policy selection is required"}).positive(),
});

export default function UserCreatePage() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [leavePolicies, setLeavePolicies] = useState<LeavePolicyResponse[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            country: "",
            teamId: 0,
            leavePolicyId: 0,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamData, policyData] = await Promise.all([getTeams(), getLeavesPolicies()]);
                setTeams(teamData);
                setLeavePolicies(policyData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload: UserCreateRequest = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: UserRole.Employee,
            timezone: user.timezone,
            country: data.country,
            teamId: data.teamId,
            leavePolicyId: data.leavePolicyId
        };

        setIsProcessing(true);
        createUser(payload)
            .then(() => {
                setIsProcessing(false);
                toast({
                    title: "Success",
                    description: "Employee created successfully!",
                    variant: "default",
                });
                navigate("/users");
            })
            .catch((error) => {
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
            <PageHeader title="Create Employee" backButton="/users">
                <p className="text-sm text-muted-foreground">
                    Add a new employee to your organization
                </p>
            </PageHeader>
            <PageContent>
                <Card className="mx-auto">
                    <div className="p-4 space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Personal Information</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FirstnameField form={form}/>
                                        <LastNameField form={form}/>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <EmailField form={form}/>
                                        <PhoneField form={form}/>
                                    </div>
                                    <div className="max-w-sm">
                                        <CountryField form={form}/>
                                    </div>
                                </div>

                                {/* Account Settings Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Account Settings</h3>
                                    <div className="max-w-sm">
                                        <PasswordField form={form}/>
                                    </div>
                                </div>

                                {/* Work Settings Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Organization Configuration</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <TeamField form={form} teams={teams}/>
                                        <LeavePolicyField form={form} leavePolicies={leavePolicies}/>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/users")}
                                    >
                                        <X className="mr-2 h-4 w-4"/>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="min-w-[140px]"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4"/>
                                                Create Employee
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </Card>
            </PageContent>
        </>
    );
}

type FieldProps = {
    form: UseFormReturn;
    teams?: TeamResponse[];
    leavePolicies?: LeavePolicyResponse[];
}

function FirstnameField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

function LastNameField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

function EmailField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

function PasswordField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
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
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                        <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

function TeamField({form, teams}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Team</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value !== 0 ? field.value?.toString() : ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                            <SelectContent>{teams.map((team) => (<SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>))}</SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

function LeavePolicyField({form, leavePolicies}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="leavePolicyId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Leave Policy</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value !== 0 ? field.value?.toString() : ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a leave policy" />
                            </SelectTrigger>
                            <SelectContent>{leavePolicies.map((leavePolicy) => (<SelectItem key={leavePolicy.id} value={leavePolicy.id.toString()}>{leavePolicy.name}</SelectItem>))}</SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
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
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Country" />
                            </SelectTrigger>
                            <SelectContent>{country.map((country) => (<SelectItem key={country.code}
                                                                                  value={country.code}>{country.name}</SelectItem>))}</SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}