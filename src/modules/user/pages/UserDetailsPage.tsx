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

    const backButtonPath = location.state?.from || "/leaves";

    const handleEmployeeUpdateClick = () => {
        navigate(`/users/${id}/update`, {state: {from: `/users/${id}/`}})
    };

    return (
        <>
            <PageHeader backButton={backButtonPath} title="User Details">
                <Button
                    className="px-4 h-9"
                    onClick={handleEmployeeUpdateClick}
                >
                    <PencilIcon className="w-4 h-4 mr-2"/>
                    Update User
                </Button>
            </PageHeader>
            <PageContent>
                        <UserDetailsCard employeeDetails={employeeDetails} leavePolicy={leavePolicy}/>

                        <section>
                            <PageSection title="Leave Balance"
                                         description="An overview of user's leave balance, categorized by different leave types, showing the total allocation, used days, and remaining balance for each type."></PageSection>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {balanceData.map((item) => (
                                    <UserLeaveBalanceItem
                                        key={item?.activatedType.typeId}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </section>


                        <div className="w-full">
                            {leaveRequests && (
                                <>
                                    <PageSection
                                        title="Leaves"
                                        description="A detailed list of user leave requests"
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
            </PageContent>
        </>
    );
}