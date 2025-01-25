import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from "@/components/ui/card";
import {Globe, Lock} from 'lucide-react';
import {PageHeader} from "@/core/components";
import PageContent from "@/core/components/PageContent.tsx";

export default function Settings() {
    const navigate = useNavigate();
    const navigateTo = (path: string) => () => navigate(path);

    return (
        <>
            <PageHeader title='Settings'></PageHeader>
            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    <button onClick={navigateTo('/settings/change-password')}
                            className="flex items-center text-md font-semibold gap-2">
                        <Lock className="w-5 h-5"/>
                        Change Password
                    </button>

                    <button onClick={navigateTo('/settings/official-holidays')}
                            className="flex items-center text-md font-semibold gap-2">
                        <Globe className="w-5 h-5"/>
                        Official Holidays
                    </button>
                </Card>
            </PageContent>
        </>

    );
}