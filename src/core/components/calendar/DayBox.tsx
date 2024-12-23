import React, { useContext } from "react";
import dayjs from "dayjs";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { LeaveResponse } from "@/constants/types/leaveTypes.ts";
import { UserContext } from "@/contexts/UserContext.tsx";
import { LeaveStatus } from "@/constants/types/enums.ts";

interface DayBoxProps {
    date: Date;
    isHoliday: boolean;
    isWeekend: boolean;
    leaves: LeaveResponse[];
    isSelected: boolean;
    onClick: () => void;
}

const LEAVE_TYPE_EMOJIS: Record<string, string> = {
    'Vacation': "🌴",
    'PTO': "💼",
    "Sick-Leave": "❤️",
};

const STATUS_BACKGROUND_COLORS: Partial<Record<LeaveStatus, string>> = {
    [LeaveStatus.ACCEPTED]: "bg-green-100 border-green-200 border",
    [LeaveStatus.PENDING]: "bg-blue-100 border-blue-200 border",
};

const DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png";

export const DayBox: React.FC<DayBoxProps> = ({ date, isHoliday, isWeekend, leaves, isSelected, onClick }) => {
    const { accessToken } = useContext(UserContext);
    const isToday = dayjs().isSame(date, "day");

    // Filter Leaves to only show ACCEPTED or PENDING ones
    const filteredLeaves = leaves.filter(
        (leave) => leave.status === LeaveStatus.ACCEPTED || leave.status === LeaveStatus.PENDING
    );

    const displayedLeaves = filteredLeaves.slice(0, 3);
    const remainingLeavesCount = filteredLeaves.length - displayedLeaves.length;

    const getAvatarUrl = (url?: string) => (url ? `${url}?token=${accessToken}` : DEFAULT_AVATAR);

    // Render leave entry
    const renderLeave = (leave: LeaveResponse) => (
        <div key={leave.id} className={`flex items-center justify-between gap-1 mt-2 p-[2px] rounded-lg ${STATUS_BACKGROUND_COLORS[leave.status]}`}>
            <div className='flex items-center gap-1'>
                <img className="h-6 w-6 rounded-full" src={getAvatarUrl(leave.user?.avatar?.url)} alt="User avatar"/>
                <span className="text-sm">{leave.user.firstName}</span>
            </div>
            <span className="text-sm">{LEAVE_TYPE_EMOJIS[leave.type?.name]}</span>
        </div>
    );

    return (
        <div onClick={onClick} className={`p-2 min-h-[150px] min-w-[100px] border-[0.5px] cursor-pointer
          ${isSelected ? "bg-gray-100" : ""} ${isHoliday || isWeekend ? "bg-red-50" : ""}`}>
            <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
              ${isToday ? "bg-primary text-white" : isSelected ? "bg-gray-700 text-white" : ""}`}
            >
              {dayjs(date).format("D")}
            </span>

            {displayedLeaves.map(renderLeave)}

            {remainingLeavesCount > 0 && (
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="mt-2 text-sm text-gray-500">{remainingLeavesCount} more...</button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit bg-white shadow-md rounded-md p-4 border">
                        <h4 className="text-sm font-semibold border-b pb-4">Leave Requests on {dayjs(date).format("MMM D, YYYY")}</h4>
                        <div className="mt-4 space-y-2">{filteredLeaves.slice(3).map(renderLeave)}</div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};