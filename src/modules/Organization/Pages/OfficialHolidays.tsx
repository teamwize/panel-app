import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HolidayResponse } from "@/constants/types";
import { getHolidays } from "@/services/WorkiveApiClient";
import { toast } from "@/components/ui/use-toast";
import { UserContext } from "@/contexts/UserContext";
import { getErrorMessage } from "~/utils/errorHandler.ts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { countries } from "@/constants";

export default function OfficialHolidays() {
    const { user } = useContext(UserContext);
    const [holidays, setHolidays] = useState<HolidayResponse[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState<string>(user?.country || "AT");
    const navigate = useNavigate();
    const goBack = () => navigate('/settings');

    // Get holidays
    useEffect(() => {
        if (selectedCountry) {
            getHolidays(selectedYear, selectedCountry)
                .then((data: HolidayResponse[]) => {
                    console.log("Success:", data);
                    setHolidays(data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive"
                    });
                });
        }
    }, [selectedYear, selectedCountry]);

    const importHolidays = () => {
        navigate('/settings/official-holidays/import');
    };

    return (
        <>
            <div className="flex flex-wrap justify-between text-lg font-medium px-4 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={goBack}>
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-semibold md:text-2xl">Official Holidays</h1>
                </div>
                <Button onClick={importHolidays}>Import</Button>
            </div>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Select onValueChange={(value) => setSelectedYear(Number(value))} value={String(selectedYear)}>
                            <SelectTrigger className="w-fit">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={String(new Date().getFullYear() - 1)}>
                                        {String(new Date().getFullYear() - 1)}
                                    </SelectItem>
                                    <SelectItem value={String(new Date().getFullYear())}>
                                        {String(new Date().getFullYear())}
                                    </SelectItem>
                                    <SelectItem value={String(new Date().getFullYear() + 1)}>
                                        {String(new Date().getFullYear() + 1)}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => setSelectedCountry(value)} value={selectedCountry}>
                            <SelectTrigger className="w-fit">
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {countries.map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead>Holiday Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holidays.map((holiday) => (
                                <TableRow key={holiday.date}>
                                    <TableCell className="font-medium">{holiday.date}</TableCell>
                                    <TableCell>{holiday.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {holidays.length === 0 && (
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                        No holidays found for the selected year and country.
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </Card>
            </main>
        </>
    );
}