import express from 'express'
import { addBranch, addFaculty, addHod, addPrincipal, addRole,addStudent } from '../controller/admin.controller.js';
import { isAdmin, isFaculity, isHod, isPrincipal } from '../middleware/checkPerson.middleware.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const adminroute=express.Router()

adminroute.post('/branch',protectRoute, isAdmin, addBranch);
adminroute.post('/role',protectRoute, isAdmin,addRole)
adminroute.post('/addprincipal',protectRoute, isAdmin,  addPrincipal);
adminroute.post('/addhod',protectRoute, isPrincipal, addHod);
adminroute.post('/addfaculty',protectRoute, isHod, addFaculty);
adminroute.post('/addstudent',protectRoute, isFaculity, addStudent);

export default adminroute;