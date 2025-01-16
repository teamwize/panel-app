import React, {useContext, useEffect, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {createUser} from "@/services/userService";
import {getTeams} from "@/services/teamService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChevronLeft} from "lucide-react";
import {UserCreateRequest} from "@/constants/types/userTypes";
import {TeamResponse} from "@/constants/types/teamTypes";
import {countries} from "@/constants/countries";
import {UserContext} from "@/contexts/UserContext";
import {UserRole} from "@/constants/types/enums.ts";
import {usePageTitle} from "@/contexts/PageTitleContext.tsx";
import {getLeavesPolicies} from "@/services/leaveService.ts";
import {LeavePolicyResponse} from "@/constants/types/leaveTypes.ts";


const FormSchema = z.object({
    firstName: z.string().min(2, { message: "First Name must be over 2 characters" }).max(20, { message: "First Name must be under 20 characters" }),
    lastName: z.string().min(2, { message: "Last Name must be over 2 characters" }).max(20, { message: "Last Name must be under 20 characters" }),
    email: z.string().email({ message: "Email format is not correct" }),
    password: z.string().min(8, { message: "Password must be over 8 characters" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    country: z.string().min(1, { message: "Country is required" }),
    teamId: z.number({ invalid_type_error: "Team selection is required" }).positive(),
    leavePolicyId: z.number({ invalid_type_error: "Leave Policy selection is required" }).positive(),
});

export default function CreateEmployee() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [leavePolicies, setLeavePolicies] = useState<LeavePolicyResponse[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { setTitle, setChildren } = usePageTitle();

    useEffect(() => {
        setTitle(
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/employees")}
                    className="w-fit justify-start p-0 hover:bg-transparent focus:ring-0"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <span>Create Employee</span>
            </div>
        );
        setChildren(null);
    }, [setTitle]);

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
                navigate("/employees");
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
        <main className="flex flex-1 flex-col gap-4 p-4">
            <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4" x-chunk="dashboard-02-chunk-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FirstnameField form={form}/>
                        <LastNameField form={form}/>
                        <EmailField form={form}/>
                        <PasswordField form={form}/>
                        <PhoneField form={form}/>
                        <TeamField form={form} teams={teams} />
                        <LeavePolicyField form={form} leavePolicies={leavePolicies} />
                        <CountryField form={form}/>
                        <Button type="submit" className="w-fit" disabled={isProcessing}>{isProcessing ? "Processing..." : "Create"}</Button>
                    </form>
                </Form>
            </Card>
        </main>
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
                        <Input placeholder="First Name" {...field} />
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
                            <SelectContent>{countries.map((country) => (<SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>))}</SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}