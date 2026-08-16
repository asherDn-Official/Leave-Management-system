import { Bell, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";

function TopNavbar() {
    const location = useLocation();

    const pageNames = {
        "/home": "Home",
        "/dashboard": "Dashboard",
        "/calendar": "Calendar",
        "/employees": "Employees",
        "/leave-requests": "Leave Requests",
        "/pending-registrations": "Pending Registrations",
        "/my-leaves": "My Leaves",
        "/profile": "Profile",
    };

    const title = pageNames[location.pathname] || "Dashboard";

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    {title}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    {today}
                </p>
            </div>

            <div className="flex items-center gap-4">

                <button className="rounded-full bg-gray-100 p-3 transition hover:bg-gray-200">
                    <Moon size={20} />
                </button>

                <button className="relative rounded-full bg-gray-100 p-3 transition hover:bg-gray-200">

                    <Bell size={20} />

                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>

                </button>

            </div>

        </header>
    );
}

export default TopNavbar;