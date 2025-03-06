import {Route} from "react-router-dom";
import SignUpPage from "@/modules/auth/pages/SignUpPage.tsx";
import SignInPage from "@/modules/auth/pages/SignInPage.tsx";
import PasswordForgetPage from "@/modules/auth/pages/PasswordForgetPage.tsx";
import AuthLayout from "@/components/layout/AuthLayout.tsx";

export default function AuthentiactionRoutes() {
    return (
        <Route element={<AuthLayout/>}>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path="/signin" element={<SignInPage/>}/>
            <Route path='/forget-password' element={<PasswordForgetPage/>}></Route>
        </Route>
    );
}