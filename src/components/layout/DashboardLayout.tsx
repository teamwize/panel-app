import Sidebar from "@/components/sidebar/Sidebar";
import {Outlet} from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[276px_1fr]">
            <Sidebar/>
            <div className="flex flex-col bg-[#f9f9f9] border-l border-gray-200">
                <Outlet/>
            </div>
        </div>
    );
}