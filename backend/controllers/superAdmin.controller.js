import {getPendingRegistrations,approveRegistration, rejectRegistration} from "../services/superAdmin.service.js";

export const getPendingRegistrationsListController = async (req, res) =>{
    try{
        const pendingRegistrations = await getPendingRegistrations();
        
        return res.status(200).json({
            success: true,
            message: "Pending Registrations fetched successfully.",
            data: pendingRegistrations
        });
        
    }catch(error){
        return res.status(400).json({
            success:false,
            message: error.message
        });
    }
};


export const approveRegistrationController= async(req,res) => {
    try{
        const{id}= req.params;
        const{role}=req.body;
        const user = await approveRegistration(id,role);

        return res.status(200).json({
            success: true,
            message: "Registration approved successfully.",
            data: user
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message: error.message
        });
    }
};

export const rejectRegistrationController = async(req,res) => {
    try{
        const {id} =req.params;
        const rejectUserRegistration = await rejectRegistration(id);

        return res.status(200).json({
            success: true,
            message:"Registration rejected successfully.",
            data: rejectUserRegistration
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message: error.message
        });
    }
};