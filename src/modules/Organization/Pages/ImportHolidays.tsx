import {ChevronLeft} from "lucide-react";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {countries} from "@/constants";
import {UserContext} from "@/contexts/UserContext";
import {fetchHolidays, createHolidays} from "@/services/WorkiveApiClient";
import {FetchedPublicHoliday} from "@/constants/types";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";

export default function ImportHolidays() {
    const {user} = useContext(UserContext);
    const [holidays, setHolidays] = useState<FetchedPublicHoliday[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedCountry, setSelectedCountry] = useState<string>(user?.countryCode || "AT");
    const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
    const navigate = useNavigate();
    const goBack = () => navigate('/settings/official-holiday');

    const fetchHolidaysList = () => {
        fetchHolidays(selectedYear)
            .then((data: FetchedPublicHoliday[]) => {
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
                countryCode: selectedCountry,
            }));

        createHolidays(payload)
            .then(() => {
                navigate('/settings/official-holiday');
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
                    <ChevronLeft className="h-6 w-6"/>
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Import Holidays</h1>
            </div>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <div className='flex justify-between items-center'>
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">{selectedYear}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Select Year</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuRadioGroup
                                        value={String(selectedYear)}
                                        onValueChange={(value) => setSelectedYear(Number(value))}
                                    >
                                        <DropdownMenuRadioItem value={String(new Date().getFullYear() - 1)}>
                                            {String(new Date().getFullYear() - 1)}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value={String(new Date().getFullYear())}>
                                            {String(new Date().getFullYear())}
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value={String(new Date().getFullYear() + 1)}>
                                            {String(new Date().getFullYear() + 1)}
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {countries.find((country) => country.code === selectedCountry)?.name || "Select Country"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                                    <DropdownMenuLabel>Select Country</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuRadioGroup
                                        value={selectedCountry}
                                        onValueChange={setSelectedCountry}
                                    >
                                        {countries.map((country) => (
                                            <DropdownMenuRadioItem key={country.code} value={country.code}>
                                                {country.name}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Button className='w-fit' onClick={fetchHolidaysList}>Fetch</Button>
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