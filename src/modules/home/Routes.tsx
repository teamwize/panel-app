import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import HomePage from "@/modules/home/pages/HomePage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

export default function HomeRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/' element={<AuthenticatedRoute><HomePage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}