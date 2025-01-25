import React, {useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type CreatePolicyDialogProps = {
    onClose: () => void;
    onSubmit: (name: string) => void;
};

export function CreatePolicyDialog({onClose, onSubmit}: CreatePolicyDialogProps) {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        onSubmit(name);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Leave Policy</DialogTitle>
                </DialogHeader>
                <div>
                    <Input
                        placeholder="Enter leave policy name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}