import LeaveBalance from "../models/leaveBalance.model.js";
import User from "../models/user.js";


const DEFAULT_LEAVE_BALANCE = {
    casualLeave: {
        total: 12,
        used: 0,
        remaining: 12
    },

    sickLeave: {
        total: 12,
        used: 0,
        remaining: 12
    },

    earnedLeave: {
        total: 15,
        used: 0,
        remaining: 15
    }
};


/*
|--------------------------------------------------------------------------
| Create Default Leave Balance
|--------------------------------------------------------------------------
*/

const createDefaultLeaveBalance = async (
    employeeId,
    year
) => {

    return await LeaveBalance.create({

        employee: employeeId,

        year,

        casualLeave: {
            total:
                DEFAULT_LEAVE_BALANCE
                    .casualLeave
                    .total,

            used: 0,

            remaining:
                DEFAULT_LEAVE_BALANCE
                    .casualLeave
                    .total
        },

        sickLeave: {
            total:
                DEFAULT_LEAVE_BALANCE
                    .sickLeave
                    .total,

            used: 0,

            remaining:
                DEFAULT_LEAVE_BALANCE
                    .sickLeave
                    .total
        },

        earnedLeave: {
            total:
                DEFAULT_LEAVE_BALANCE
                    .earnedLeave
                    .total,

            used: 0,

            remaining:
                DEFAULT_LEAVE_BALANCE
                    .earnedLeave
                    .total
        }
    });
};


/*
|--------------------------------------------------------------------------
| Get My Leave Balance
|--------------------------------------------------------------------------
*/

export const getLeaveBalance = async (
    employeeId
) => {

    const currentYear =
        new Date().getFullYear();


    let leaveBalance =
        await LeaveBalance.findOne({
            employee: employeeId,
            year: currentYear
        });


    /*
    |--------------------------------------------------------------------------
    | Create default balance if it doesn't exist
    |--------------------------------------------------------------------------
    */

    if (!leaveBalance) {

        const employee =
            await User.findById(
                employeeId
            );


        if (!employee) {

            throw new Error(
                "Employee not found."
            );
        }


        leaveBalance =
            await createDefaultLeaveBalance(
                employeeId,
                currentYear
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Populate employee information
    |--------------------------------------------------------------------------
    */

    return await LeaveBalance.findById(
        leaveBalance._id
    ).populate(
        "employee",
        "employeeId fullName email designation role status"
    );
};


/*
|--------------------------------------------------------------------------
| Get All Leave Balances
|--------------------------------------------------------------------------
|
| This is used by SUPER_ADMIN.
|
| IMPORTANT:
|
| We DO NOT depend on the User.status field here.
|
| Every employee who already exists in the User collection
| is considered an employee for the purpose of this page.
|
| SUPER_ADMIN is excluded.
|
| If an employee does not have a LeaveBalance document,
| a default one is created automatically.
|
*/

export const getAllLeaveBalances = async () => {

    const currentYear =
        new Date().getFullYear();


    /*
    |--------------------------------------------------------------------------
    | Get all employees
    |--------------------------------------------------------------------------
    |
    | We exclude only SUPER_ADMIN.
    |
    | This avoids depending on whether your User model currently
    | stores "Approved", "Active", or some other status value.
    |
    */

    const employees =
        await User.find({
            role: {
                $ne: "SUPER_ADMIN"
            }
        })
            .select(
                "employeeId fullName email designation role status"
            )
            .sort({
                fullName: 1
            });


    const balances = [];


    /*
    |--------------------------------------------------------------------------
    | Make sure every employee has a leave balance
    |--------------------------------------------------------------------------
    */

    for (
        const employee of employees
    ) {

        let leaveBalance =
            await LeaveBalance.findOne({
                employee: employee._id,
                year: currentYear
            });


        /*
        |--------------------------------------------------------------------------
        | Create default balance
        |--------------------------------------------------------------------------
        */

        if (!leaveBalance) {

            leaveBalance =
                await createDefaultLeaveBalance(
                    employee._id,
                    currentYear
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Populate employee information
        |--------------------------------------------------------------------------
        */

        const populatedBalance =
            await LeaveBalance.findById(
                leaveBalance._id
            ).populate(
                "employee",
                "employeeId fullName email designation role status"
            );


        balances.push(
            populatedBalance
        );
    }


    return balances;
};


/*
|--------------------------------------------------------------------------
| Update Leave Balance
|--------------------------------------------------------------------------
*/

export const updateLeaveBalance = async (
    employeeId,
    balanceData
) => {

    /*
    |--------------------------------------------------------------------------
    | Find employee
    |--------------------------------------------------------------------------
    */

    const employee =
        await User.findById(
            employeeId
        );


    if (!employee) {

        throw new Error(
            "Employee not found."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Don't allow SUPER_ADMIN leave balance
    |--------------------------------------------------------------------------
    */

    if (
        employee.role === "SUPER_ADMIN"
    ) {

        throw new Error(
            "Leave balance cannot be assigned to SUPER_ADMIN."
        );
    }


    const currentYear =
        new Date().getFullYear();


    /*
    |--------------------------------------------------------------------------
    | Find existing balance
    |--------------------------------------------------------------------------
    */

    let leaveBalance =
        await LeaveBalance.findOne({
            employee: employeeId,
            year: currentYear
        });


    /*
    |--------------------------------------------------------------------------
    | Create default balance if necessary
    |--------------------------------------------------------------------------
    */

    if (!leaveBalance) {

        leaveBalance =
            await createDefaultLeaveBalance(
                employeeId,
                currentYear
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Update category
    |--------------------------------------------------------------------------
    */

    const updateCategory = (
        category,
        newTotal
    ) => {

        /*
        |--------------------------------------------------------------------------
        | Don't change category if it wasn't provided
        |--------------------------------------------------------------------------
        */

        if (
            newTotal === undefined
        ) {

            return;
        }


        newTotal =
            Number(newTotal);


        /*
        |--------------------------------------------------------------------------
        | Validate number
        |--------------------------------------------------------------------------
        */

        if (
            Number.isNaN(newTotal) ||
            newTotal < 0
        ) {

            throw new Error(
                `${category} balance cannot be negative.`
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Get used leave
        |--------------------------------------------------------------------------
        */

        const used =
            leaveBalance[
                category
            ]?.used || 0;


        /*
        |--------------------------------------------------------------------------
        | Total cannot be less than used
        |--------------------------------------------------------------------------
        */

        if (
            newTotal < used
        ) {

            throw new Error(
                `${category} total cannot be less than the days already used.`
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Update values
        |--------------------------------------------------------------------------
        */

        leaveBalance[
            category
        ].total =
            newTotal;


        leaveBalance[
            category
        ].remaining =
            newTotal - used;
    };


    /*
    |--------------------------------------------------------------------------
    | Update Casual Leave
    |--------------------------------------------------------------------------
    */

    updateCategory(
        "casualLeave",
        balanceData.casualLeave
    );


    /*
    |--------------------------------------------------------------------------
    | Update Sick Leave
    |--------------------------------------------------------------------------
    */

    updateCategory(
        "sickLeave",
        balanceData.sickLeave
    );


    /*
    |--------------------------------------------------------------------------
    | Update Earned Leave
    |--------------------------------------------------------------------------
    */

    updateCategory(
        "earnedLeave",
        balanceData.earnedLeave
    );


    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    await leaveBalance.save();


    /*
    |--------------------------------------------------------------------------
    | Return updated balance
    |--------------------------------------------------------------------------
    */

    return await LeaveBalance.findById(
        leaveBalance._id
    ).populate(
        "employee",
        "employeeId fullName email designation role status"
    );
};