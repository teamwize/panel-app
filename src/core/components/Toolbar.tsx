import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import React, { useContext, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { UserContext } from '~/contexts/UserContext.tsx';
import { UserResponse } from "@/constants/types";

type ToolbarProps = {
    user: UserResponse | null;
};

export default function Toolbar({ user }: ToolbarProps) {
    const [signOut, setSignOut] = useState<boolean>(false);
    const navigate = useNavigate();

    const viewProfile = () => {
        navigate("/profile");
    };

    return (
        <div>
            <header
                className="flex flex-row-reverse h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={viewProfile}>Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSignOut(true)}>Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {signOut && <SignOutut signOut={signOut} setSignOut={setSignOut} />}
            </header>
        </div>
    );
}

type SignOutProps = {
    setSignOut: (signOut: boolean) => void;
    signOut: boolean;
};

function SignOutut({ setSignOut, signOut }: SignOutProps) {
    const navigate = useNavigate();
    const { signout } = useContext(UserContext);

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
                    <Button variant="outline" className="w-full" onClick={() => handleRequest(false)}>
                        No
                    </Button>
                    <Button variant="destructive" className="w-full ml-4" onClick={() => handleRequest(true)}>
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}