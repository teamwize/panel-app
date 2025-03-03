import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Send} from "lucide-react";
import Logo from "@/components/icon/Logo.tsx";
import {sendPasswordResetEmail} from "@/core/services/authService";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {PageSection} from "@/components/layout/PageSection.tsx";

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
            await sendPasswordResetEmail(data.email);
            toast({title: "Success", description: "Check your email for a reset link.", variant: "default"});
            navigate("/signin");
        } catch (error) {
            toast({title: "Error", description: getErrorMessage(error as Error), variant: "destructive"});
        } finally {
            setIsProcessing(false);
            navigate("/check-email");
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center">
                    <Logo className="h-12 w-12 text-primary"/>
                    <PageSection title="Forget Password"
                                 description="Enter your email, and we'll send you instructions to reset your password."></PageSection>
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
                                    {isProcessing ? "Sending..." : "Send Reset Link"}
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