import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/authentication/components/AuthenticatedRoute.tsx";
import LeaveCreatePage from "@/modules/leave/pages/LeaveCreatePage.tsx";
import LeavePendingPage from "@/modules/leave/pages/LeavePendingPage.tsx";
import LeavePage from "@/modules/leave/pages/LeavePage.tsx";
import LeavePolicyPage from "@/modules/leave/pages/LeavePolicyPage.tsx";
import UpdateLeavePolicyPage from "@/modules/leave/pages/UpdateLeavePolicyPage.tsx";

export default function LeaveRoutes() {
    return (
        <>
            <Route path='/leaves/create' element={<AuthenticatedRoute><LeaveCreatePage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves/pending'
                   element={<AuthenticatedRoute><LeavePendingPage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves' element={<AuthenticatedRoute><LeavePage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves/policies'
                   element={<AuthenticatedRoute><LeavePolicyPage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves/policies/:id'
                   element={<AuthenticatedRoute><UpdateLeavePolicyPage/></AuthenticatedRoute>}></Route>
        </>
    );
}