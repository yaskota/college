import express from 'express'
import { addbranch, addPrincipal, addrole } from '../controller/admin.controller.js';

const adminroute=express.Router()

adminroute.post('/branch',addbranch);
adminroute.post('/role',addrole)
adminroute.post('/addprincipal',addPrincipal);

export default adminroute;