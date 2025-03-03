import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {CardContent, CardFooter} from "@/components/ui/card.tsx";
import Logo from "@/components/icon/Logo.tsx";
import {PageSection} from "@/components/layout/PageSection.tsx";

export default function PasswordCheckEmailPage() {
    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        setIsResending(true);
        // Simulate API call delay
        setTimeout(() => {
            setIsResending(false);
            alert("A new password has been sent to your email.");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center">
                    <Logo className="h-12 w-12 text-primary"/>
                    <PageSection title="Check Your Email"
                                 description="We've sent you a new password. Please check your inbox and use it to sign in."></PageSection>
                </div>

                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <p className="text-gray-600">Still haven't received the email?</p>
                    <Button className="mt-3 px-6 py-2" onClick={handleResend}
                            disabled={isResending}>{isResending ? "Resending..." : "Resend the Email"}</Button>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <button onClick={() => navigate("/signin")}
                            className="text-primary font-medium hover:underline">Back to Sign In
                    </button>
                </CardFooter>
            </div>
        </div>
    );
}