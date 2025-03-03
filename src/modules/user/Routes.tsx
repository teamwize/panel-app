import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import UsersPage from "@/modules/user/pages/UsersPage.tsx";
import UserDetailsPage from "@/modules/user/pages/UserDetailsPage.tsx";
import PasswordChangePage from "@/modules/user/pages/PasswordChangePage.tsx";
import ProfilePage from "@/modules/user/pages/ProfilePage.tsx";
import UserCreatePage from "@/modules/user/pages/UserCreatePage.tsx";
import UserUpdatePage from "@/modules/user/pages/UserUpdatePage.tsx";
import PasswordForgetPage from "@/modules/user/pages/PasswordForgetPage.tsx";
import PasswordResetPage from "@/modules/user/pages/PasswordResetPage.tsx";
import PasswordCheckEmailPage from "@/modules/user/pages/PasswordCheckEmailPage.tsx";
import PasswordResetSuccessPage from "@/modules/user/pages/PasswordResetSuccessPage.tsx";

export default function UserRoutes() {
    return (
        <>
            <Route path='/users' element={<AuthenticatedRoute><UsersPage/></AuthenticatedRoute>}></Route>
            <Route path='/users/:id/' element={<AuthenticatedRoute><UserDetailsPage/></AuthenticatedRoute>}></Route>
            <Route path='/settings/change-password'
                   element={<AuthenticatedRoute><PasswordChangePage/></AuthenticatedRoute>}></Route>
            <Route path='/profile' element={<AuthenticatedRoute><ProfilePage/></AuthenticatedRoute>}></Route>
            <Route path='/users/create' element={<AuthenticatedRoute><UserCreatePage/></AuthenticatedRoute>}></Route>
            <Route path='/users/:id/update'
                   element={<AuthenticatedRoute><UserUpdatePage/></AuthenticatedRoute>}></Route>
            <Route path='/forget-password' element={<PasswordForgetPage/>}></Route>
            <Route path='/reset-password' element={<PasswordResetPage/>}></Route>
            <Route path='/check-email' element={<PasswordCheckEmailPage/>}></Route>
            <Route path='/password-reset-success' element={<PasswordResetSuccessPage/>}></Route>
        </>
    );
}