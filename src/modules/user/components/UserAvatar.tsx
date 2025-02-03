import React, {useContext} from "react";
import {AssetResponse} from "@/core/types/user.ts";
import {UserContext} from "@/contexts/UserContext.tsx";
import {CircleUser} from "lucide-react";

type AvatarProps = {
    avatar: AssetResponse | null;
    avatarSize: number;
};

export default function UserAvatar({avatar, avatarSize}: AvatarProps) {
    const { accessToken } = useContext(UserContext);

    const avatarSrc = avatar ? `${avatar.url}?token=${accessToken}` : null;

    if (!avatarSrc) {
        return (
            <CircleUser
                className='text-gray-500'
                style={{
                    height: `${avatarSize}px`,
                    width: `${avatarSize}px`,
                }}
            />
        );
    }

    return (
        <img
            src={avatarSrc}
            alt="ProfilePage Image"
            className="rounded-full"
            style={{
                height: `${avatarSize}px`,
                width: `${avatarSize}px`,
            }}
        />
    );
}