import { Bell, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();

    const pageTitles = {
        "/home": "Home",
        "/dashboard": "Dashboard",
        "/calendar": "Calendar",
        "/my-leaves": "My Leaves",
        "/leave-requests": "Leave Requests",
        "/employees": "Employees",
        "/pending-registrations": "Pending Registrations",
        "/profile": "Profile",
    };

    const title = pageTitles[location.pathname] || "Dashboard";

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

            <h1 className="text-3xl font-bold text-slate-800">
                {title}
            </h1>

            <div className="flex items-center gap-6">

                <span className="text-sm text-gray-500">
                    {today}
                </span>

                <button className="rounded-full p-2 hover:bg-gray-100">
                    <Moon size={20} />
                </button>

                <button className="relative rounded-full p-2 hover:bg-gray-100">

                    <Bell size={20} />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

                </button>

            </div>

        </header>
    );
}

export default Navbar;