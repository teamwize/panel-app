import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getEmployee, deleteEmployee} from '~/services/WorkiveApiClient.ts';
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
import {PagedResponse, UserResponse} from '~/constants/types';
import {ChevronLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";

export default function Employees() {
    const [employeesList, setEmployeesList] = useState<PagedResponse<UserResponse> | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [remove, setRemove] = useState<boolean>(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    useEffect(() => {
        getEmployee(0, 30)
            .then((data: PagedResponse<UserResponse>) => {
                console.log('Success:', data);
                setEmployeesList(data);
            })
            .catch(error => {
                console.error('Error:', error);
                const errorMessage = getErrorMessage(error);
                setErrorMessage(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, []);

    const goBack = () => navigate('/organization');

    const viewDetails = (id: number) => {
        navigate('/organization/employee/' + id);
    };

    const closeRemove = () => setRemove(false);

    const handleRequest = (confirmed: boolean, id: number) => {
        setIsProcessing(true);
        if (confirmed && selectedEmployeeId !== null) {
            deleteEmployee(String(id))
                .then(data => {
                    setIsProcessing(false);
                    console.log('Success:', data);
                    setEmployeesList(prevState => ({
                        ...prevState,
                        contents: prevState.contents.filter((employee: UserResponse) => employee.id !== id),
                    }));
                    closeRemove();
                })
                .catch(error => {
                    setIsProcessing(false);
                    console.error('Error:', error);
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

    const viewAddEmployee = () => {
        navigate('/organization/employee/create');
    };

    return (
        <>
            <div className="flex flex-wrap justify-between text-lg font-medium px-4 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={goBack}>
                        <ChevronLeft className="h-6 w-6"/>
                    </button>
                    <h1 className="text-lg font-semibold md:text-2xl">
                        Employees ({employeesList ? employeesList.contents.length : 0})
                    </h1>
                </div>
                <Button onClick={viewAddEmployee}>Create</Button>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

             <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    {employeesList && employeesList.contents.length > 0 ? (
                        employeesList.contents
                            .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                            .map(e => (
                                <EmployeeItem
                                    e={e}
                                    key={e.id}
                                    viewDetails={viewDetails}
                                    setRemove={(id) => {
                                        setRemove(true);
                                        setSelectedEmployeeId(id);
                                    }}
                                    remove={remove}
                                    closeRemove={closeRemove}
                                    handleRequest={handleRequest}
                                    isProcessing={isProcessing}
                                />
                            ))
                    ) : (
                        <p className="p-2 text-center text-sm">No employees found.</p>
                    )}

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

type EmployeeItemProps = {
    e: UserResponse;
    setRemove: (id: number) => void;
    remove: boolean;
    closeRemove: () => void;
    handleRequest: (confirmed: boolean, id: number) => void;
    isProcessing: boolean;
    viewDetails: (id: number) => void;
}

function EmployeeItem({
                          e,
                          setRemove,
                          remove,
                          closeRemove,
                          handleRequest,
                          isProcessing,
                          viewDetails
                      }: EmployeeItemProps) {
    return (
        <div className='flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800'>
            <div className='flex items-center'>
                <img className="inline-block h-10 w-10 rounded-full mr-2"
                     src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                     alt={`${e.firstName} ${e.lastName}`}/>
                <div className='flex flex-col'>
                    <p className="text-sm mb-1">{e.firstName} {e.lastName}</p>
                    <Button className='h-7 px-2 text-xs rounded-full w-fit' onClick={() => viewDetails(e.id)}>Details</Button>
                </div>
            </div>

            <Button onClick={() => setRemove(e.id)}>Remove</Button>

            <Dialog open={remove} onOpenChange={closeRemove}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Remove Employee</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to remove the employee?</DialogDescription>
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
        </div>
    );
}