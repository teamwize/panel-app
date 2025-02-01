import {Route} from "react-router-dom";
import SignUpPage from "@/modules/authentication/pages/SignUpPage.tsx";
import SignInPage from "@/modules/authentication/pages/SignInPage.tsx";

export default function AuthentiactionRoutes() {
    return (
        <>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path="/signin" element={<SignInPage/>}/>
        </>
    );
}