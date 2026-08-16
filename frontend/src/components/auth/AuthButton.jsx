function AuthButton({ text, type = "button", loading = false }) {
    return (
        <button
            type={type}
            disabled={loading}
            className="w-full rounded-xl bg-[#101322] py-4 font-semibold text-white transition hover:bg-[#1A1D2F] disabled:cursor-not-allowed disabled:opacity-70"
        >
            {loading ? "Please wait..." : text}
        </button>
    );
}

export default AuthButton;