import asherLogo from "../../assets/logo/asher-logo.webp";

function AuthLeftPanel() {
    return (
        <div className="relative flex w-1/2 flex-col justify-between overflow-hidden bg-[#0F1020] p-12 text-white">

            {/* Decorative Circles */}
            <div className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#232548]" />
            <div className="absolute right-10 top-1/2 h-44 w-44 rounded-full bg-[#1C1E39]" />
            <div className="absolute -bottom-32 right-8 h-72 w-72 rounded-full bg-[#232548]" />

            <div className="relative z-10">
                <img
                    src={asherLogo}
                    alt="AsherDn"
                    className="h-12"
                />
            </div>

            <div className="relative z-10 max-w-lg">

                <h1 className="mb-8 text-6xl font-bold leading-tight">
                    Track time.
                    <br />
                    Manage leaves.
                    <br />
                    Stay in sync.
                </h1>

                <p className="mb-10 text-lg text-gray-300">
                    The all-in-one HR platform for modern teams.
                    Punch in, apply for leave, and see who's off—all in one place.
                </p>

                <div className="space-y-4 text-lg">
                    <p>📅 Team leave calendar</p>
                    <p>📊 Employee dashboard</p>
                    <p>⏱ Attendance tracking</p>
                </div>

            </div>

            <p className="relative z-10 text-gray-400">
                © 2026 AsherDn. All rights reserved.
            </p>

        </div>
    );
}

export default AuthLeftPanel;