import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Save, X} from "lucide-react";
import {getUsers} from "@/core/services/userService";
import {UserRole} from "@/core/types/enum";
import {UserResponse} from "@/core/types/user.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Team name must be at least 2 characters long",
    }).max(20, {
        message: "Team name must be under 20 characters",
    }),
    teamApprovers: z.array(z.string()).min(1, {
        message: "Please select at least one team approver.",
    }),
    approvalMode: z.enum(["ALL", "ANY"], {
        required_error: "Please select an approval mode.",
    }),
});

type CreateTeamInputs = z.infer<typeof FormSchema>;

interface TeamCreateDialogProps {
    onClose: () => void;
    isOpen: boolean;
    onSubmit: (
        name: string,
        teamApprovers: string[],
        approvalMode: "ALL" | "ANY"
    ) => void;
}

export default function TeamCreateDialog({isOpen, onClose, onSubmit}: TeamCreateDialogProps) {
    const [organizationAdmins, setOrganizationAdmins] = useState<UserResponse[]>([]);
    const [isTeamAdminSelected, setIsTeamAdminSelected] = useState<boolean>(false);

    const form = useForm<CreateTeamInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            teamApprovers: [],
            approvalMode: "ALL",
        },
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers(0, 100);
            const admins = response.contents.filter(user => user.role === UserRole.ORGANIZATION_ADMIN);
            setOrganizationAdmins(admins);
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        }
    };

    const handleTeamAdminToggle = () => {
        setIsTeamAdminSelected(!isTeamAdminSelected);
        const currentApprovers = form.getValues("teamApprovers");

        if (isTeamAdminSelected) {
            form.setValue("teamApprovers", currentApprovers.filter((item) => item !== "Team Admin"));
        } else {
            form.setValue("teamApprovers", [...currentApprovers, "Team Admin"]);
        }
    };

    const handleSubmit = (data: CreateTeamInputs) => {
        onSubmit(data.name, data.teamApprovers, data.approvalMode);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Team</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter team name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="approvalMode"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Approval Mode</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="ALL" id="all-approve" />
                                                <Label
                                                    htmlFor="all-approve"
                                                    className="flex items-center gap-2"
                                                >
                                                    All Admins Must Approve
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="ANY" id="any-approve" />
                                                <Label
                                                    htmlFor="any-approve"
                                                    className="flex items-center gap-2"
                                                >
                                                    Any Admin Can Approve
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="teamApprovers"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Team Approvers</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-wrap gap-2">
                                            {organizationAdmins.map((admin) => {
                                                const isSelected = field.value.includes(`${admin.firstName} ${admin.lastName}`);
                                                return (
                                                    <Button
                                                        key={admin.id}
                                                        type="button"
                                                        variant={isSelected ? "secondary" : "outline"}
                                                        className= {`px-3 h-10 flex items-center gap-3
                                                        ${isSelected ? " " : "bg-purple-50 text-purple-700 border-purple-200"}`}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                field.onChange(field.value.filter((item: string) => item !== `${admin.firstName} ${admin.lastName}`));
                                                            } else {
                                                                field.onChange([...field.value, `${admin.firstName} ${admin.lastName}`]);
                                                            }
                                                        }}
                                                    >
                                                        {admin.firstName} {admin.lastName}
                                                    </Button>
                                                );
                                            })}
                                            <Button
                                                type="button"
                                                variant={isTeamAdminSelected ? "secondary" : "outline"}
                                                className={`px-3 h-10 flex items-center gap-3
                                                ${isTeamAdminSelected ? "" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                                                onClick={handleTeamAdminToggle}
                                            >
                                                Team Admin
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button onClick={onClose} type="button" variant="secondary" className="mr-2">
                                <X className="w-4 h-4 mr-2"/>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2"/>
                                Create Team
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}