import AuthLayout from "../../layouts/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}

export default Register;