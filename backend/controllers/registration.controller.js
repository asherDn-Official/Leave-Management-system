import {registerEmployee} from "../services/registration.service.js";

export const register = async (req, res) => {
    try{
        const registration = await registerEmployee(req.body);

        return res.status(201).json({
            success: true,
            message: "Registration submitted successfully.",
            data: registration
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

};