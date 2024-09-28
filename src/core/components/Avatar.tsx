import React, { useContext } from "react";
import {AssetResponse} from "@/constants/types/userTypes";
import { UserContext } from "@/contexts/UserContext";

type AvatarProps = {
    avatar: AssetResponse | null;
    avatarSize: number;
};

export default function Avatar({ avatar, avatarSize }: AvatarProps) {
    const { accessToken } = useContext(UserContext);

    const AvatarSrc = () => {
        if (!avatar) {
            return "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png";
        }
        return `${avatar.url}?token=${accessToken}`;
    };

    return (
        <img
            src={AvatarSrc()}
            alt="Profile Image"
            className={`rounded-full h-${avatarSize} w-${avatarSize}`}
        />
    );
}