import React, {useContext, useEffect, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {getOrganization, updateOrganization} from "@/core/services/organizationService";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {country} from "@/core/types/country.ts";
import {OrganizationResponse, OrganizationUpdateRequest} from "@/core/types/organization.ts";
import {Week} from "@/core/types/enum.ts";
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UserContext} from "@/contexts/UserContext";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";

const FormSchema = z.object({
    name: z.string().min(2, {message: "organization name must be over 2 characters"}).max(20, {message: "organization name must be under 20 characters"}),
    country: z.string().min(1, {message: "Country is required"}),
    weekFirstDay: z.nativeEnum(Week, {errorMap: () => ({message: "Week starting day is required"})}),
    workingDays: z.array(z.nativeEnum(Week)).min(1, {message: "At least one working day is required"}),
});

function getWeekDayName(day: Week): string {
    return day.charAt(0) + day.slice(1).toLowerCase();
}

export default function OrganizationPage() {
    const [organizationInfo, setOrganizationInfo] = useState<OrganizationResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const {user} = useContext(UserContext);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            country: "",
            weekFirstDay: Week.MONDAY,
            workingDays: [],
        },
    });

    // Fetch organization info and set default values
    useEffect(() => {
        getOrganization()
            .then((response: OrganizationResponse) => {
                setOrganizationInfo(response);
                const countryName = country.find((country) => country.code === response.country)?.name || "";
                form.reset({
                    name: response.name,
                    country: countryName,
                    weekFirstDay: response.weekFirstDay,
                    workingDays: response.workingDays,
                });
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, []);

    // Handle form submission
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const countryCode = country.find((country) => country.name === data.country)?.code || "";
        const payload: OrganizationUpdateRequest = {
            name: data.name,
            timezone: user.timezone,
            country: countryCode,
            metadata: {},
            workingDays: data.workingDays,
            weekFirstDay: data.weekFirstDay,
        };

        setIsProcessing(true);

        updateOrganization(payload)
            .then((response: OrganizationResponse) => {
                setIsProcessing(false);
                setOrganizationInfo(response);
                toast({
                    title: "Success",
                    description: "organization updated successfully!",
                    variant: "default",
                });
            })
            .catch((error) => {
                setIsProcessing(false);
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
            <PageHeader title='Organization'></PageHeader>
            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <NameField form={form}/>

                            <SelectField
                                label="Country"
                                name="country"
                                options={country.map((country) => ({label: country.name, value: country.name}))}
                                form={form}
                            />

                            <SelectField
                                label="Week Starting Day"
                                name="weekFirstDay"
                                options={Object.values(Week).map((day) => ({label: getWeekDayName(day), value: day}))}
                                form={form}
                            />

                            <CheckboxGroupField form={form}/>

                            <Button type="submit" className="w-fit"
                                    disabled={isProcessing}>{isProcessing ? "Processing..." : "Save"}</Button>
                        </form>
                    </Form>
                </Card>
            </PageContent>
        </>
    );
}


type FieldProps = {
    form: UseFormReturn
}

function NameField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Organization Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

type SelectFieldProps = {
    name: string;
    label: string;
    options: { label: string; value: string }[];
    form: UseFormReturn<any>;
};

function SelectField({name, label, options, form}: SelectFieldProps) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Select onValueChange={(value) => form.setValue(name, value)} value={form.watch(name)}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${label}`}/>
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage/>
        </FormItem>
    );
}

function CheckboxGroupField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="workingDays"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Working Days</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.values(Week).map(day => (
                            <div key={day} className="flex items-center">
                                <Checkbox
                                    value={day}
                                    checked={field.value.includes(day)}
                                    onCheckedChange={(isChecked) => {
                                        if (isChecked) {
                                            field.onChange([...field.value, day]);
                                        } else {
                                            field.onChange(field.value.filter((d: Week) => d !== day));
                                        }
                                    }}
                                />
                                <label htmlFor={day} className="ml-2">{getWeekDayName(day)}</label>
                            </div>
                        ))}
                    </div>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}