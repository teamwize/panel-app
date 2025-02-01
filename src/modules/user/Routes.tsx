import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/authentication/components/AuthenticatedRoute.tsx";
import UserPage from "@/modules/user/Pages/UserPage.tsx";
import UserDetailsPage from "@/modules/user/Pages/UserDetailsPage.tsx";
import ChangePasswordPage from "@/modules/user/Pages/ChangePasswordPage.tsx";
import ProfilePage from "@/modules/user/Pages/ProfilePage.tsx";
import UserCreatePage from "@/modules/user/Pages/UserCreatePage.tsx";
import UserUpdatePage from "@/modules/user/Pages/UserUpdatePage.tsx";

export default function UserRoutes() {
    return (
        <>
            <Route path='/users' element={<AuthenticatedRoute><UserPage/></AuthenticatedRoute>}></Route>
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