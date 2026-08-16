import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthInput from "./AuthInput";
import AuthSelect from "./AuthSelect";
import AuthButton from "./AuthButton";

import { registerUser } from "../../services/auth.service";

function RegisterForm() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        employeeId: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        designation: "",
        password: "",
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const response = await registerUser(formData);

            toast.success(response.message);

            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">

            <h1 className="mb-2 text-5xl font-bold text-[#111827]">
                Create Account
            </h1>

            <p className="mb-10 text-gray-500">
                Register as a new employee
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <AuthInput
                    label="Employee ID"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter Employee ID"
                />

                <AuthInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter Full Name"
                />

                <AuthInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                />

                <AuthInput
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                />

                <AuthSelect
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                />

                <AuthButton
                    text="Create Account"
                    type="submit"
                    loading={loading}
                />

            </form>

            <p className="mt-8 text-center text-gray-500">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:underline"
                >
                    Sign In
                </Link>
            </p>

        </div>
    );
}

export default RegisterForm;