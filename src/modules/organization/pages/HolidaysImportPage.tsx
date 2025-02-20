import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {CalendarDays, Check, CloudDownload, X} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import {createHolidays, fetchHolidays} from "@/core/services/holidayService.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {country} from "@/core/types/country.ts";
import {PageSection} from "@/components/layout/PageSection.tsx";

export default function HolidaysImportPage() {
    const [holidays, setHolidays] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedHolidays, setSelectedHolidays] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchHolidaysList = async () => {
        if (!selectedCountry) {
            toast({
                title: "Please select a country",
                description: "A country selection is required to fetch holidays.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const data = await fetchHolidays(selectedYear, selectedCountry);
            setHolidays(data);
            setSelectedHolidays([]);
            setSelectAll(false);
        } catch (error) {
            toast({
                title: "Failed to fetch holidays",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
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

    const saveSelectedHolidays = async () => {
        if (selectedHolidays.length === 0) {
            toast({
                title: "No holidays selected",
                description: "Please select at least one holiday to import.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const payload = holidays
                .filter(holiday => selectedHolidays.includes(holiday.date))
                .map(holiday => ({
                    description: holiday.name,
                    date: holiday.date,
                    country: selectedCountry,
                }));
            await createHolidays(payload);
            toast({
                title: "Success",
                description: "Holidays have been imported successfully.",
            });
            navigate('/settings/official-holidays');
        } catch (error) {
            toast({
                title: "Failed to import holidays",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <PageHeader backButton='/settings/official-holidays' title='Import Holidays'></PageHeader>

            <main className="max-w-7xl mx-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-primary"/>
                            Holiday Import
                        </CardTitle>
                        <CardDescription>Select a year and country to import official holidays</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <SelectField
                                    label="Year"
                                    value={String(selectedYear)}
                                    options={[
                                        {label: String(selectedYear - 1), value: String(selectedYear - 1)},
                                        {label: String(selectedYear), value: String(selectedYear)},
                                        {label: String(selectedYear + 1), value: String(selectedYear + 1)},
                                    ]}
                                    onChange={value => setSelectedYear(Number(value))}
                                />
                                <SelectField
                                    label="Country"
                                    value={selectedCountry}
                                    options={country.map(c => ({label: c.name, value: c.code}))}
                                    onChange={setSelectedCountry}
                                />
                            </div>
                            <Button
                                onClick={fetchHolidaysList}
                                disabled={isLoading || !selectedCountry}
                                className="w-full sm:w-auto"
                            >
                                <CloudDownload className="w-4 h-4 mr-2"/>
                                {isLoading ? 'Fetching...' : 'Fetch Holidays'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {holidays.length > 0 && (
                    <>
                        <PageSection
                            title="Available Holidays"
                            description={`${selectedHolidays.length} of ${holidays.length} holidays selected`}
                        />
                        <Card className='px-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectAll}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Holiday Name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holidays.map(holiday => (
                                        <TableRow key={holiday.date}>
                                            <TableCell className="w-12">
                                                <Checkbox
                                                    checked={selectedHolidays.includes(holiday.date)}
                                                    onCheckedChange={() => toggleHolidaySelection(holiday.date)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{holiday.date}</TableCell>
                                            <TableCell>{holiday.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/settings/official-holidays')}
                                disabled={isLoading}
                            >
                                <X className="w-4 h-4 mr-2"/>
                                Cancel
                            </Button>
                            <Button
                                onClick={saveSelectedHolidays}
                                disabled={isLoading || selectedHolidays.length === 0}
                            >
                                <Check className="w-4 h-4 mr-2"/>
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

type SelectFieldProps = {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
};

function SelectField({label, value, options, onChange}: SelectFieldProps) {
    return (
        <div className="w-full sm:w-48">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${label}`}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}