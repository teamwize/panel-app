import React, {useContext, useEffect, useState} from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {getCurrentEmployee, updateEmployee, updateEmployeePicture} from "~/services/WorkiveApiClient.ts"
import {getErrorMessage} from "~/utils/errorHandler.ts"
import {PageTitle, Alert} from '../../../core/components'
import AvatarEditor from 'react-avatar-editor'
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {UserResponse, UserUpdateRequest} from '~/constants/types'
import {AlertDescription} from "@/components/ui/alert"
import {Slider} from "@/components/ui/slider"
import {Button} from "@/components/ui/button"
import {Camera} from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {Card} from "@/components/ui/card";
import {UserContext} from "@/contexts/UserContext";
import {PagedResponse} from "@/constants/types";
import {getEmployee} from "@/services/WorkiveApiClient";

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
    }),
});

type Picture = {
    cropperOpen: boolean;
    img: string | null;
    zoom: number;
    croppedImg: string
}

export default function Profile() {
    const [employeeInfo, setEmployeeInfo] = useState<UserResponse | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const {user, accessToken} = useContext(UserContext);
    const [employeesList, setEmployeesList] = useState<PagedResponse<UserResponse> | null>(null);
    const [picture, setPicture] = useState<Picture>({
        cropperOpen: false,
        img: "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png",
        zoom: 2,
        croppedImg:
            "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
    })

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
        getCurrentEmployee()
            .then(data => {
                setEmployeeInfo(data);
                reset({
                    firstName: data.firstName,
                    lastName: data.lastName,
                });
            })
            .catch(error => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, [reset])

    // Handle form submission
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload: UserUpdateRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
        };
        setIsProcessing(true);

        updateEmployee(payload)
            .then(data => {
                setIsProcessing(false);
                setEmployeeInfo(data);
                toast({
                    title: "Success",
                    description: "Profile updated successfully!",
                    variant: "default",
                });
            })
            .catch(error => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    };

    // Handle file change for the profile picture
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const url = URL.createObjectURL(e.target.files[0]);
            setPicture({
                ...picture,
                img: url,
                cropperOpen: true,
            });
        }
    };

    return (
        <>
            <PageTitle title="Profile"></PageTitle>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <div>
                        <div className='w-40 flex flex-col right-0 left-0 mx-auto'>
                            <img
                                src={
                                    employeeInfo?.avatar
                                        ? `${employeeInfo.avatar?.url}?token=${accessToken}`
                                        : "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                                }
                                alt='Profile Image' className="h-40 w-40 rounded-full"/>
                            <div
                                className='bg-indigo-500 w-12 h-12 flex flex-row items-center rounded-full relative bottom-10 left-24'>
                                <label className='right-0 left-0 mx-auto z-10 cursor-pointer' htmlFor="upload-photo">
                                    <Camera className='w-7 h-7 text-white'></Camera>
                                </label>
                                <input key={picture.img} id='upload-photo' type="file" accept="image/jpeg, image/png"
                                       className='hidden' onChange={handleFileChange}/>
                            </div>
                        </div>

                        <ChangePicture picture={picture} setPicture={setPicture}></ChangePicture>
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
                            <Button type="submit" className="w-fit">Save</Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    )
}

type ChangePictureProps = {
    picture: Picture;
    setPicture: (pictue: Picture) => void;
}

function ChangePicture({picture, setPicture}: ChangePictureProps) {
    let editor: AvatarEditor | null = null;

    const setEditorRef = (ed: AvatarEditor | null) => editor = ed;

    const handleSlider = (value: number[]) => {
        if (value.length > 0) {
            setPicture({
                ...picture,
                zoom: value[0],
            });
        }
    }

    const handleCancel = () => {
        setPicture({
            ...picture,
            cropperOpen: false
        })
    }

    const handleSave = () => {
        if (setEditorRef) {
            const canvasScaled = editor.getImageScaledToCanvas();
            const croppedImg = canvasScaled.toDataURL();

            setPicture({
                ...picture,
                img: null,
                cropperOpen: false,
                croppedImg: croppedImg
            })

            updateEmployeePicture(croppedImg)
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
                    });
                })
        }
    }

    return (
        <Dialog open={picture.cropperOpen} onOpenChange={(open) => setPicture({...picture, cropperOpen: open})}>
            <DialogContent>
                <DialogTitle>Edit Picture</DialogTitle>

                <AvatarEditor
                    ref={setEditorRef}
                    image={picture.img}
                    width={200}
                    height={200}
                    border={20}
                    color={[255, 255, 255, 0.6]}
                    className="mx-auto"
                    rotate={0}
                    scale={picture.zoom}
                />
                <Slider
                    onValueChange={handleSlider}
                    defaultValue={[picture.zoom]}
                    min={1}
                    max={10}
                    step={0.1}
                    className="w-full mx-auto my-4"
                />

                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleCancel} className="w-1/2">
                        Cancel
                    </Button>
                    <Button variant="default" onClick={handleSave} className="w-1/2 ml-4">
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}