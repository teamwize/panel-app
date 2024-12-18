import React, {useContext, useEffect, useState} from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {createAssets, getCurrentUser, updateUser} from "@/services/userService";
import {getErrorMessage} from "~/utils/errorHandler.ts"
import {PageTitle} from '../../../core/components'
import AvatarEditor from 'react-avatar-editor'
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {AssetResponse, UserUpdateRequest} from '@/constants/types/userTypes'
import {AlertDescription, Alert} from "@/components/ui/alert"
import {Slider} from "@/components/ui/slider"
import {Button} from "@/components/ui/button"
import {Camera} from "lucide-react"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {Card} from "@/components/ui/card";
import {UserContext} from "@/contexts/UserContext";
import {dataURLtoFile} from "@/lib/utils.ts";

const FormSchema = z.object({
    firstName: z.string().min(2, {
        message: "First Name must be at least 2 characters.",
    }).max(20, {
        message: "First Name must be under 20 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last Name must be at least 2 characters.",
    }).max(20, {
        message: "Last Name must be under 20 characters.",
    })
});

const DEFAULT_USER_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png";

export default function Profile() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const {accessToken, user, setUser} = useContext(UserContext);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const {reset} = form;

    // Fetch employee information on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                setUser(user);
                reset({
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
            } catch (error) {
                const errorMessage = getErrorMessage(error as Error | string);
                setErrorMessage(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        };
        fetchUserData();
    }, [reset]);

    // Handle form submission
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const payload: UserUpdateRequest = {
                firstName: data.firstName,
                lastName: data.lastName,
            };
            setIsProcessing(true);
            const updateUserResponse = await updateUser(payload);
            setIsProcessing(false);
            setUser(updateUserResponse);
            toast({
                title: "Success",
                description: "Profile updated successfully!",
                variant: "default",
            });
        } catch (error) {
            setIsProcessing(false);
            console.error("Error:", error);
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    // Handle file change for the profile picture
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const url = URL.createObjectURL(e.target.files[0]);
            setSelectedAvatar(url);
        }
        e.target.value = "";
    };

    const handleUpdateUserAvatar = (asset: AssetResponse | null) => {
        if (asset) {
            setUser({...user, avatar: asset});
        }
        setSelectedAvatar(null);
    };

    return (
        <>
            <PageTitle title="Profile"></PageTitle>

            {errorMessage && (
                <Alert className='text-red-500 border-none px-0 font-semibold'>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
                    <div>
                        <div className='w-40 flex flex-col right-0 left-0 mx-auto'>
                            <img
                                src={
                                    user?.avatar?.url
                                        ? `${user.avatar.url}?token=${accessToken}`
                                        : DEFAULT_USER_AVATAR
                                }
                                alt='Profile Image' className="h-40 w-40 rounded-full"/>
                            <div className='bg-indigo-500 w-12 h-12 flex flex-row items-center rounded-full relative bottom-10 left-24'>
                                <label className='right-0 left-0 mx-auto z-10 cursor-pointer' htmlFor="upload-photo">
                                    <Camera className='w-7 h-7 text-white'></Camera>
                                </label>
                                <input id='upload-photo' type="file" accept="image/jpeg, image/png"
                                       className='hidden' onChange={handleFileChange}/>
                            </div>
                        </div>

                        {selectedAvatar && (<ChangePictureDialog initialImageUrl={selectedAvatar} onChange={handleUpdateUserAvatar}/>)}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="First Name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Last Name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-fit">{isProcessing ? "Waiting ..." : "Save"}</Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    )
}

type ChangePictureProps = {
    initialImageUrl: string;
    onChange: (profilePicture: AssetResponse) => void;
}

function ChangePictureDialog({initialImageUrl,  onChange}: ChangePictureProps) {
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
            const updatedUser = await updateUser(payload);
            setIsProcessing(false);
            onChange(updatedUser.avatar);
            toast({
                title: "Success",
                description: "Profile picture updated successfully!",
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