import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import bcrypt from 'bcrypt';
import Branch from '../models/department.model.js';
import transporter from '../config/nodeMailer.js';

import dotenv from "dotenv";
import firstPasswordTemp from '../utils/firstPasswordTemp.js';
dotenv.config();



export const addRole = async (req, res) => {
    const { user } = req;
    const { role, branch } = req.body;

    try {
        if (!user) {
            return res.status(400).json({ message: 'User not exist' });
        }

        if (!role) {
            return res.status(400).json({ message: 'Missing details' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "You don't have access to add a role" });
        }

        const roleName = role.toLowerCase().trim();
        const existingRole = await Role.findOne({ name: roleName });

        if (existingRole) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        const hasDepartment = branch != null;

        const newRole = new Role({
            name: roleName,
            hasDepartment
        });

        await newRole.save();

        return res.status(201).json({ message: 'Role successfully added' });

    } catch (error) {
        console.error("Error adding role:", error);
        return res.status(500).json({ message: 'Error adding role', error: error.message });
    }
};


export const addDepartMent = async (req, res) => {
    const { user } = req;
    const { code, name } = req.body;

    try {
        if (!user) {
            return res.status(400).json({ message: 'User details not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "User doesn't have permission to add a department" });
        }

        if (!code || !name) {
            return res.status(400).json({ message: 'Missing department code or name' });
        }

        const existingBranch = await Branch.findOne({ code });
        if (existingBranch) {
            return res.status(400).json({ message: 'Department already exists' });
        }

        const newBranch = new Branch({ code, name });
        await newBranch.save();

        return res.status(201).json({ message: 'Department successfully added' });

    } catch (error) {
        console.error('Error adding department:', error);
        return res.status(500).json({ message: 'Error adding department', error: error.message });
    }
};

export const updateRole = async (req, res) => {
  const { user } = req;
  const { role, addArray = [], viewArray = [] } = req.body;

  try {
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!role || (!Array.isArray(addArray) && !Array.isArray(viewArray))) {
      return res.status(400).json({ message: 'Missing or invalid input' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Only admins can update roles' });
    }

    const updateRole = await Role.findOne({ name: role.toLowerCase().trim() });

    if (!updateRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Validate ObjectIds
    const validAddIds = addArray.filter(id => mongoose.Types.ObjectId.isValid(id));
    const validViewIds = viewArray.filter(id => mongoose.Types.ObjectId.isValid(id));

    // Merge without duplicates
    updateRole.canAdd = [
      ...new Set([...updateRole.canAdd.map(id => id.toString()), ...validAddIds])
    ];

    updateRole.canView = [
      ...new Set([...updateRole.canView.map(id => id.toString()), ...validViewIds])
    ];

    await updateRole.save();

    return res.status(200).json({
      message: 'Role updated successfully',
      updatedRole: updateRole
    });

  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



export const addPerson = async(req,res)=>{


    try {

        //UserBody chekulu

        const {user}=req;
       
        const { name, email, role, department } = req.body;



        // # first dummy admin ni add chyadam

        // const passwords = "123456"
        // const hashedPasswords = await bcrypt.hash(passwords, 10);
        // const newUsers = new User({
        //   name,
        //   email,
        //   password: hashedPasswords,
        //   role: '68285dc34f1041fa1a32c6d5',
        //   department : null  
        // });

        // await newUsers.save();



        //vald da, plus email exists ta

        if (!name || !email || !role  ) {

            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: 'User with this email already exists.' });
        }



        // user role undha

        const userRole = await Role.findById(user.role);
        if (!userRole) {
          return res.status(404).json({ message: 'User role not exist.' });
        }

        //person role undha

        const personRole = await Role.findOne({ name: role });
        console.log(personRole)
        if (!personRole) {
          return res.status(404).json({ message: 'Person role not exist.' });
        }


        // the total roles can add by User

        const rolesUserCanAddIds = userRole.canAdd;

        if (!rolesUserCanAddIds) {
          return res.status(400).json({ error: "user not has permision to add user" });
        }

        if(userRole.name==='principal' && personRole.name==='admin')
        {
            return res.status(400).json({ error: "principal cant add admin" });
        }

        // is the given role is present in the : user, can Add

        const userCanAdd = rolesUserCanAddIds.includes(personRole._id) || userRole.name==='admin' || userRole.name!=='principal';


        // person role ki department undha

        const personRoleHasDepartment = personRole.hasDepartment;

        console.log("person branch : ",personRole.hasDepartment)

        let personDepartmentId = null;

        if(personRoleHasDepartment)
        {

          // person role ki department undhi : Body lo department e cha da

          if(!department)
          {
               return res.status(400).json({ error: "All fields are required.(Department)" });
          }


          // person department anedhi departmentes lo unda

          console.log("the Branch : ",department)

          const personDepartment = await Branch.findOne({ code : department });
          console.log(personDepartment)
          if (!personDepartment || !personDepartment._id ) {
            return res.status(404).json({ message: 'Person Department not exist.' });
          }
          else{
             personDepartmentId = personDepartment._id;
          }

        }




        //person eligible la

        if(!userCanAdd )
        {
            return res.status(400).json({ message: 'You not Elegible to add the Person.' });
        }

        // console.log("msg : ",userPower,personPower,typeof(userPower),typeof(personPower))



        // createing a user

        const password = String(Math.floor(100000+(Math.random()*900000)))

        const hashedPassword = await bcrypt.hash(password, 10);



        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role: personRole._id,
          department : personDepartmentId
        });

        await newUser.save();




        // mail send cheye

        const mailOptions = {
            from: process.env.NODE_MAIL_EMAIL, 
            to: email,
            subject: "Welcome to Our Platform!",
            html: firstPasswordTemp(name,email,password) 
        };

        let sendMailError = "";

        try{
            await transporter.sendMail(mailOptions);
        }
        catch(err){
            sendMailError=" But, can't sendMail due To low Internet Connection"
        }

        

        // person ki department ledhu kan department e cha vu

        if(!personRoleHasDepartment && department){

          return res.status(200).json({message : "Person is created ( and Branch is not required)"+sendMailError,user : newUser})

        }

        // reponse send cheye
        return res.status(200).json({message : "Person is created"+sendMailError,user : newUser})
      
    }  catch (error) {
    console.log("Error in addUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }


}




export const getPerson = async (req, res) => {
  const { user } = req;

  try {
    // Check if user is authenticated
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user document with populated role and department
    const userDoc = await User.findById(user._id).populate('role department');
    if (!userDoc) {
      return res.status(404).json({ message: 'User document not found' });
    }

    // Fetch full role info including roles they can view
    const userRole = await Role.findById(userDoc.role._id).populate('canView');
    if (!userRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // ADMIN: Return all users grouped by role
    if (userRole.name === 'admin') {
      const roles = await Role.find({});
      const data = {};

      await Promise.all(
        roles.map(async (role) => {
          const users = await User.find({ role: role._id })
            .select('-password')
            .populate('role department');

          data[role.name.toLowerCase()] = users;
        })
      );

      return res.status(200).json({
        message: 'Fetched all users grouped by role',
        data,
      });
    }

    // NON-ADMIN: Fetch users for each viewable role
    const result = {};

    if (!Array.isArray(userRole.canView)) {
      return res.status(500).json({ message: 'Invalid canView role list' });
    }

    for (const viewableRole of userRole.canView) {
      const roleId = viewableRole._id;
      const roleHasDept = viewableRole.hasDepartment;

      const query = { role: roleId };

      // If role requires department, and user has one, filter by department
      if (roleHasDept) {
        if (!userDoc.department) continue; // Skip if user lacks department
        query.department = userDoc.department;
      }

      const users = await User.find(query)
        .select('-password')
        .populate('role department');

      result[viewableRole.name.toLowerCase()] = users;
    }

    return res.status(200).json({
      message: 'Fetched users you can view',
      data: result,
    });

  } catch (error) {
    console.error('Error in getPerson:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
