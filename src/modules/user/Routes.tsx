import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import UsersPage from "@/modules/user/pages/UsersPage.tsx";
import UserDetailsPage from "@/modules/user/pages/UserDetailsPage.tsx";
import ChangePasswordPage from "@/modules/user/pages/ChangePasswordPage.tsx";
import ProfilePage from "@/modules/user/pages/ProfilePage.tsx";
import UserCreatePage from "@/modules/user/pages/UserCreatePage.tsx";
import UserUpdatePage from "@/modules/user/pages/UserUpdatePage.tsx";

export default function UserRoutes() {
    return (
        <>
            <Route path='/users' element={<AuthenticatedRoute><UsersPage/></AuthenticatedRoute>}></Route>
            <Route path='/users/:id/' element={<AuthenticatedRoute><UserDetailsPage/></AuthenticatedRoute>}></Route>
            <Route path='/settings/change-password'
                   element={<AuthenticatedRoute><ChangePasswordPage/></AuthenticatedRoute>}></Route>
            <Route path='/profile' element={<AuthenticatedRoute><ProfilePage/></AuthenticatedRoute>}></Route>
            <Route path='/users/create' element={<AuthenticatedRoute><UserCreatePage/></AuthenticatedRoute>}></Route>
            <Route path='/users/:id/update'
                   element={<AuthenticatedRoute><UserUpdatePage/></AuthenticatedRoute>}></Route>
        </>
    );
}