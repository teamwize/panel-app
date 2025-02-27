import React, {useContext} from "react";
import {AssetResponse} from "@/core/types/user.ts";
import {UserContext} from "@/contexts/UserContext.tsx";
import {User} from "lucide-react";

type AvatarProps = {
    avatar: AssetResponse | null;
    avatarSize: number;
    className?: string;
};

export default function UserAvatar({avatar, avatarSize, className}: AvatarProps) {
    const { accessToken } = useContext(UserContext);
    const avatarSrc = avatar ? `${avatar.url}?token=${accessToken}` : null;

    const commonStyles = {
        height: `${avatarSize}px`,
        width: `${avatarSize}px`,
        objectFit: 'cover' as const,
        transition: 'all 0.2s ease-in-out'
    };

    if (!avatarSrc) {
        return (
            <div
                className={`relative inline-flex items-center justify-center border-2 border-gray-300 rounded-full ${className ?? ''}`}
                style={commonStyles}
            >
                <User
                    className="text-gray-300"
                    size={Math.max(avatarSize)}
                />
            </div>
        );
    }

    return (
        <div className="relative inline-block">
            <img
                src={avatarSrc}
                alt="User Avatar"
                className={`rounded-full hover:opacity-90 ${className ?? ''}`}
                style={commonStyles}
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'fallback-avatar-url.jpg'; // Add your fallback image URL
                }}
            />
        </div>
    );
}