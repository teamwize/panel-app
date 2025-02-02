import {UserResponse} from "@/constants/types/userTypes.ts";
import React from "react";
import {TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import {Avatar} from "@/core/components";

type EmployeeTableProps = {
    employeesList: UserResponse[];
    setSelectedEmployee: (employee: UserResponse | null) => void;
    handleEditEmployee: (employee: UserResponse) => void;
    navigateToEmployeeDetails: (id: number) => void;
};

export function EmployeeTable({
                                  employeesList,
                                  setSelectedEmployee,
                                  handleEditEmployee,
                                  navigateToEmployeeDetails
                              }: EmployeeTableProps) {
    return (
        <TableBody>
            {employeesList.map((employee) => (
                <TableRow key={employee.id} className="items-center">
                    <TableCell>
                        <Avatar avatar={employee?.avatar} avatarSize={32}/>
                        <span className="text-sm font-medium ml-2">{employee.firstName} {employee.lastName}</span>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.team.name}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-4 justify-end">
                            <Button
                                className="px-1"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    handleEditEmployee(employee);
                                }}
                            >
                                <Pencil className="h-4" />
                            </Button>

                            <Button
                                className="px-1"
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedEmployee(employee)}
                            >
                                <Trash className="h-4 text-[#ef4444]" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}