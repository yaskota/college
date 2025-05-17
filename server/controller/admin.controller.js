import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import bcrypt from 'bcrypt';
import Branch from '../models/branch.model.js';
import transporter from '../config/nodeMailer.js';

import dotenv from "dotenv";
import firstPasswordTemp from '../utils/firstPasswordTemp.js';
dotenv.config();



export const addbranch =async(req,res)=>{
    const {branch}=req.body;
    if(!branch)
    {
        return res.status(400).json({ message: 'Details Missing' });
    }
    const user=await Branch.findOne({name:branch})
    if(user)
    {
        return res.status(400).json({ message: 'Branch is already exist' });
    }
    const newuser=new Branch({
        name:branch
    })
    await newuser.save();

    return res.status(201).json({ message: 'Branch create succesfully' });
}

export const addrole =async(req,res)=>{
    const {role}=req.body;
    if(!role)
    {
        return res.status(400).json({ message: 'Details Missing' });
    }
    const user=await Role.findOne({name:role})
    if(user)
    {
        return res.status(400).json({ message: 'Roll is already exist' });
    }
    const newuser=new Role({
        name:role
    })
    await newuser.save();

    return res.status(201).json({ message: 'Roll create succesfully' });
}


export const addPrincipal = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email ) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const password = String(Math.floor(100000+(Math.random()*900000)))


        

    // 1. Get Role ID for Principal
    const principalRole = await Role.findOne({ name: 'principal' });
    if (!principalRole) {
      return res.status(404).json({ message: 'Principal role not found.' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User with principal role and no branch
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: principalRole._id,
      branch: null  // or just omit it
    });

    await newUser.save();


    const mailOptions = {
            from: process.env.NODE_MAIL_EMAIL, 
            to: email,
            subject: "Welcome to Our Platform!",
            html: firstPasswordTemp(name,email,password) 
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Principal user created successfully', data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



