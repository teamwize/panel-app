import React from 'react';
import {useNavigate} from 'react-router-dom';
import {PageTitle} from '../../../core/components';
import {Card} from "@/components/ui/card";
import {Building, ChartPie, User, Users, Clock} from "lucide-react";

export default function Organization() {
    const navigate = useNavigate();

    const navigateTo = (path: string) => () => navigate(path);

    return (
        <>
            <PageTitle title="Organization"/>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <button
                        onClick={navigateTo('/organization/information')}
                        className="flex items-center text-md font-semibold gap-2"
                    >
                        <Building className="w-5 h-5"/>
                        Information
                        {/*{employeesList?.contents.length === 0 && (*/}
                        {/*    <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>*/}
                        {/*        REVIEW*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </button>

                    <button
                        onClick={navigateTo('/organization/balance')}
                        className="flex items-center text-md font-semibold gap-2"
                    >
                        <ChartPie className="w-5 h-5"/>
                        Set Balance
                        {/* {balance.length === 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>} */}
                    </button>

                    <button
                        onClick={navigateTo('/organization/employee')}
                        className="flex items-center text-md font-semibold gap-2"
                    >
                        <User className="w-5 h-5"/>
                        Employees
                        {/*{employeesList?.contents.length === 0 && (*/}
                        {/*    <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>*/}
                        {/*        REVIEW*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </button>

                    <button
                        onClick={navigateTo('/organization/team')}
                        className="flex items-center text-md font-semibold gap-2"
                    >
                        <Users className="w-5 h-5"/>
                        Teams
                        {/*{employeesList?.contents.length === 0 && (*/}
                        {/*    <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>*/}
                        {/*        REVIEW*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </button>

                    <button
                        onClick={navigateTo('/organization/dayoff/queue')}
                        className="flex items-center text-md font-semibold gap-2"
                    >
                        <Clock className="w-5 h-5"/>
                        Requests Queue
                    </button>
                </Card>
            </main>
        </>
    );
}