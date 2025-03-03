import {Route} from "react-router-dom";
import SignUpPage from "@/modules/auth/pages/SignUpPage.tsx";
import SignInPage from "@/modules/auth/pages/SignInPage.tsx";
import PasswordForgetPage from "@/modules/auth/pages/PasswordForgetPage.tsx";
import PasswordCheckEmailPage from "@/modules/auth/pages/PasswordCheckEmailPage.tsx";

export default function AuthentiactionRoutes() {
    return (
        <>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path="/signin" element={<SignInPage/>}/>
            <Route path='/forget-password' element={<PasswordForgetPage/>}></Route>
            <Route path='/check-email' element={<PasswordCheckEmailPage/>}></Route>
        </>
    );
}