import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ChevronLeft} from "lucide-react";
import {Card} from "@/components/ui/card";
import {HolidayResponse} from "@/core/types/holiday.ts";
import {getHolidays} from "@/core/services/holidayService";
import {toast} from "@/components/ui/use-toast";
import {UserContext} from "@/contexts/UserContext";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {country} from "@/core/types/country.ts";

export default function HolidaysPage() {
    const { user } = useContext(UserContext);
    const [holidays, setHolidays] = useState<HolidayResponse[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState<string>(user?.country || "AT");
    const navigate = useNavigate();
    const goBack = () => navigate('/settings');

    useEffect(() => {
        if (selectedCountry) {
            getHolidays(selectedYear, selectedCountry)
                .then((data: HolidayResponse[]) => setHolidays(data))
                .catch((error) => {
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
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
                        <ChevronLeft className="h-6 w-6"/>
                    </button>
                    <h1 className="text-lg font-semibold md:text-2xl">Official Holidays</h1>
                </div>
                <Button onClick={importHolidays}>Import</Button>
            </div>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <SelectField
                            label="Year"
                            value={String(selectedYear)}
                            options={[
                                {
                                    label: String(new Date().getFullYear() - 1),
                                    value: String(new Date().getFullYear() - 1)
                                },
                                {label: String(new Date().getFullYear()), value: String(new Date().getFullYear())},
                                {
                                    label: String(new Date().getFullYear() + 1),
                                    value: String(new Date().getFullYear() + 1)
                                },
                            ]}
                            onChange={(value) => setSelectedYear(Number(value))}
                        />
                        <SelectField
                            label="Country"
                            value={selectedCountry}
                            options={country.map((country) => ({label: country.name, value: country.code,}))}
                            onChange={(value) => setSelectedCountry(value)}
                        />
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

type SelectFieldProps = {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}