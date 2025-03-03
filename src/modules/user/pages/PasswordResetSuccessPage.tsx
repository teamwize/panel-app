import React from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {CheckCircle} from "lucide-react";
import {CardContent} from "@/components/ui/card";

export default function PasswordResetSuccessPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <CardContent className="pt-6 flex flex-col items-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4"/>
                    <h2 className="text-lg font-semibold">Password Reset Successfully</h2>
                    <p className="text-gray-500 mt-2">Your password has been updated. You can now sign in with your new
                        password.</p>

                    <Button className="mt-6" onClick={() => navigate("/signin")}>Sign In to Your Account</Button>
                </CardContent>
            </div>
        </div>
    );
}