import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs, {Dayjs} from 'dayjs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {DayOffLeaveTypeJson} from '~/constants/index.ts';
import {DayOffRequestStatus, DayOffResponse} from '~/constants/types';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CircleAlert} from 'lucide-react';

type DayOffModalProps = {
    selectedRequest: DayOffResponse;
    teamRequests: DayOffResponse[];
    handleModal: () => void;
    handleRequest: (status: DayOffRequestStatus, id: number) => void;
    isProcessing: boolean;
    calculateDistance: (startAt: string, endAt: string) => number;
};

export default function DayOffModal({
                                        selectedRequest,
                                        teamRequests,
                                        handleModal,
                                        calculateDistance,
                                        handleRequest,
                                        isProcessing
                                    }: DayOffModalProps) {
    const [dayOverlap, setDayOverlap] = useState<DayOffResponse[]>([]);
    const navigate = useNavigate();

    const viewBalance = (requestName: string) => {
        navigate('/balance?query=' + requestName);
    };

    useEffect(() => {
        const startDayoff: Dayjs = dayjs(selectedRequest.startAt);
        const endDayoff: Dayjs = dayjs(selectedRequest.endAt);
        const overlap: DayOffResponse[] = teamRequests.filter((r) => {
            if (r.id === selectedRequest.id) {
                return false;
            }
            const start = dayjs(r.startAt);
            const end = dayjs(r.endAt);

            return start.isBefore(endDayoff) && end.isAfter(startDayoff);
        });

        setDayOverlap(overlap);
    }, [selectedRequest.id, teamRequests]);

    const distance: number = calculateDistance(selectedRequest.startAt, selectedRequest.endAt);

    return (
        <Dialog open={true} onOpenChange={handleModal}>
            <DialogContent className="text-sm">
                <DialogHeader>
                    <DialogTitle className='mb-1.5'>Day Off Request</DialogTitle>
                    <DialogDescription className='py-1'>
                        <div className='flex items-center'>
                            <img className="inline-block h-10 w-10 rounded-full mr-2"
                                 src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                                 alt="User"/>
                            <div className="flex flex-col gap-1 font-semibold">
                                <span>{selectedRequest.user.firstName} {selectedRequest.user.lastName}</span>
                                <Button className='h-7 px-2 text-xs rounded-full'
                                        onClick={() => viewBalance(selectedRequest.user.team.name)}>View
                                    Balance</Button>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className='text-xs'>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Request Date</TableHead>
                                    {selectedRequest.reason && (
                                        <TableHead>Explanation</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {distance === 1
                                            ? dayjs(selectedRequest.startAt).format('D MMM YYYY')
                                            : `${dayjs(selectedRequest.startAt).format('D MMM YYYY')} - ${dayjs(selectedRequest.endAt).format('D MMM YYYY')}`}
                                        {" "}({distance} {distance === 1 ? "Day" : "Days"})
                                    </TableCell>
                                    <TableCell>
                                        {DayOffLeaveTypeJson[selectedRequest.type as keyof typeof DayOffLeaveTypeJson]}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(selectedRequest.createdAt).format('D MMM YYYY')}
                                    </TableCell>
                                    {selectedRequest.reason && (
                                        <TableCell>{selectedRequest.reason}</TableCell>
                                    )}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogDescription>
                </DialogHeader>

                {dayOverlap.length > 0 && (
                    <div className='rounded-lg mb-4'>
                        <p className='text-red-500 text-xs mb-1 flex items-center'>
                            <CircleAlert className='w-4 h-4 mr-1'/>
                            {dayOverlap.length} Other teammates also on leave
                        </p>
                        {dayOverlap.map(r => (
                            <RequestItem r={r} distance={distance} key={r.id}/>
                        ))}
                    </div>
                )}

                <DialogFooter className="flex justify-center">
                    <Button
                        onClick={() => handleRequest(DayOffRequestStatus.REJECTED, selectedRequest.id)}
                        variant="outline"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Waiting ..." : "Reject"}
                    </Button>
                    <Button
                        onClick={() => handleRequest(DayOffRequestStatus.ACCEPTED, selectedRequest.id)}
                        className="ml-4 bg-[#088636]"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Waiting ..." : "Accept"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type RequestItemProps = {
    r: DayOffResponse;
    distance: number;
};

function RequestItem({r, distance}: RequestItemProps) {
    return (
        <div className="mb-2">
            <h1>{r.user.firstName} {r.user.lastName}</h1>
            <p>
                {distance === 1 ? dayjs(r.startAt).format('D MMM YYYY') : `${dayjs(r.startAt).format('D MMM YYYY')} - ${dayjs(r.endAt).format('D MMM YYYY')}`}
            </p>
        </div>
    );
}