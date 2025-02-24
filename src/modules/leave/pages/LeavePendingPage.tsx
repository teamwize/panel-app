import React from "react";
import {useNavigate} from 'react-router-dom';
import {Clock, Home} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {CardContent} from "@/components/ui/card";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";

export default function LeavePendingPage() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <>
            <PageHeader title="Pending Leave Request"></PageHeader>

            <PageContent>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <Clock className="h-12 w-12 text-primary" aria-hidden="true"/>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Request Submitted
                        </h2>
                        <p className="text-gray-500">
                            Your leave request has been created and is pending approval.
                        </p>
                    </div>

                    <Button
                        onClick={goHome}
                        className="flex items-center gap-2"
                    >
                        <Home className="h-4 w-4"/>
                        Return to Home
                    </Button>
                </CardContent>
            </PageContent>
        </>
    );
}