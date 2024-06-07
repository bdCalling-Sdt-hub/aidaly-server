const { userRegister, userLogin, forgotPasswordService, verifyCodeService, changePasswordService } = require("../services/userService");
const Response = require("../helpers/response");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { createJSONWebToken } = require('../helpers/jsonWebToken');
const emailWithNodemailer = require("../helpers/email");
const jwt = require("jsonwebtoken");
//sign up user
const signUp = async (req, res) => {
    try {
        const { name, email, password,address, phone, city, state, dateOfBirth, role } = req.body;
        const {image} = req.files;

        const files = [];
        if (req.files) {
            image.forEach((image) => {
            const publicFileUrl = `/images/users/${image.filename}`;
            
            files.push({
              publicFileUrl,
              path: image.filename,
            });
            // console.log(files);
          });
        }

        // Validate request body
        if (!name) {
            return res.status(400).json(Response({  status:"Failed", statusCode:400,message: "Name is required" }));
        }

        if (!email) {
            return res.status(400).json(Response({ status:"Failed", statusCode:400, message: "Email is required" }));
        }

        if (!password) {
            return res.status(400).json(Response({ status:"Failed", statusCode:400, message: "Password is required" }));
        }
        const user = await User.findOne({ email });
        if(user){
            
            return res.status(400).json(Response({ status:"Failed", statusCode:400, message: "User already exists" }));
        }

        let userDetails = {
            name,
            email,
            password,
            image,
            phone,
            dateOfBirth,
            city,
            state,
            address,
            role,
           
        }


        // Check if image is provided in the request
        if (files && files.length > 0) {
            userDetails.image = files[0];
        }
        
        // Call service function to register user
       const data= await userRegister(userDetails);

        res.status(200).json(Response({statusCode:200,status:"sign up successfully", message: "A verification email is sent to your email",data:{data} }));

    } catch (error) {
        console.error("Error in signUp controller:", error);
        res.status(500).json({ error: "Server error" });
    }
};
// resend otp
const resendOtp=async(req,res, )=>{
    try {
        // Extract email from request body
        const { email } = req.body;
        
    
        // Validate email
        if (!email) {
          return res.status(400).json({ error: 'Email is required' });
        }
    
        // Find user by email
        const user = await User.findOne({ email });
       
    
        // Check if user exists
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    // if(user.oneTimeCode===null){

    // }
    //     // Generate a new OTP
    //     const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    // // Prepare email for activate user
    // const emailData = {
    //     email,
    //     subject: 'Account Activation Email',
    //     html: `
    //   <h1>Hello, ${user.name}</h1>
    //   <p>Your One Time Code is <h3>${oneTimeCode}</h3> to verify your email</p>
    //   <small>This Code is valid for 3 minutes</small>
    //   `
    // }
    if(user.oneTimeCode===null ){
       
     // Generate a new OTP
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
        // Update user's oneTimeCode
        user.oneTimeCode = oneTimeCode;
        // await user.save();
        // if(user.isVerified)
        const data =await user.save();
        console.log(data, "resend data")
    
        // Send verification email with new OTP
        await emailWithNodemailer(emailData);
    
        // Send success response
        res.status(200).json(Response({statusCode:200,status:'ok', message: 'OTP has been resent successfully',data:{user} }))}
        // bad response 
        res.status(400).json(Response({statusCode:400,status:'Failed', message: 'you alredy have otp please chaeck your email ' }));
    
      } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ error: 'Failed to resend OTP' }

        );
      }
}

//Sign in user
const signIn = async (req, res, next) => {
    try {
        // Get email and password from req.body
        const { email, password } = req.body;
        console.log("--------Meow", email)
       

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("-------------->>>>>", user)

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        if(user.isVerified === false){
 return res.status(401).json(Response({statusCode:401, message:'you are not veryfied',status:'Failed'}))
        }

        // Check if the user is banned
        if (user.isBlocked) {
            return res.status(401).json(Response({ statusCode: 401, message: 'sorry your account  blocked', status: "Failed" }));
        }
           
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("---------------", isPasswordValid)

        if (!isPasswordValid) {
           return res.status(401).json(Response({ statusCode: 401, message: 'Invalid password', status: "Failed" }));
        }

        // Call userLogin service function
        const accessToken = await userLogin({ email, password, user });
        
      // Update the user's isLoggedIn status to true
      await User.updateOne({ _id: user._id }, { isLoggedIn: true });

        //Success response
        res.status(200).json(Response({ statusCode: 200, message: 'Authentication successful', status: "OK", data: user, token: accessToken, type: "user" }));

    } catch (error) {
     
        res.status(200).json(Response({ statusCode: 500, message:error.message, status: "Failed" }));
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
       
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await forgotPasswordService(email, user);

        res.status(200).json(Response({ statusCode: 200, message: 'A verification code is sent to your email', status: "OK" }));

    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

//verify code
const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        // console.log("code-ifh", code)
       
        const user = await User.findOne({ email });
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
        if (!code) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
if(user.oneTimeCode===code){
    await verifyCodeService({ user, code })

    
        // Generate JWT token for the user
        const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
        const accessToken = createJSONWebToken({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, expiresInOneYear);
        console.log(accessToken);


    res.status(200).json(Response({ statusCode: 200, message: 'User verified successfully', status: "OK",data:{accessToken,id:user._id,email:user.email}}));


}else{
    return res.status(404).json(Response({ statusCode: 404, message: 'code is not valid', status: "Failed" }));
}
       
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};
// change password
const cahngePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        

        const user = await User.findOne({ email });
        
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Email is required', status: "Failed" }));
        }
        if (!password) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Password is required', status: "Failed" }));
        }

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await changePasswordService({ user, password });

        res.status(200).json(Response({ statusCode: 200, message: 'Password changed successfully', status: "OK" }));

    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const userBlocked=async(req,res,next)=>{
     // Get the token from the request headers
     const tokenWithBearer = req.headers.authorization;
     let token;
 
     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
         // Extract the token without the 'Bearer ' prefix
         token = tokenWithBearer.slice(7);
     }
 
     if (!token) {
         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
     }
 
     try {
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user=await User.findById(decoded._id)
       user.isBlocked=true
      const blockData=await  user.save()
    
        res.status(200).json(Response({ statusCode: 200, message: 'disabled error .',status:'faield',data:{blockData} }));

     }catch(error){
        res.status(500).json(Response({ statusCode: 500, message: 'server error .',status:'faield' }));
     }

}

