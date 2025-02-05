import {AssetResponse, UserUpdateRequest} from "@/core/types/user.ts";
import React, {useState} from "react";
import {createAssets, updateUser} from "@/core/services/userService.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {dataURLtoFile} from "@/core/utils/file.ts";
import AvatarEditor from "react-avatar-editor";

type ChangePictureDialogProps = {
    initialImageUrl: string;
    onChange: (profilePicture: AssetResponse) => void;
}

export function AvatarUpdateDialog({initialImageUrl, onChange}: ChangePictureDialogProps) {
    let editor: AvatarEditor | null = null;
    const [isProcessing, setIsProcessing] = useState(false);
    let [zoom, setZoom] = useState(2);
    const setEditorRef = (ed: AvatarEditor | null) => editor = ed;

    const handleSlider = (value: number[]) => {
        if (value.length > 0) {
            setZoom(value[0]);
        }
    }

    const handleCancel = () => {
        onChange(null);
    }

    const handleSave = async () => {
        if (!editor) return;

        try {
            setIsProcessing(true);
            // Get the scaled canvas
            const canvasScaled = editor.getImageScaledToCanvas();
            // Convert canvas to base64 and then to a File
            const base64Image = canvasScaled.toDataURL("image/jpeg");
            const file = dataURLtoFile(base64Image, "profile-image.jpg");
            const files: File[] = [file];

            //Upload the image
            const assetResponse: AssetResponse[] = await createAssets("PROFILE_IMAGE", files);

            //Update the user with the uploaded asset ID
            const payload: UserUpdateRequest = {
                avatarAssetId: assetResponse[0].id,
            };
            const updatedUser = await updateUser("mine", payload);
            setIsProcessing(false);
            onChange(updatedUser.avatar);
            toast({
                title: "Success",
                description: "ProfilePage picture updated successfully!",
                variant: "default",
            });
        } catch (error) {
            console.error("Error:", error);
            setIsProcessing(false);
            const errorMessage = getErrorMessage(error as Error | string);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={initialImageUrl != null} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogTitle>Edit Picture</DialogTitle>
                <AvatarEditor
                    ref={setEditorRef}
                    image={initialImageUrl}
                    width={200}
                    height={200}
                    border={20}
                    color={[255, 255, 255, 0.6]}
                    className="mx-auto"
                    rotate={0}
                    scale={zoom}
                />
                <Slider
                    onValueChange={handleSlider}
                    defaultValue={[zoom]}
                    min={1}
                    max={10}
                    step={0.1}
                    className="w-full mx-auto my-4"
                />

                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleCancel} className="w-1/2">{isProcessing ? "Waiting ..." : "Cancel"}</Button>
                    <Button variant="default" onClick={handleSave} className="w-1/2 ml-4">{isProcessing ? "Waiting ..." : "Save"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}