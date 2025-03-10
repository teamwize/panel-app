import {NotificationChannel} from "@/core/types/notifications.ts";
import {Button} from "@/components/ui/button.tsx";
import React from "react";

type ChannelButtonProps = {
    channel: NotificationChannel;
    isSelected: boolean;
    onToggle: (channel: NotificationChannel) => void;
};

export const ChannelButton = ({channel, isSelected, onToggle}: ChannelButtonProps) => {
    return (
        <Button
            type="button"
            variant={"outline"}
            className={`gap-2 ${isSelected ? "bg-gray-100" : ""}`}
            onClick={() => onToggle(channel)}
        >
            {channel}
        </Button>
    );
};