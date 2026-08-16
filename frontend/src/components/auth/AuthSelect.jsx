import { DESIGNATIONS } from "../../constants/designations";

function AuthSelect({
    label,
    value,
    onChange,
    name,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none transition focus:border-[#4F46E5]"
            >
                <option value="">
                    Select Designation
                </option>

                {DESIGNATIONS.map((designation) => (
                    <option
                        key={designation}
                        value={designation}
                    >
                        {designation}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default AuthSelect;