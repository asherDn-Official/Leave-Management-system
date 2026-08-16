function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
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
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#4F46E5]"
            />
        </div>
    );
}

export default Input;