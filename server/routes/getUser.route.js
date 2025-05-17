import express from 'express'

import { isAdmin } from '../middleware/checkPerson.middleware.js'
import {  getUserData, roles } from '../controller/getUser.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

const getUser = express.Router()

getUser.use(protectRoute);

getUser.get('/role',isAdmin, roles)
getUser.get('/getUserData', isAdmin, getUserData ) // Only admin can access this

export default getUser