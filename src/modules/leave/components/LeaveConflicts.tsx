import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import LeaveStatusBadge from "@/modules/leave/components/LeaveStatusBadge.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {LeaveResponse} from "@/core/types/leave.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {formatDurationRange} from "@/core/utils/date.ts";
import LeaveDuration from "@/modules/leave/components/LeaveDuration.tsx";
import {AlertTriangle} from "lucide-react";

type LeaveConflictProps = {
    conflicts: LeaveResponse[];
}

export default function LeaveConflicts({conflicts}: LeaveConflictProps) {
    return (
        <Card className="border-red-100 bg-red-50">
            <h3 className="flex items-center gap-2 text-red-600 font-semibold text-lg p-1">
                <AlertTriangle className='w-5 h-5'/>
                <span>
            {conflicts.length === 1
                ? '1 Conflicting Leave'
                : `${conflicts.length} Conflicting Leaves`}
          </span>
            </h3>
            <CardContent className="space-y-2 pt-2 text-sm text-gray-700">
                {conflicts.map((leave) => (
                    <div
                        key={leave.id}
                        className="flex items-center justify-between bg-white border border-red-200 rounded-lg px-2 py-1 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <UserAvatar
                                avatar={leave.user?.avatar}
                                avatarSize={40}
                            />
                            {leave.user.firstName} {leave.user.lastName}
                        </div>
                        <div>{leave.user.team.name}</div>
                        <Badge variant="outline">{leave.activatedType.name}</Badge>
                        <div>{formatDurationRange(leave.duration, leave.startAt, leave.endAt)}</div>
                        <LeaveDuration
                            duration={leave.duration}
                            className="min-w-[100px] justify-center"
                        />
                        <LeaveStatusBadge status={leave.status}/>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}