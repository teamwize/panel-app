import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import LeaveCreatePage from "@/modules/leave/pages/LeaveCreatePage.tsx";
import LeavePendingPage from "@/modules/leave/pages/LeavePendingPage.tsx";
import LeavesPage from "@/modules/leave/pages/LeavesPage.tsx";
import LeavePolicyPage from "@/modules/leave/pages/LeavePolicyPage.tsx";
import LeavePolicyUpdatePage from "@/modules/leave/pages/LeavePolicyUpdatePage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

export default function LeaveRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/leaves/create' element={<AuthenticatedRoute><LeaveCreatePage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves/pending'
                   element={<AuthenticatedRoute><LeavePendingPage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves' element={<AuthenticatedRoute><LeavesPage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves/policies'
                   element={<AuthenticatedRoute><LeavePolicyPage/></AuthenticatedRoute>}></Route>
            <Route path='/leaves/policies/:id'
                   element={<AuthenticatedRoute><LeavePolicyUpdatePage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}