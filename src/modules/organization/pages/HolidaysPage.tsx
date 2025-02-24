import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import {HolidayResponse} from "@/core/types/holiday.ts";
import {country} from "@/core/types/country.ts";
import {getHolidays, getHolidaysOverview} from "@/core/services/holidayService.ts";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {CloudDownload} from "lucide-react";

export default function OfficialHolidays() {
    const navigate = useNavigate();
    const [holidays, setHolidays] = useState<HolidayResponse[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [yearOptions, setYearOptions] = useState<number[]>([]);
    const [yearToCountries, setYearToCountries] = useState<Record<number, string[]>>({});

    // Fetch holiday overview to populate year and country filters
    useEffect(() => {
        const fetchHolidaysOverview = async () => {
            try {
                const overview = await getHolidaysOverview();

                // Create mapping of available years to countries
                const yearMap: Record<number, string[]> = {};
                overview.forEach(({year, countryCode}) => {
                    if (!yearMap[year]) yearMap[year] = [];
                    yearMap[year].push(countryCode);
                });

                const sortedYears = Object.keys(yearMap).map(Number).sort((a, b) => b - a);

                setYearToCountries(yearMap);
                setYearOptions(sortedYears);

                // Set default values
                if (sortedYears.length > 0) {
                    const defaultYear = sortedYears[0];
                    setSelectedYear(defaultYear);
                    setSelectedCountry(yearMap[defaultYear]?.[0] || null);
                }
            } catch (error) {
                toast({title: "Error", description: getErrorMessage(error as Error), variant: "destructive"});
            }
        };

        fetchHolidaysOverview();
    }, []);

    // Fetch holidays when year or country changes
    useEffect(() => {
        if (!selectedYear || !selectedCountry) return;

        const fetchHolidays = async () => {
            try {
                setHolidays([]);
                const fetchedHolidays = await getHolidays(selectedYear, selectedCountry);
                setHolidays(fetchedHolidays);
            } catch (error) {
                toast({title: "Error", description: getErrorMessage(error as Error), variant: "destructive"});
            }
        };

        fetchHolidays();
    }, [selectedYear, selectedCountry]);

    const navigateToImportHolidays = () => navigate("/settings/official-holidays/import");

    return (
        <>
            <PageHeader backButton="/settings" title="Official Holidays">
                <Button className="px-2 h-9" onClick={navigateToImportHolidays}>
                    <CloudDownload className="h-4 w-4 mr-1"/>
                    Import
                </Button>
            </PageHeader>

            <PageContent>
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Select Year</h3>
                    <div className="flex flex-wrap gap-2">
                        {yearOptions.map((year) => (
                            <Button
                                key={year}
                                variant={selectedYear === year ? "secondary" : "outline"}
                                onClick={() => {
                                    setSelectedYear(year);
                                    setSelectedCountry(yearToCountries[year]?.[0] || null);
                                }}
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
                        {selectedYear && yearToCountries[selectedYear]?.length > 0 ? (
                            yearToCountries[selectedYear].map((code) => {
                                const countryData = country.find((c) => c.code === code);
                                return (
                                    <Button
                                        key={code}
                                        variant={selectedCountry === code ? "secondary" : "outline"}
                                        onClick={() => setSelectedCountry(code)}
                                        className="h-10 px-3"
                                    >
                                        {countryData?.name || code}
                                    </Button>
                                );
                            })
                        ) : (
                            <p className="text-gray-500">No countries available for {selectedYear}.</p>
                        )}
                    </div>
                </div>

                <Card>
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
            </PageContent>
        </>
    );
}