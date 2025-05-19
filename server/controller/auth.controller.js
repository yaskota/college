import { generateToken } from "../config/jwtToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import verifyOtpTemp from "../utils/verifyOtpTemp.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(200).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(200).json({ message: "User not exist" });

    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect) {
      return res.status(200).json({ message: "Password incorrect" });
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
    const cookieOptions={
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.NODE_ENV!=="development"
    }
  try {
    res.clearCookie("jwt", cookieOptions);

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
    const{email}=req.body;
    try {
       
        if(!email)
        return res.status(200).json({message:"Missing Deatils"});

        const userData = await User.findOne({email})

        if(!userData) return res.status(200).json({message:"Invalid Data"});

        const otp = String(Math.floor(100000+(Math.random()*900000)))

        userData.otp=otp;
        userData.otpExpiry=Date.now()+2*60*1000;

        await userData.save();

        const mailOptions = {
            from: process.env.NODE_MAIL_EMAIL, 
            to: email,
            subject: "Welcome to Our Platform!",
            html: verifyOtpTemp(User.name,email,otp) 
        };

        await transporter.sendMail(mailOptions);
        
        res.status(201).json({message:"verification Otp send to Your Email"})

    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const passwordReset= async(req,res)=>{
    
    const {email,otp,password} = req.body;
    
    try {
       
        if(!email || !otp || !password)
        {
            console.log(otp)
            return res.status(200).json({message:"Missing Details"});
        }

        const userData = await User.findOne({email})

        if(!userData) return res.status(200).json({message:"user not present"});

        

        if(otp === "" || userData.otp !== otp){
            return res.status(200).json({message:"Invalid Otp"});
        }

        if(userData.otpExpiry < Date.now()){

           
            return res.status(200).json({message:"Otp Expired"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        userData.otp="";
        userData.otpExpiry=0;
        userData.password=hashedPassword;
        await userData.save(); 
        res.status(201).json({message:"Password reset Sucessfully"})

    } catch (error) {
        console.log("Error in rest password controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
