import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/authentication/components/AuthenticatedRoute.tsx";
import HomePage from "@/modules/home/pages/HomePage.tsx";

export default function HomeRoutes() {
    return (
        <>
            <Route path='/' element={<AuthenticatedRoute><HomePage/></AuthenticatedRoute>}></Route>
        </>
    );
}