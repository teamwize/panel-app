import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { UserResponse } from "@/constants/types/userTypes";
import { TeamResponse } from "@/constants/types/teamTypes";
import { LeavePolicyResponse } from "@/constants/types/leaveTypes";
import {getLeavesPolicies} from "@/services/leaveService.ts";
import {getTeams} from "@/services/teamService.ts";
import {toast} from "@/components/ui/use-toast.ts";

type UpdateEmployeeDialogProps = {
  employee: UserResponse;
  handleUpdateEmployee: (updatedEmployee: Partial<UserResponse>) => void;
  handleClose: () => void;
};

export default function UpdateEmployeeDialog({employee, handleUpdateEmployee, handleClose,}: UpdateEmployeeDialogProps) {
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone || "");
  const [selectedTeamId, setSelectedTeamId] = useState(employee.team.id.toString());
  const [selectedPolicyId, setSelectedPolicyId] = useState(employee.leavePolicy.id.toString());
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicyResponse[]>([]);

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

  const handleSubmit = () => {
    if (!email || !selectedTeamId || !selectedPolicyId) {
      toast({
        title: "Validation Error",
        description: "All fields must be filled.",
        variant: "destructive",
      });
      return;
    }

    handleUpdateEmployee({
      email,
      phone,
      team: teams.find((team) => team.id.toString() === selectedTeamId),
      leavePolicy: leavePolicies.find((policy) => policy.id.toString() === selectedPolicyId),
    });
    handleClose();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          {/* Team */}
          <div>
            <label className="block text-sm font-medium mb-2">Team</label>
            <Select onValueChange={setSelectedTeamId} value={selectedTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Leave Policy */}
          <div>
            <label className="block text-sm font-medium mb-2">Leave Policy</label>
            <Select onValueChange={setSelectedPolicyId} value={selectedPolicyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a leave policy" />
              </SelectTrigger>
              <SelectContent>
                {leavePolicies.map((policy) => (
                  <SelectItem key={policy.id} value={policy.id.toString()}>{policy.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}