import express from 'express'

export const isFaculity = (req, res) => {
    try {

        if(req.user.role !== "developer" ||  req.user.role !== "principal"  || req.user.role !== "hod" || req.user.role !== "faculty") {  
            next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const isHod = (req, res) => {
    try {

        if(req.user.role !== "developer" ||  req.user.role !== "principal"  || req.user.role !== "hod") {  
            next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const isPrincipal = (req, res) => {
    try {

        if(req.user.role !== "developer" ||  req.user.role !== "principal") {  
            next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const isAdmin = (req, res) => {
    try {

        if(req.user.role !== "admin") {  
            next();
        }

        res.status(404).json({message : "Unauthorized - person"});
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}