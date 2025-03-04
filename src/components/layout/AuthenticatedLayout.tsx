import Sidebar from "@/components/sidebar/Sidebar";

export default function AuthenticatedLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[276px_1fr]">
            <Sidebar/>
            <div className="flex flex-col bg-[#f9f9f9] border-l border-gray-200">
                {children}
            </div>
        </div>
    );
}