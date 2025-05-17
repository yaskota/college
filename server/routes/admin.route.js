import express from 'express'
import { addBranch, addFaculty, addHod, addPrincipal, addRole,addStudent } from '../controller/admin.controller.js';
import { isAdmin, isFaculity, isHod, isPrincipal } from '../middleware/checkPerson.middleware.js';


const adminroute=express.Router()

adminroute.post('/branch',isAdmin, addBranch);
adminroute.post('/role',isAdmin,addRole)
adminroute.post('/addprincipal',isAdmin,  addPrincipal);
adminroute.post('/addhod',isPrincipal, addHod);
adminroute.post('/addfaculty',isHod, addFaculty);
adminroute.post('/addstudent',isFaculity, addStudent);

export default adminroute;