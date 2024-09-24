import { ChevronLeft } from "lucide-react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { countries } from "@/constants/countries";
import { UserContext } from "@/contexts/UserContext";
import { fetchHolidays, createHolidays } from "@/services/holidayService";
import { FetchedPublicHoliday } from "@/constants/types/holidayTypes";
import { toast } from "@/components/ui/use-toast";
import { getErrorMessage } from "~/utils/errorHandler.ts";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ImportHolidays() {
    const { user } = useContext(UserContext);
    const [holidays, setHolidays] = useState<FetchedPublicHoliday[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState<string>(user?.country || "AT");
    const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
    const navigate = useNavigate();
    const goBack = () => navigate('/settings/official-holidays');

    const fetchHolidaysList = () => {
        fetchHolidays(selectedYear)
            .then((data: FetchedPublicHoliday[]) => {
                setHolidays(data);
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                });
            });
    };

    const toggleHolidaySelection = (date: string) => {
        setSelectedHolidays(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    };

    const saveSelectedHolidays = () => {
        const payload = holidays
            .filter(holiday => selectedHolidays.includes(holiday.date))
            .map(holiday => ({
                description: holiday.name,
                date: holiday.date,
                country: selectedCountry,
            }));

        createHolidays(payload)
            .then(() => {
                navigate('/settings/official-holidays');
            })
            .catch((error: any) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <div className="flex flex-wrap text-lg font-medium px-4 pt-4 gap-2">
                <button onClick={goBack}>
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Import Holidays</h1>
            </div>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
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

                            <Select onValueChange={setSelectedCountry} value={selectedCountry}>
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

                        <Button className="w-fit" onClick={fetchHolidaysList}>Fetch</Button>
                    </div>

                    {holidays.length > 0 && (
                        <>
                            <Table className="mt-4">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8"></TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holidays.map((holiday, index) => (
                                        <TableRow key={holiday.date}>
                                            <TableCell className="w-8">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedHolidays.includes(holiday.date)}
                                                    onChange={() => toggleHolidaySelection(holiday.date)}
                                                />
                                            </TableCell>
                                            <TableCell>{holiday.date}</TableCell>
                                            <TableCell>{holiday.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-end mt-4">
                                <Button onClick={saveSelectedHolidays}>Save</Button>
                            </div>
                        </>
                    )}
                </Card>
            </main>
        </>
    );
}