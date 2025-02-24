import {TeamResponse} from "@/core/types/team.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {Check, X} from "lucide-react";

type DeleteModalProps = {
    handleAccept: () => void;
    handleReject: () => void;
    team: TeamResponse;
};

export function DeleteModal({ handleAccept, handleReject, team }: DeleteModalProps) {
    return (
        <Dialog open={true} onOpenChange={handleReject}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Remove Team</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to remove the {team.name} team?
                </DialogDescription>
                <DialogFooter className="flex justify-center">
                    <Button onClick={handleReject} type="button" variant="outline" className="mr-2">
                        <X className="w-4 h-4 mr-2"/>
                        No
                    </Button>
                    <Button variant="destructive" onClick={handleAccept}>
                        <Check className="w-4 h-4 mr-2"/>
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}