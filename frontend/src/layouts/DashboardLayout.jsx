import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#F3F5FB]">

            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">

                <Navbar />

                <main className="flex-1 overflow-y-auto p-6">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;