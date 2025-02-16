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
import UserLeaveBalanceItem from "@/modules/home/components/UserLeaveBalanceItem.tsx";
import UserDetailsCard from "@/modules/user/components/UserDetailsCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import PageHeader from "@/components/layout/PageHeader";
import {PagedResponse} from "@/core/types/common.ts";
import PageContent from "@/components/layout/PageContent.tsx";
import {PageSection} from "@/components/layout/PageSection.tsx";
import {PencilIcon} from "@heroicons/react/24/outline";

export default function UserDetailsPage() {
    const {id} = useParams();
    const [employeeDetails, setEmployeeDetails] = useState<UserResponse | null>(null);
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<PagedResponse<LeaveResponse> | null>(null);
    const [leavePolicy, setLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const location = useLocation();
    const navigate = useNavigate();

    // Unified data fetching
    const fetchEmployeeData = async (page = 0) => {
        try {
            const [userDetails, userLeaves, userBalance, userPolicy] = await Promise.all([
                getUser(id!),
                getLeaves({userId: Number(id)}, page),
                getLeavesBalance(Number(id)),
                getLeavesPolicy(Number(id)),
            ]);

            setEmployeeDetails(userDetails);
            setLeaveRequests(userLeaves);
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
    }, [id, currentPage]);

    const backButtonPath = location.state?.from || "/requests";

    const handleEmployeeUpdateClick = () => {
        navigate(`/user/${id}/update`, {state: {from: `/user/${id}/`}})
    };

    return (
        <>
            <PageHeader backButton={backButtonPath} title="Employee Details">
                <Button
                    className="px-4 h-9"
                    onClick={handleEmployeeUpdateClick}
                >
                    <PencilIcon className="w-4 h-4 mr-2"/>
                    Update Employee
                </Button>
            </PageHeader>
            <PageContent>
                <main className="flex flex-1 flex-col gap-4 p-4">
                    <div className="flex flex-1 flex-col  p-4 gap-6">
                        <UserDetailsCard employeeDetails={employeeDetails} leavePolicy={leavePolicy}/>


                        <section>
                            <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
                            {balanceData.length > 0 ? (
                                <div className="grid grid-cols-3 text-center gap-2 mx-auto">
                                    {balanceData.map((item) => (
                                        <UserLeaveBalanceItem key={item?.activatedType?.typeId} item={item}/>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground">No balance data available.</p>
                            )}
                        </section>


                        <div className="w-full">
                            {leaveRequests && (
                                <>
                                    <PageSection
                                        title="Leaves"
                                        description="Here are the leaves of the employee"
                                    >
                                    </PageSection>
                                    <Card>
                                        <LeaveList
                                            leaveRequests={leaveRequests}
                                            setCurrentPage={setCurrentPage}
                                        />
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </PageContent>
        </>
    );
}