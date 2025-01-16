import {TeamResponse} from "@/constants/types/teamTypes.ts";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";

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
                    <Button onClick={handleReject} variant="outline">
                        No
                    </Button>
                    <Button onClick={handleAccept} variant="destructive" className="ml-4">
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}