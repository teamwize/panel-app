import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {LeavePolicyResponse, LeaveResponse, UserLeaveBalanceResponse} from "@/core/types/leave.ts";
import {UserResponse} from "@/core/types/user.ts";
import {getLeaves, getLeavesBalance, getLeavesPolicy} from "@/core/services/leaveService.ts";
import {getUser} from "@/core/services/userService.ts";
import LeaveList from "@/modules/leave/components/LeaveList.tsx";
import BalanceItem from "@/modules/home/components/BalanceItem.tsx";
import UserDetailsCard from "@/modules/user/components/UserDetailsCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import PageHeader from "@/components/layout/PageHeader";

export default function UserDetailsPage() {
    const {id} = useParams();
    const [employeeDetails, setEmployeeDetails] = useState<UserResponse | null>(null);
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
    const [leavePolicy, setLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Unified data fetching
    const fetchEmployeeData = async () => {
        try {
            const [userDetails, userLeaves, userBalance, userPolicy] = await Promise.all([
                getUser(id!),
                getLeaves({userId: Number(id)}),
                getLeavesBalance(Number(id)),
                getLeavesPolicy(Number(id)),
            ]);

            setEmployeeDetails(userDetails);
            setLeaveRequests(userLeaves.contents || []);
            setBalanceData(userBalance);
            setLeavePolicy(userPolicy || null);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error | string);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (id) {
            fetchEmployeeData();
        }
    }, [id]);

    const backButtonPath = location.state?.from || "/requests";

    return (
        <>
            <PageHeader backButton={backButtonPath} title="Employee Details">
                <Button className="px-2 h-9"
                        onClick={() => navigate(`/users/${id}/update`, {state: {from: `/users/${id}/`}})}>Update</Button>
            </PageHeader>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-6">
                    <UserDetailsCard employeeDetails={employeeDetails} leavePolicy={leavePolicy}/>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
                        {balanceData.length > 0 ? (
                            <div className="grid grid-cols-3 text-center gap-2 mx-auto">
                                {balanceData.map((item) => (
                                    <BalanceItem key={item?.type?.id} item={item}/>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">No balance data available.</p>
                        )}
                    </section>

                    <section>
                        {leaveRequests.length > 0 ? (
                            <LeaveList leaveRequests={leaveRequests}/>
                        ) : (
                            <p className="text-center text-muted-foreground">No leave requests available.</p>
                        )}
                    </section>
                </Card>
            </main>
        </>
    );
}