import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "@/components/ui/use-toast.ts";
import {UserResponse, UserUpdateRequest} from "@/constants/types/userTypes.ts";
import {TeamResponse} from "@/constants/types/teamTypes.ts";
import {LeavePolicyResponse} from "@/constants/types/leaveTypes.ts";
import {getLeavesPolicies} from "@/services/leaveService.ts";
import {getTeams} from "@/services/teamService.ts";

const FormSchema = z.object({
  firstName: z.string().min(1, {message: "First Name is required"}),
  lastName: z.string().min(1, {message: "Last Name is required"}),
  email: z.string().email({message: "Invalid email address"}),
  phone: z.string().optional(),
  teamId: z.string().min(1, {message: "Team selection is required"}),
  leavePolicyId: z.number().int({message: "Leave Policy selection is required"}),
});

type UpdateEmployeeDialogProps = {
  employee: UserResponse;
  handleUpdateEmployee: (updatedEmployee: UserUpdateRequest) => void;
  handleClose: () => void;
};

export default function UpdateEmployeeDialog({
                                               employee,
                                               handleUpdateEmployee,
                                               handleClose,
                                             }: UpdateEmployeeDialogProps) {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicyResponse[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || "",
      teamId: employee.team.id.toString(),
      leavePolicyId: employee.leavePolicy.id,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, policyData] = await Promise.all([getTeams(), getLeavesPolicies()]);
        setTeams(teamData);
        setLeavePolicies(policyData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    handleUpdateEmployee({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      // teamId: parseInt(data.teamId),
      leavePolicyId: data.leavePolicyId,
    });
    toast({
      title: "Success",
      description: "Employee updated successfully",
      variant: "default",
    });
    handleClose();
  };

  return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
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
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                />
              </div>
              <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone (optional)" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="teamId"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Team</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a team"/>
                            </SelectTrigger>
                            <SelectContent>
                              {teams.map((team) => (
                                  <SelectItem key={team.id} value={team.id.toString()}>
                                    {team.name}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="leavePolicyId"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Leave Policy</FormLabel>
                        <FormControl>
                          <Select onValueChange={(value) => field.onChange(Number(value))}
                                  value={field.value?.toString()}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a leave policy"/>
                            </SelectTrigger>
                            <SelectContent>
                              {leavePolicies.map((policy) => (
                                  <SelectItem key={policy.id} value={policy.id.toString()}>
                                    {policy.name}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}