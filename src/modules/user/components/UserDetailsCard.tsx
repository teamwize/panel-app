import {Card} from "@/components/ui/card.tsx";
import React from "react";
import {LeavePolicyResponse} from "@/core/types/leave.ts";
import {UserResponse} from "@/core/types/user.ts";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";

type EmployeeDetailsCardProps = {
    employeeDetails: UserResponse | null;
    leavePolicy: LeavePolicyResponse | null;
}

export default function UserDetailsCard({employeeDetails, leavePolicy}: EmployeeDetailsCardProps) {
    return (
        <section>
            {employeeDetails ? (
                <Card className="p-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <UserAvatar avatar={employeeDetails.avatar} avatarSize={48}/>
                        <div>
                            <p className="text-lg font-semibold">
                                {employeeDetails.firstName} {employeeDetails.lastName || ''}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-base mt-1">{employeeDetails.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="text-base mt-1">{employeeDetails.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Team</p>
                            <p className="text-base mt-1">{employeeDetails.team.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Leave Policy</p>
                            <div className="flex flex-wrap gap-2 mt-2">{leavePolicy.name}</div>
                        </div>
                    </div>
                </Card>
            ) : (
                <p>Loading employee information...</p>
            )}
        </section>
    )
}