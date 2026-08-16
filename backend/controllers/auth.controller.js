import { loginUser } from "../services/auth.service.js";

export const login = async (req,res) => {
    try{
        const {email, password} = req.body;

        const loginResponse = await loginUser(email, password);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data:loginResponse
        });

    }catch(error){
        return res.status(400).json({
            success:false,
            message: error.message
        });
    }
};