import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Send} from "lucide-react";
import Logo from "@/components/icon/Logo.tsx";
import {sendGeneratedPasswordEmail} from "@/core/services/authService.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";

const FormSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
});

export default function PasswordForgetPage() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {email: ""},
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setIsProcessing(true);
            await sendGeneratedPasswordEmail(data.email);
            toast({title: "Success", description: "A new password has been sent to your email.", variant: "default"});
            navigate("/signin");
        } catch (error) {
            toast({title: "Error", description: getErrorMessage(error as Error), variant: "destructive"});
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="">
                        <Logo className="h-12 w-12 text-primary"/>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Forget Password
                    </h1>
                    <p className="text-gray-500 text-center max-w-sm">
                        Enter your email, and we'll send you a new password.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isProcessing}>
                                    <Send className="mr-2 h-4 w-4"/>
                                    {isProcessing ? "Sending..." : "Send New Password"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <Separator/>

                    <CardFooter>
                        <p className="text-sm text-center w-full text-gray-500 mt-4">
                            Remember your password?{" "}
                            <button onClick={() => navigate("/signin")}
                                    className="text-primary font-medium hover:underline">Sign in
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}