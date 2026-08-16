export const authorizeRoles =(...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access forbidden. You don't have permission to perform this action."
            });
        }
        next();
    };
};