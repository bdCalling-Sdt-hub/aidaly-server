
const Response = require("../helpers/response");
const User = require("../models/User");
const { userRegister } = require("../services/userService");

// sign up boutique
const signUpBoutique = async (req, res) => {
    try {
        const { name, email, password, address, rate,  city, state, description } = req.body;
      
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
console.log(image,files)

        // Validate request body
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const userDetails = {
            name,
            email,
            password,
            image,
            
            rate,
            city,
            state,
            address,
            role: "boutique",
            description
        };
  // Check if image is provided in the request
  if (files && files.length > 0) {
    userDetails.image = files[0];
}
        // Call service function to register user
        await userRegister(userDetails);

        // res.status(200).json({ message: "A verification email is sent to your email" });
        res.status(200).json(Response({statusCode:200,status:"sign up successfully", message: "A verification email is sent to your email", }));

    } catch (error) {
        console.error("Error in signUp controller:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    signUpBoutique,
};
