import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Ellipsis} from "lucide-react";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "@/contexts/UserContext.tsx";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {clsx} from "clsx";

const DEFAULT_USER_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png";

type AccountDropdownProps = {
    isActive: boolean;
    onClick: (name: string) => void;
};

export default function AccountDropdown({ isActive, onClick }: AccountDropdownProps) {
    const [signOut, setSignOut] = useState<boolean>(false);
    const navigate = useNavigate();
    const {user, accessToken} = useContext(UserContext);

    const viewProfile = () => {
        navigate("/profile");
    };

    const handleDropdownClick = () => {
        onClick("profile");
    };

    return (
        <div
            className={clsx("m-4", isActive ? "bg-indigo-100 bg-opacity-75 rounded-lg px-2 py-1" : '')}
            onClick={handleDropdownClick}
            >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-between gap-2 cursor-pointer rounded-lg transition-all text-muted-foreground hover:text-primary">
                        <div className="flex items-center gap-2">
                            <img
                                src={
                                    user?.avatar?.url
                                        ? `${user.avatar.url}?token=${accessToken}`
                                        : DEFAULT_USER_AVATAR
                                }
                                alt="Profile Image"
                                className="h-8 w-8 rounded-full"
                            />
                            <div className={clsx("text-sm font-semibold", isActive ? "text-gray-700" : '')}>{user?.firstName} {user?.lastName}</div>
                        </div>
                        <Ellipsis className="w-4 h-4" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={viewProfile} className="cursor-pointer hover:bg-indigo-100 hover:text-primary dark:hover:bg-indigo-800">Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSignOut(true)} className="cursor-pointer hover:bg-indigo-100 hover:text-primary dark:hover:bg-indigo-800">Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {signOut && <SignOut signOut={signOut} setSignOut={setSignOut}/>}
        </div>
    )
}

type SignOutProps = {
    setSignOut: (signOut: boolean) => void;
    signOut: boolean;
};

function SignOut({setSignOut, signOut}: SignOutProps) {
    const navigate = useNavigate();
    const {signout} = useContext(UserContext);

    const closeSignOut = () => setSignOut(false);

    const handleRequest = (accepted: boolean) => {
        if (accepted) {
            signout();
            navigate('/signin');
        }
        closeSignOut();
    };

    return (
        <Dialog open={signOut} onOpenChange={closeSignOut}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Log Out</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to log out?</DialogDescription>
                <DialogFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleRequest(false)}>No</Button>
                    <Button variant="destructive" className="w-full ml-4" onClick={() => handleRequest(true)}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}