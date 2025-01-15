import React, {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {getUsers, deleteUser} from "@/services/userService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {Pagination} from '../../../core/components';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import {Card} from "@/components/ui/card";
import {UserResponse} from '@/constants/types/userTypes';
import {PagedResponse} from '@/constants/types/commonTypes';
import {Trash, UserPen} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {UserContext} from "@/contexts/UserContext";
import {usePageTitle} from "@/contexts/PageTitleContext.tsx";

export default function Employees() {
    const [employeesList, setEmployeesList] = useState<PagedResponse<UserResponse> | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;
    const { setTitle, setChildren } = usePageTitle();

    useEffect(() => {
        getUsers(0, 30)
            .then((data: PagedResponse<UserResponse>) => {
                setEmployeesList(data);
                setTitle(`Employees (${data.contents.length})`);
            })
            .catch(error => {
                const errorMessage = getErrorMessage(error);
                setErrorMessage(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, [setTitle]);

    useEffect(() => {
        setChildren(
            <Button className='px-2 h-9' onClick={() => navigate('/employee/create')}>Create</Button>
        );
    }, [setChildren, navigate]);

    const viewDetails = (id: number) => {
        navigate('/employee/' + id);
    };

    const closeRemove = () => setSelectedEmployeeId(null);

    const handleRequest = (confirmed: boolean, id: number) => {
        setIsProcessing(true);
        if (confirmed && selectedEmployeeId !== null) {
            deleteUser(String(id))
                .then(() => {
                    setIsProcessing(false);
                    setEmployeesList(prevState => ({
                        ...prevState,
                        contents: prevState?.contents.filter((employee: UserResponse) => employee.id !== id),
                    }));
                    closeRemove();
                })
                .catch(error => {
                    setIsProcessing(false);
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
                    });
                });
        } else {
            closeRemove();
        }
    };

    return (
        <>
            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {employeesList && employeesList.contents.length > 0 ? (
                            <EmployeeTable
                                employeesList={employeesList.contents.slice(
                                    (currentPage - 1) * recordsPerPage,
                                    currentPage * recordsPerPage
                                )}
                                setSelectedEmployeeId={setSelectedEmployeeId}
                                selectedEmployeeId={selectedEmployeeId}
                                closeRemove={closeRemove}
                                handleRequest={handleRequest}
                                isProcessing={isProcessing}
                                viewDetails={viewDetails}
                            />
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4} className="p-2 text-center text-sm">No employees
                                        found.</TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>

                    {employeesList && employeesList.contents.length > recordsPerPage && (
                        <Pagination
                            pageSize={recordsPerPage}
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalContents={employeesList.totalContents}
                        />
                    )}
                </Card>
            </main>
        </>
    );
}

export function EmployeeTable({
                                  employeesList,
                                  setSelectedEmployeeId,
                                  selectedEmployeeId,
                                  closeRemove,
                                  handleRequest,
                                  isProcessing,
                                  viewDetails
                              }: {
    employeesList: UserResponse[];
    setSelectedEmployeeId: (id: number) => void;
    selectedEmployeeId: number | null;
    closeRemove: () => void;
    handleRequest: (confirmed: boolean, id: number) => void;
    isProcessing: boolean;
    viewDetails: (id: number) => void;
}) {
    return (
        <TableBody>
            {employeesList.map((employee) => (
                <EmployeeItem
                    key={employee.id}
                    e={employee}
                    setSelectedEmployeeId={setSelectedEmployeeId}
                    selectedEmployeeId={selectedEmployeeId}
                    closeRemove={closeRemove}
                    handleRequest={handleRequest}
                    isProcessing={isProcessing}
                    viewDetails={viewDetails}
                />
            ))}
        </TableBody>
    );
}

type EmployeeItemProps = {
    e: UserResponse;
    setSelectedEmployeeId: (id: number) => void;
    selectedEmployeeId: number | null;
    closeRemove: () => void;
    handleRequest: (confirmed: boolean, id: number) => void;
    isProcessing: boolean;
    viewDetails: (id: number) => void;
};

function EmployeeItem({
                          e,
                          setSelectedEmployeeId,
                          selectedEmployeeId,
                          closeRemove,
                          handleRequest,
                          isProcessing,
                          viewDetails
                      }: EmployeeItemProps) {
    const {accessToken} = useContext(UserContext)

    return (
        <>
            <TableRow className='items-center'>
                <TableCell>
                    <img
                        className="inline-block h-10 w-10 rounded-full"
                        src={
                            e?.avatar
                                ? `${e.avatar?.url}?token=${accessToken}`
                                : "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                        }
                        alt={`${e.firstName} ${e.lastName}`}
                    />
                    <span className="text-sm font-medium ml-2">
                        {e.firstName} {e.lastName}
                    </span>
                </TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>{e.team.name}</TableCell>
                <TableCell className="flex gap-4 items-center">
                    <Button
                        className={"px-1"}
                        variant="outline"
                        size="sm"
                        onClick={() => viewDetails(e.id)}>
                        <UserPen className="h-4 text-[#3b87f7]"/>
                    </Button>

                    <Button className={"px-1"}
                            variant="outline"
                            size="sm" onClick={() => setSelectedEmployeeId(e.id)}>
                        <Trash className="h-4 text-[#ef4444]"/>
                    </Button>
                </TableCell>
            </TableRow>

            <Dialog open={selectedEmployeeId === e.id} onOpenChange={closeRemove}>
                <DialogContent className="sm:max-w-md bg-opacity-70 backdrop-blur-lg">
                    <DialogHeader>
                        <DialogTitle>Remove Employee</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to remove this employee?</DialogDescription>
                    <DialogFooter className="flex justify-center">
                        <Button variant="outline" onClick={closeRemove}>
                            No
                        </Button>
                        <Button variant="destructive" className="ml-4" onClick={() => handleRequest(true, e.id)}>
                            {isProcessing ? "Waiting ..." : "Yes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}