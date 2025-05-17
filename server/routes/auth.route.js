import express from 'express'
import { checkAuth, login, logout } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const authrouter=express.Router();

authrouter.post('/login',login);
authrouter.post('/logout',logout);
authrouter.get('/checkauth',protectRoute,checkAuth);

export default authrouter;