// controllers/logoutController.js



const logoutController = async (req, res, next) => {// Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       const user=await User.findById(decoded._id)
        // Update user document to set isLoggedIn to false
        await User.findByIdAndUpdate(user._id, { isLoggedIn: false });

        // Respond with success message
        res.status(200).json(Response({ statusCode: 200, message: 'you logout from this device.',status:'ok' }));
    } catch (error) {
        // Handle any errors
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile=async(req,res,next)=>{
    const {name,email,phone,address,city,state,}=req.body

    const { image } = req.files || {};
const files = [];

// Check if there are uploaded files
if (image && Array.isArray(image)) {
    image.forEach((img) => {
        const publicFileUrl = `/images/users/${img.filename}`;
        files.push({
            publicFileUrl,
            path: img.filename,
        });
    });
}
   

    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       const user=await User.findById(decoded._id)
       console.log(decoded,user)

        // Assuming you have some user data in req.body that needs to be updated
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone=phone ||user.phone;
        user.address=address|| user.address;
        user.city=city|| user.city;
        user.state=state ||user.state
        user.image=files[0]|| user.image
        

        // Save the updated user profile
       const users= await user.save();

        // Respond with success message
        res.status(200).json(Response({ statusCode: 200, message: 'Profile updated successfully.', status: 'success',data:users}));

    }catch(error){
        res.status(500).json(Response({ statusCode: 500, message:error.message,status:'Failed' }));
    }


}

// change password by using old password

// const changePasswordUseingOldPassword=async(req,res,next)=>{

// }
// const bcrypt = require('bcrypt');

const changePasswordUseingOldPassword = async (req, res, next) => {
     // Get the token from the request headers
   const tokenWithBearer = req.headers.authorization;
   let token;

   if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
       // Extract the token without the 'Bearer ' prefix
       token = tokenWithBearer.slice(7);
   }

   if (!token) {
       return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
   }

   try {
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
        // Assuming user is authenticated and req.user contains user details
        
        // Extract old and new passwords from request body
        const { oldPassword, newPassword } = req.body;

        const user=await User.findById(decoded._id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log(user.password,oldPassword,newPassword)
        // // Check if old password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        // console.log(passwordMatch,"comaparrrrrrrrrrrrrrrrrrrrrrrrr")

        if (!passwordMatch) {
           return res.status(404).json(Response({ statusCode: 404, message: 'password incurrect.', status: 'success'}));
        }

        // // Hash the new password
        // const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // const hashedNewPassword = newPassword

        // console.log(hashedNewPassword)

        // // Update the user's password in the database
        user.password = newPassword;
        // console.log(hashedNewPassword,"hasssssss")

        // // Save the updated user object in the database
            await user.save()
        // Optionally, respond with success message
       return res.status(200).json(Response({ statusCode: 200, message: 'Profile updated successfully.', status: 'success',data:user}));
    } catch (error) {
        // Pass error to the error handling middleware
      return  res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
};

// module.exports = changePasswordUseingOldPassword;


// profile get for all user 
const ProfileOfUser=async(req,res,next)=>{

    
     // Get the token from the request headers
     const tokenWithBearer = req.headers.authorization;
     let token;
 
     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
         // Extract the token without the 'Bearer ' prefix
         token = tokenWithBearer.slice(7);
     }
 
     if (!token) {
         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
     }
 
     try {
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
         const profile=await User.findById(decoded._id)
         console.log(decoded,profile)

       return res.status(200).json(Response({ statusCode: 200, message: 'Profile showed successfully.', status: 'success',data:profile}));

        
    } catch (error) {
        return  res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

        
    }

}

module.exports = {
    signUp,
    signIn,
    forgotPassword,
    verifyCode,
    cahngePassword,
    resendOtp,
    userBlocked,
    logoutController,
    updateProfile,
    changePasswordUseingOldPassword,
    ProfileOfUser
    
};
