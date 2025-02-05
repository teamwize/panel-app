import React from "react";
import LeavePolicyList from "@/modules/leave/components/LeavePolicyList.tsx";
import LeaveTypeList from "@/modules/leave/components/LeaveTypeList.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PageContent from "@/components/layout/PageContent.tsx";

export default function LeavePolicyPage() {
    return (
        <>
            <PageHeader title="Leave Policy">
            </PageHeader>
            <PageContent>
                <LeavePolicyList/>
                <LeaveTypeList/>
            </PageContent>
        </>
    )
}
