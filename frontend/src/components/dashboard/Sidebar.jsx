import { NavLink, useNavigate } from "react-router-dom";

import {
    Home,
    CalendarDays,
    ClipboardList,
    Users,
    UserCircle,
    Clock3,
    LogOut,
    WalletCards
} from "lucide-react";


function Sidebar() {

    const navigate = useNavigate();

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const role = user?.role;


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    const commonItems = [
        {
            name: "Home",
            path: "/home",
            icon: Home
        },

        {
            name: "Calendar",
            path: "/calendar",
            icon: CalendarDays
        }
    ];


    const userItems = [
        {
            name: "Apply Leave",
            path: "/apply-leave",
            icon: ClipboardList
        },

        {
            name: "My Leaves",
            path: "/my-leaves",
            icon: Clock3
        }
    ];


    const adminItems = [
    {
        name: "Apply Leave",
        path: "/apply-leave",
        icon: ClipboardList
    },

    {
        name: "My Leaves",
        path: "/my-leaves",
        icon: Clock3
    },

    {
        name: "Leave Requests",
        path: "/leave-requests",
        icon: ClipboardList
    }
];


    const superAdminItems = [
        {
        name: "Attendance",
        path: "/attendance",
    icon: Clock3
    },
        {
            name: "Leave Requests",
            path: "/leave-requests",
            icon: ClipboardList
        },

        {
            name: "Pending Registrations",
            path: "/pending-registrations",
            icon: UserCircle
        },

        {
            name: "Employees",
            path: "/employees",
            icon: Users
        },

        {
            name: "Leave Balances",
            path: "/leave-balances",
            icon: WalletCards
        }
    ];


    let menuItems = [];


    if (role === "USER") {

        menuItems = [
            ...commonItems,
            ...userItems
        ];

    } else if (role === "ADMIN") {

        menuItems = [
            ...commonItems,
            ...adminItems
        ];

    } else if (role === "SUPER_ADMIN") {

        menuItems = [
            ...commonItems,
            ...superAdminItems
        ];
    }


    return (

        <aside
            className="
                w-72
                min-h-screen
                bg-[#111827]
                text-white
                flex
                flex-col
            "
        >

            {/* Logo Section */}

            <div
                className="
                    px-6
                    py-7
                    border-b
                    border-gray-700
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-white
                        tracking-tight
                    "
                >
                    AsherDn
                </h1>

                <p
                    className="
                        text-sm
                        text-blue-200
                        mt-1
                    "
                >
                    Leave Management
                </p>

            </div>


            {/* Navigation */}

            <nav
                className="
                    flex-1
                    px-3.5
                    py-7
                    space-y-2
                "
            >

                {menuItems.map((item) => {

                    const Icon = item.icon;


                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3.5
                                rounded-xl
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    isActive
                                        ? "bg-[#5138ee] text-white shadow-md"
                                        : "text-blue-100 hover:bg-[#1c2638] hover:text-white"
                                }
                                `
                            }
                        >

                            <Icon
                                size={20}
                                strokeWidth={1.8}
                            />

                            <span>
                                {item.name}
                            </span>

                        </NavLink>

                    );

                })}

            </nav>


            {/* User Section */}

            <div
                className="
                    border-t
                    border-gray-700
                    p-5
                "
            >

                {/* Profile */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        mb-5
                    "
                >

                    <div
                        className="
                            w-12
                            h-12
                            rounded-full
                            bg-[#5138ee]
                            text-white
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                        "
                    >

                        <UserCircle
                            size={28}
                            strokeWidth={1.8}
                        />

                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-white
                                truncate
                            "
                        >
                            {user?.fullName || "User"}
                        </p>

                        <p
                            className="
                                text-xs
                                text-blue-200
                                mt-1
                            "
                        >
                            {role}
                        </p>

                    </div>

                </div>


                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-3
                        px-4
                        py-3
                        rounded-lg
                        bg-red-600
                        text-white
                        text-sm
                        font-medium
                        hover:bg-red-700
                        transition
                    "
                >

                    <LogOut
                        size={18}
                        strokeWidth={1.8}
                    />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
}


export default Sidebar;