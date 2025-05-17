import express from 'express'
import { addBranch, addFaculty, addHod, addPrincipal, addRole,addStudent } from '../controller/admin.controller.js';

const adminroute=express.Router()

adminroute.post('/branch',addBranch);
adminroute.post('/role',addRole)
adminroute.post('/addprincipal',addPrincipal);
adminroute.post('/addhod',addHod);
adminroute.post('/addfaculty',addFaculty);
adminroute.post('/addstudent',addStudent);

export default adminroute;