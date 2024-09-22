import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {PageTitle} from '../../../core/components';
import {ThemeContext} from '~/contexts/ThemeContext.tsx';
import { Switch } from "@/components/ui/switch"
import {Card} from "@/components/ui/card";
import {Lock, Globe, Moon} from 'lucide-react';

export default function Settings() {
    // const {isDarkMode, toggleDarkMode} = useContext(ThemeContext);
    const navigate = useNavigate();
    const navigateTo = (path: string) => () => navigate(path);

    return (
        <>
            <PageTitle title="Settings"/>

            <main className="flex flex-1 flex-col gap-4 p-4">

                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    <button
                        onClick={navigateTo('/settings/change-password')}
                        className="flex items-center text-md font-semibold gap-2"
                    >
                        <Lock className="w-5 h-5"/>
                        Change Password
                    </button>

                    <button
                        onClick={navigateTo('/settings/official-holidays')}
                        className="flex items-center text-md font-semibold gap-2"
                    >
                        <Globe className="w-5 h-5"/>
                        Official Holidays
                    </button>

                    {/*<div className="flex justify-between">*/}
                    {/*    <div className="flex items-center text-md font-semibold gap-2">*/}
                    {/*        <Moon className="w-5 h-5"/>*/}
                    {/*        Dark mode*/}
                    {/*    </div>*/}
                    {/*    <Switch*/}
                    {/*        checked={isDarkMode}*/}
                    {/*        onCheckedChange={toggleDarkMode}*/}
                    {/*    >*/}
                    {/*    </Switch>*/}
                    {/*</div>*/}
                </Card>
            </main>
        </>
    );
}