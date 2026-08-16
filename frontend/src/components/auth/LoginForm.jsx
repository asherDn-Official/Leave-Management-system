import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

import { loginUser } from "../../services/auth.service";

function LoginForm() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
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

            const response = await loginUser(formData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            toast.success(response.message);

            navigate("/home");

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">

            <h1 className="mb-2 text-5xl font-bold text-[#111827]">
                Welcome Back
            </h1>

            <p className="mb-10 text-gray-500">
                Sign in to your account
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <AuthInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />

                <AuthInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />

                <AuthButton
                    text="Sign In"
                    type="submit"
                    loading={loading}
                />

            </form>

            <p className="mt-8 text-center text-gray-500">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="font-semibold text-indigo-600 hover:underline"
                >
                    Create one
                </Link>
            </p>

        </div>
    );
}

export default LoginForm;