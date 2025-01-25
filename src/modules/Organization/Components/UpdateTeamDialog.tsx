import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {TeamCreateRequest, TeamResponse} from "@/constants/types/teamTypes";

type UpdateTeamDialogProps = {
    teamId: number;
    teamName: string;
    onClose: () => void;
    onSuccess: () => void;
    updateTeam: (data: TeamCreateRequest, id: number) => Promise<TeamResponse>;
};

const FormSchema = z.object({
    name: z.string().min(2, { message: "Team Name must be over 2 characters" }).max(20, {
        message: "Team Name must be under 20 characters",
    }),
});

export default function UpdateTeamDialog({ teamId, teamName, onClose, onSuccess, updateTeam }: UpdateTeamDialogProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { name: teamName },
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setIsProcessing(true);
            await updateTeam({ name: data.name, metadata: {} }, teamId);
            onSuccess();
            onClose();
        } catch (error) {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Team Name</label>
                        <Input {...form.register("name")} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cancel
                        </Button>
                        <Button type="submit" disabled={isProcessing}>{isProcessing ? "Saving..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}