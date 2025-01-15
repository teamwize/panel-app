import {useNavigate} from 'react-router-dom';
import {Clock} from 'lucide-react';
import {Button} from '@/components/ui/button';
import React, {useEffect} from "react";
import {Card} from "@/components/ui/card";
import {usePageTitle} from "@/contexts/PageTitleContext.tsx";

export default function PendingLeave() {
    const navigate = useNavigate();
    const { setTitle, setChildren } = usePageTitle();

    useEffect(() => {
        setTitle("Leave Request");
        setChildren(null);
    }, [setTitle, setChildren]);

    const goHome = () => {
        navigate('/');
    };

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4">
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
            </main>
        </>
    )
}