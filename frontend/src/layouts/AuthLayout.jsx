import AuthLeftPanel from "../components/auth/AuthLeftPanel";

function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#F7F8FC]">

            <AuthLeftPanel />

            <div className="flex w-1/2 items-center justify-center">
                {children}
            </div>

        </div>
    );
}

export default AuthLayout;