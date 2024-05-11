const emailWithNodemailer = require("../helpers/email");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { createJSONWebToken } = require('../helpers/jsonWebToken');
const { forgotPassword } = require("../controllers/userController");
//register user
// const userRegister = async (userDetails) => {
//     try {
//         // Business logic for user registration
//         console.log("Received user details:", userDetails); // Remove the { userDetails }
//         let { email, name } = userDetails;
//         // Generate OTC (One-Time Code)
//         const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
//         // Prepare email for activate user
//         const emailData = {
//             email,
//             subject: 'Account Activation Email',
//             html: `
//           <h1>Hello, ${name}</h1>
//           <p>Your One Time Code is <h3>${oneTimeCode}</h3> to verify your email</p>
//           <small>This Code is valid for 3 minutes</small>
//           `
//         }

//         // Send email
//         try {
//             emailWithNodemailer(emailData);
//         } catch (emailError) {
//             console.error('Failed to send verification email', emailError);
//             res.status(500).json({ message: 'Error creating user', error: emailError });
//         }
//         let newUserDetails = { ...userDetails, oneTimeCode: oneTimeCode };
       
//         if(!oneTimeCode)return
//          const user = await User.create(newUserDetails); // Remove the { userDetails } wrapper
//         // Set a timeout to update the oneTimeCode to null after 1 minute
//         console.log(user.isVerified,"veryfied")
//         setTimeout(async () => {
//             try {
//                 user.oneTimeCode = null;
               
//                 await user.save();
//                 console.log('oneTimeCode reset to null after 3 minutes');
//             } catch (error) {
//                 console.error('Error updating oneTimeCode:', error);
//             }
//         }, 180000); // 3 minutes in milliseconds
//     } catch (error) {
//         console.error("Error in userRegister service:", error);
//         throw new Error("Error occurred while registering user");
//     }
// };
const userRegister = async (userDetails) => {
    try {
        console.log("Received user details:", userDetails);
        let { email, name } = userDetails;
        const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
          <h1>Hello, ${name}</h1>
          <p>Your One Time Code is <h3>${oneTimeCode}</h3> to verify your email</p>
          <small>This Code is valid for 3 minutes</small>
          `
        }

        try {
            emailWithNodemailer(emailData);
        } catch (emailError) {
            console.error('Failed to send verification email', emailError);
            throw new Error('Error sending verification email');
        }

        let newUserDetails = { ...userDetails, oneTimeCode: oneTimeCode };
        console.log(newUserDetails, "new user details");
        if (!oneTimeCode) return;

        const user = await User.create(newUserDetails);
        console.log(user.isVerified, "verified");

        // Set a timeout to update the oneTimeCode to null after 3 minutes
        setTimeout(async () => {
            try {
                user.oneTimeCode = null;
                await user.save();
                console.log('oneTimeCode reset to null after 3 minutes');
            } catch (error) {
                console.error('Error updating oneTimeCode:', error);
            }
        }, 180000); // 3 minutes in milliseconds

        // Set a timeout to delete the user if not verified in 5 minutes
        setTimeout(async () => {
            try {
                const foundUser = await User.findById(user._id);
                if (foundUser && !foundUser.isVerified) {
                    await User.findByIdAndDelete(user._id);
                    console.log('User deleted after 3 minutes of not being verified');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }, 180000); // 3 minutes in milliseconds
    } catch (error) {
        console.error("Error in userRegister service:", error);
        throw new Error("Error occurred while registering user");
    }
};
// user logging
const userLogin = async ({ email, password, user }) => {

    try {
        const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
        const accessToken = createJSONWebToken({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, expiresInOneYear);
        console.log(accessToken);
        return accessToken;
    } catch (error) {
        console.error("Error in userLogin service:", error);
        throw new Error("Error occurred while logging in user");
    }
};
// forgot the password
const forgotPasswordService = async (email, user) => {
    try {
        const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        // Prepare email for activate user
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
          <h1>Hello, ${user.name}</h1>
          <p>Your One Time Code is <h3>${oneTimeCode}</h3> to verify your email</p>
          <small>This Code is valid for 3 minutes</small>
          `
        }

        // Send email
        try {
            emailWithNodemailer(emailData);
        } catch (emailError) {
            console.error('Failed to send verification email', emailError);
            throw new Error('Error creating user');
        }
        //Set one time code to user
        user.oneTimeCode = oneTimeCode;
        await user.save();

        const expiresInOneHour = 36000; // seconds in 1 hour
        const accessToken = createJSONWebToken({ _id: user._id, email: user.email}, process.env.JWT_SECRET_KEY, expiresInOneHour);
       
        return accessToken;
    } catch (error) {
        console.error("Error in forgotPassword service:", error);
        throw new Error("Error occurred while logging in user");
    }
};

const verifyCodeService = async ({ user, code }) => {
    console.log("-------user--------", user)
    console.log("--------code-------", code)
   

    try {
        if (user.oneTimeCode === code) {
            user.isVerified = true;
            
            await user.save();
            
            // Set a timeout to reset oneTimeCode to null after 3 minutes
            setTimeout(async () => {
                user.oneTimeCode = null;
                await user.save();
                console.log("oneTimeCode reset to null after 3 minutes");
            }, 3 * 60 * 1000); // 3 minutes in milliseconds

            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in verifyCode service:", error);
        throw new Error("Error occurred while verifying code");
    }
};

// change the password sercvice
const changePasswordService = async ({user, password}) => {
    console.log(user.password=password,"this is password")
    try {
        if(user){
           
            user.password = password;
            await user.save();
            return true;
        }
        else{
            throw new Error("Error occurred while changing password");
        }
    } catch (error) {
        console.error("Error in changePassword service:", error.message);
        throw new Error("Error occurred while changing password");
    }
}


module.exports = {
    userRegister,
    userLogin,
    forgotPasswordService,
    verifyCodeService,
    changePasswordService,
   

};
