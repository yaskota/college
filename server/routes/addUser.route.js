import express from 'express'
import {  branch, faculty, hod, principal, role, student } from '../controller/addUser.controller.js';
import { isAdmin, isFaculity, isHod, isPrincipal } from '../middleware/checkPerson.middleware.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const addUser=express.Router()

addUser.use(protectRoute);

addUser.post('/branch', isAdmin, branch);
addUser.post('/role', isAdmin,role)
addUser.post('/addprincipal', isAdmin,  principal);
addUser.post('/addhod', isPrincipal, hod);
addUser.post('/addfaculty', isHod, faculty);
addUser.post('/addstudent', isFaculity, student);

export default addUser;