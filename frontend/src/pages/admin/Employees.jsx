import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getEmployees } from "../../services/user.service";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch employees."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">
                Employees
            </h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-3">Employee ID</th>
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Email</th>
                                <th className="border p-3">Phone</th>
                                <th className="border p-3">Designation</th>
                                <th className="border p-3">Role</th>
                                <th className="border p-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee._id}>
                                    <td className="border p-3">
                                        {employee.employeeId}
                                    </td>

                                    <td className="border p-3">
                                        {employee.fullName}
                                    </td>

                                    <td className="border p-3">
                                        {employee.email}
                                    </td>

                                    <td className="border p-3">
                                        {employee.phoneNumber}
                                    </td>

                                    <td className="border p-3">
                                        {employee.designation}
                                    </td>

                                    <td className="border p-3">
                                        {employee.role}
                                    </td>

                                    <td className="border p-3">
                                        {employee.isActive ? (
                                            <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="rounded bg-red-100 px-3 py-1 text-sm text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Employees;