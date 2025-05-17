import express from 'express';
import Role from '../models/role.model.js';
import User from '../models/user.model.js';

/**
 * GET /roles - Fetch all available roles
 */
export const roles = async (req, res) => {
    try {
        const roles = await Role.find();

        if (!roles.length) {
            return res.status(404).json({ message: "No roles found" });
        }

        return res.status(200).json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Fetch all users grouped by their roles
 * @returns {Object} - { admin: [...], faculty: [...], unknown: [...] }
 */
export const getGroupedUsersByRole = async () => {
    try {
        const roles = await Role.find();
        const groupedUsers = {};

        // Group users by their role
        for (const role of roles) {
            const users = await User.find({ role: role._id })
                .populate("role")
                .select("-password");

            groupedUsers[role.name.toLowerCase()] = users;
        }

        // Find users without a valid role
        const unassignedUsers = await User.find({ role: { $exists: false } }).select("-password");

        if (unassignedUsers.length) {
            groupedUsers["unknown"] = unassignedUsers;
        }

        return groupedUsers;
    } catch (error) {
        console.error("Error grouping users by role:", error.message);
        return {};
    }
};

export const getUserData = async (req, res) => {
    const { user } = req;

    try {
        const roleDoc = await Role.findById(user.role);
        if (!roleDoc) {
            return res.status(404).json({ message: "Role not found" });
        }

        const role = roleDoc.name.toLowerCase();
        const allGroupedUsers = await getGroupedUsersByRole();

        let filteredData = {};

        if (role === "admin") {
            filteredData = allGroupedUsers;
        } else if (role === "principal") {
            filteredData = pickRoles(allGroupedUsers, ["principal", "hod", "faculty", "student"]);
        } else if (role === "hod") {
            filteredData = pickRoles(allGroupedUsers, ["hod", "faculty", "student"]);
        } else if (role === "faculty") {
            filteredData = pickRoles(allGroupedUsers, ["faculty","student"]);
        } else {
            return res.status(403).json({ message: "Unauthorized to access this data" });
        }

        return res.status(200).json(filteredData);
    } catch (error) {
        console.error("Error in getUserData:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const pickRoles = (data, roles) => {
    const result = {};
    for (const role of roles) {
        if (data[role]) {
            result[role] = data[role];
        }
    }
    return result;
};
