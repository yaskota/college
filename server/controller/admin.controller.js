import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import bcrypt from 'bcrypt';
import Branch from '../models/branch.model.js';


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

    return res.status(400).json({ message: 'Branch create succesfully' });
}

export const addroll =async(req,res)=>{
    const {roll}=req.body;
    if(!roll)
    {
        return res.status(400).json({ message: 'Details Missing' });
    }
    const user=await Role.findOne({name:roll})
    if(user)
    {
        return res.status(400).json({ message: 'Roll is already exist' });
    }
    const newuser=new Role({
        name:roll
    })
    await newuser.save();

    return res.status(400).json({ message: 'Roll create succesfully' });
}


export const addPrincipal = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // 1. Get Role ID for Principal
    const principalRole = await Role.findOne({ name: 'Principal' });
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

    res.status(201).json({ message: 'Principal user created successfully', data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};