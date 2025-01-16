import {UserResponse} from "@/constants/types/userTypes.ts";
import React, {useContext} from "react";
import {UserContext} from "@/contexts/UserContext.tsx";
import {TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";

type EmployeeTableProps = {
    employeesList: UserResponse[];
    setSelectedEmployee: (employee: UserResponse | null) => void;
    setCurrentEmployee: (employee: UserResponse) => void;
    setIsUpdateDialogOpen: (open: boolean) => void;
};

export function EmployeeTable({employeesList, setSelectedEmployee, setCurrentEmployee, setIsUpdateDialogOpen,}: EmployeeTableProps) {
    const { accessToken } = useContext(UserContext);

    return (
        <TableBody>
            {employeesList.map((employee) => (
                <TableRow key={employee.id} className="items-center">
                    <TableCell>
                        <img
                            className="inline-block h-10 w-10 rounded-full"
                            src={
                                employee?.avatar
                                    ? `${employee.avatar?.url}?token=${accessToken}`
                                    : "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                            }
                            alt={`${employee.firstName} ${employee.lastName}`}
                        />
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
                                    setCurrentEmployee(employee);
                                    setIsUpdateDialogOpen(true);
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