import { generateToken } from "../config/jwtToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(200).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(200).json({ message: "Invalid credentials" });

    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect) {
      return res.status(200).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "login succesfully",
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).send({ message: "logout succesfully" });
  } catch (error) {
    console.error({ message: "error in login_page", error });
  }
};

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendOtp= async(req,res)=>{
    const userId = req.user._id;
    const email = req.user.email;
    try {
       
        if(!userId || !email)
        return res.status(200).json({message:"Unauthorized - No Token Provided"});

        const user = await User.findOne({email})

        if(!user) return res.status(200).json({message:"Invalid credentials"});

        if(user.isVerified){
            return res.status(200).json({message:"Your Account Already Verified"});
        }

        const otp = String(Math.floor(100000+(Math.random()*900000)))

        user.veficationOtp=otp;
        user.veficationOtpExpiresAt=Date.now()+2*60*1000;
        await user.save();

        const mailOptions = {
            from: process.env.NODE_MAIL_EMAIL, 
            to: email,
            subject: "Welcome to Our Platform!",
            html: verifyOtpTemp(user.name,email,otp) 
        };

        await transporter.sendMail(mailOptions);
        
        res.status(201).json({message:"verification Otp send to Your Email"})

    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const verifyEmail= async(req,res)=>{
    const userId = req.user._id;
    const {otp} = req.body;
    try {
       
        if(!userId)
        {
            console.log(userId,otp)
            return res.status(200).json({message:"Unauthorized User"});
        }

        const user = await User.findById(userId)

        if(!user) return res.status(200).json({message:"Invalid credentials"});

        // if(user.isVerified){
        //     return res.status(200).json({message:"Your Account Already Verified"});
        // }

        if(user.veficationOtp === "" || user.veficationOtp !== otp){
            return res.status(200).json({message:"Invalid Otp"});
        }

        if(user.veficationOtpExpiresAt < Date.now()){

            console.log("user.veficationOtpExpiresAt : ",user.veficationOtpExpiresAt,"Date.now() : ",Date.now())
            return res.status(200).json({message:"Otp Expired"});
        }

        user.isVerified=true;
        user.veficationOtp="";
        user.veficationOtpExpiresAt=0;
        await user.save(); 
        res.status(201).json({message:"Your Email Verified Sucessfully"})

    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
