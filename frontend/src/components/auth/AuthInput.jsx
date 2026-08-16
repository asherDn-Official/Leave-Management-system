function AuthInput({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
}) {
    return (
        <div>
            {label && (
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none transition focus:border-[#4F46E5]"
            />
        </div>
    );
}

export default AuthInput;