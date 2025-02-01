import {ChevronLeft} from "lucide-react";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {country} from "@/core/types/country.ts";
import {UserContext} from "@/contexts/UserContext";
import {createHolidays, fetchHolidays} from "@/core/services/holidayService";
import {FetchedPublicHoliday} from "@/core/types/holiday.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

export default function HolidaysImportPage() {
    const { user } = useContext(UserContext);
    const [holidays, setHolidays] = useState<FetchedPublicHoliday[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState<string>(user?.country || "AT");
    const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const goBack = () => navigate('/settings/official-holidays');

    const fetchHolidaysList = () => {
        fetchHolidays(selectedYear, selectedCountry)
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

    const toggleSelectAll = () => {
        setSelectAll((prev) => !prev);
        setSelectedHolidays(selectAll ? [] : holidays.map((holiday) => holiday.date));
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
                            <SelectField
                                label="Year"
                                value={String(selectedYear)}
                                options={[
                                    { label: String(new Date().getFullYear() - 1), value: String(new Date().getFullYear() - 1) },
                                    { label: String(new Date().getFullYear()), value: String(new Date().getFullYear()) },
                                    { label: String(new Date().getFullYear() + 1), value: String(new Date().getFullYear() + 1) },
                                ]}
                                onChange={(value) => setSelectedYear(Number(value))}
                            />
                            <SelectField
                                label="Country"
                                value={selectedCountry}
                                options={country.map((country) => ({label: country.name, value: country.code,}))}
                                onChange={setSelectedCountry}
                            />
                        </div>

                        <Button className="w-fit" onClick={fetchHolidaysList}>Fetch</Button>
                    </div>

                    {holidays.length > 0 && (
                        <>
                            <HolidayTable
                                holidays={holidays}
                                selectedHolidays={selectedHolidays}
                                toggleHolidaySelection={toggleHolidaySelection}
                                selectAll={selectAll}
                                toggleSelectAll={toggleSelectAll}
                            />

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


type SelectFieldProps = {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
};

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
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

type HolidayTableProps = {
    holidays: FetchedPublicHoliday[];
    selectedHolidays: string[];
    toggleHolidaySelection: (date: string) => void;
    selectAll: boolean;
    toggleSelectAll: () => void;
};

export function HolidayTable({holidays, selectedHolidays, toggleHolidaySelection, selectAll, toggleSelectAll,}: HolidayTableProps) {
    return (
        <Table className="mt-4">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-8">
                        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll}/>
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {holidays.map((holiday) => (
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
    );
}