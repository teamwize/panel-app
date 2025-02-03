import {useNavigate} from 'react-router-dom';
import {Clock} from 'lucide-react';
import {Button} from '@/components/ui/button';
import React from "react";
import {Card} from "@/components/ui/card";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";

export default function LeavePendingPage() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <>
            <PageHeader title='Create Leave Request'></PageHeader>
            <PageContent>
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm justify-center items-center"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <div className="flex flex-col items-center text-center gap-1">
                        <Clock className="h-12 w-12" aria-hidden="true"/>
                        <p className="p-2 text-sm">Your request has been created.</p>
                        <Button className="mt-4" onClick={goHome}>Home</Button>
                    </div>
                </Card>
            </PageContent>
        </>
    )
}