import express from 'express'
import Role from '../models/role.model.js';

export const isFaculity = async(req, res,next) => {
     const {user}=req;
     const roleId=user.role;
    try {
        const Data=await Role.findById(roleId);
        if(Data.name === "admin" ||  Data.name === "principal"  || Data.name === "hod" || Data.name === "faculty") {  
            return next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const isHod = async(req, res,next) => {
        const {user}=req;
        const roleId=user.role;
    try {

        console.log(user);
        const Data=await Role.findById(roleId);
        console.log(Data);
        if(Data.name === "admin" ||  Data.name === "principal"  || Data.name === "hod") {  
            return next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const isPrincipal = async(req, res,next) => {
     const {user}=req;
     const roleId=user.role;
    try {
        const Data=await Role.findById(roleId);
        if(Data.name === "admin" || Data.name === "principal") {  
            return next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const isAdmin = async(req, res,next) => {
     const {user}=req;
     const roleId=user.role;
    try {
        const Data=await Role.findById(roleId);
        if(Data.name === "admin") {  
            return next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}