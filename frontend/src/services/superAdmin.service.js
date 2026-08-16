import api from "./api";

export const getPendingRegistrations = async () => {
    const response = await api.get("/super-admin/pending-registrations");
    return response.data;
};

export const approveRegistration = async (id, role) => {
    const response = await api.patch(
        `/super-admin/approve-registration/${id}`,
        {
            role,
        }
    );

    return response.data;
};

export const rejectRegistration = async (id) => {
    const response = await api.patch(
        `/super-admin/reject-registration/${id}`
    );

    return response.data;
};