import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {deleteUser, getUsers} from "@/services/userService";
import {deleteUser, getUsers} from "@/core/services/userService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Card} from "@/components/ui/card";
import {UserResponse} from "@/constants/types/userTypes";
import {PagedResponse} from "@/constants/types/commonTypes";
import {UserResponse} from "@/core/types/user.ts";
import {PagedResponse} from "@/core/types/common.ts";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {EmployeeTable} from "@/modules/Users/components/EmployeeTable.tsx";
import DeleteEmployeeDialog from "@/modules/Users/components/DeleteEmployeeDialog.tsx";
import FilterEmployeesForm from "@/modules/Users/components/FilterEmployeesForm.tsx";
import PageContent from "@/core/components/PageContent.tsx";
import {PageHeader} from "@/core/components";
import {UserList} from "@/modules/user/components/UserList.tsx";
import UserDeleteDialog from "@/modules/user/components/UserDeleteDialog.tsx";
import UserFilterForm from "@/modules/user/components/UserFilterForm.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PaginationComponent from "@/components/Pagination.tsx";

export default function UserPage() {
    const [employeesList, setEmployeesList] = useState<PagedResponse<UserResponse> | null>(null);
    const [filteredEmployees, setFilteredEmployees] = useState<UserResponse[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<UserResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers(0, 30);
                setEmployeesList(data);
                setFilteredEmployees(data.contents);
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error),
                    variant: "destructive",
                });
            }
        };

        fetchUsers();
    }, []);

    const handleUsersFilter = (query: string, teamId: string) => {
        const filtered = employeesList?.contents.filter((employee) => {
            const matchesQuery =
                query === "" || employee.email.includes(query) || employee.firstName.includes(query) || employee.lastName?.includes(query);
            const matchesTeam = teamId === "" || employee.team.id.toString() === teamId;
            return matchesQuery && matchesTeam;
        });

        setFilteredEmployees(filtered || []);
    };

    const handleUserDelete = async (id: number) => {
        try {
            setIsProcessing(true);
            await deleteUser(String(id));
            setEmployeesList((prevState) => ({
                ...prevState,
                contents: prevState?.contents.filter((employee) => employee.id !== id),
            }));
            toast({
                title: "Success",
                description: "Employee removed successfully!",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedEmployeeId(null);
        }
    };

    const handleUserUpdateClick = (employee: UserResponse) => {
        setCurrentEmployee(employee);
        navigate(`/users/${employee.id}/update`, {state: {from: `/users/`}});
    }

    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );


    const handleUserViewClick = (id: number) => {
        navigate(`/users/${id}/`, {state: {from: "/users"}});
    };

    return (
        <>
            <PageHeader title={`Users (${employeesList?.contents?.length ?? 0})`}>
                <Button className="px-2 h-9" onClick={() => navigate("/users/create")}>Create</Button>
            </PageHeader>

            <FilterEmployeesForm onFilter={handleUsersFilter}/>

            <PageContent>
                <UserFilterForm onFilter={handleFilter}/>
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {filteredEmployees.length > 0 ? (
                            <UserList
                                employeesList={paginatedEmployees || []}
                                setSelectedEmployee={setSelectedEmployee}
                                onUserUpdate={handleUserUpdateClick}
                                onUserView={handleUserViewClick}
                            />
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4} className="p-2 text-center text-sm">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>

                    {selectedEmployee && (
                        <UserDeleteDialog
                            employee={selectedEmployee}
                            handleDeleteEmployee={handleUserDelete}
                            setSelectedEmployeeId={() => setSelectedEmployee(null)}
                            isProcessing={isProcessing}
                        />
                    )}

                    {filteredEmployees.length > recordsPerPage && (
                        <PaginationComponent
                            pageSize={recordsPerPage}
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalContents={filteredEmployees.length}
                        />
                    )}
                </Card>
            </PageContent>
        </>
    );
}