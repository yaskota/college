import express from 'express'
import { checkAuth, login, logout, passwordReset, sendOtp } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const authrouter=express.Router();

authrouter.post('/login',login);
authrouter.post('/logout',logout);
authrouter.get('/checkauth',protectRoute,checkAuth);
authrouter.post('/sendOtp',sendOtp);
authrouter.post('/passwordReset',passwordReset)

export default authrouter;
