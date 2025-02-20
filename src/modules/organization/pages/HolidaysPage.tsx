import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from "@/components/ui/card";
import {toast} from "@/components/ui/use-toast";
import {UserContext} from "@/contexts/UserContext";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {HolidayResponse} from "@/core/types/holiday.ts";
import {country} from "@/core/types/country.ts";
import {getHolidays, getHolidaysOverview} from "@/core/services/holidayService.ts";
import PageHeader from "@/components/layout/PageHeader.tsx";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {CloudDownload} from "lucide-react";
import {PageSection} from "@/components/layout/PageSection.tsx";

export default function OfficialHolidays() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // Set initial country based on user context
    const initialCountry = user?.country && country.find(c => c.code === user.country)?.code || "";

    const [holidays, setHolidays] = useState<HolidayResponse[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
    const [yearOptions, setYearOptions] = useState<number[]>([]);
    const [countryOptions, setCountryOptions] = useState<{ label: string; value: string }[]>([]);

    // Fetch holiday overview to populate year and country buttons
    useEffect(() => {
        const fetchHolidaysOverview = async () => {
            try {
                const overview = await getHolidaysOverview();

                // Populate Year Options
                const years = [...new Set(overview.map(o => o.year))].sort((a, b) => b - a);

                // Populate Country Options using the imported `country` list
                const countries = [...new Set(overview.map(o => o.countryCode))]
                    .map(code => {
                        const countryData = country.find(c => c.code === code);
                        return countryData ? {label: countryData.name, value: code} : null;
                    })
                    .filter(Boolean) as { label: string; value: string }[];

                setYearOptions(years);
                setCountryOptions(countries);
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error),
                    variant: "destructive",
                });
            }
        };

        fetchHolidaysOverview();
    }, []);

    // Fetch holidays whenever selectedYear or selectedCountry changes
    useEffect(() => {
        const fetchHolidays = async () => {
            if (!selectedYear || !selectedCountry) return; // Ensure valid selections

            try {
                setHolidays([]);
                const fetchedHolidays = await getHolidays(selectedYear, selectedCountry);
                setHolidays(fetchedHolidays);
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error),
                    variant: "destructive",
                });
            }
        };

        fetchHolidays();
    }, [selectedYear, selectedCountry]);

    const navigateToImportHolidays = () => {
        navigate('/settings/official-holidays/import');
    };

    return (
        <>
            <PageHeader backButton='/settings' title='Official Holidays'>
                <Button className="px-2 h-9" onClick={navigateToImportHolidays}>
                    <CloudDownload className="h-4 w-4 mr-1"/>
                    Import Holidays
                </Button>
            </PageHeader>

            <main className="flex flex-1 flex-col p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Select Year</h3>
                    <div className="flex flex-wrap gap-2">
                        {yearOptions.map((year) => (
                            <Button
                                key={year}
                                type="button"
                                variant={selectedYear === year ? "secondary" : "outline"}
                                onClick={() => setSelectedYear(year)}
                                className="h-10 px-3"
                            >
                                {year}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Select Country</h3>
                    <div className="flex flex-wrap gap-2">
                        {countryOptions.map(({label, value}) => (
                            <Button
                                key={value}
                                type="button"
                                variant={selectedCountry === value ? "secondary" : "outline"}
                                onClick={() => setSelectedCountry(value)}
                                className="h-10 px-3"
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                    </div>

                <PageSection
                    title="Holidays"
                    description="Here are your Selected Holidays"
                >
                </PageSection>
                <Card className='px-3'>
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
                                        No holidays found. Click the "Import" button above to fetch official holidays.
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