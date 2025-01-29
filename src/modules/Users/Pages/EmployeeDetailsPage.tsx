import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {LeavePolicyResponse, LeaveResponse, UserLeaveBalanceResponse} from "@/constants/types/leaveTypes.ts";
import {UserResponse} from "@/constants/types/userTypes.ts";
import {getLeaves, getLeavesBalance, getLeavesPolicy} from "@/services/leaveService.ts";
import {getUser} from "@/services/userService.ts";
import LeaveRequestList from "@/core/components/LeaveRequestList.tsx";
import BalanceItem from "@/core/components/BalanceItem.tsx";
import {PageHeader} from "@/core/components";
import EmployeeDetailsCard from "@/modules/Users/components/EmployeeDetailsCard.tsx";

export default function EmployeeDetailsPage() {
    const {id} = useParams();
    const [employeeDetails, setEmployeeDetails] = useState<UserResponse | null>(null);
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
    const [leavePolicy, setLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const location = useLocation();

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
            <PageHeader backButton={backButtonPath} title="Employee Details"/>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-6">
                    <EmployeeDetailsCard employeeDetails={employeeDetails} leavePolicy={leavePolicy}/>

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
                        <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
                        {leaveRequests.length > 0 ? (
                            <LeaveRequestList leaveRequests={leaveRequests}/>
                        ) : (
                            <p className="text-center text-muted-foreground">No leave requests available.</p>
                        )}
                    </section>
                </Card>
            </main>
        </>
    );
}