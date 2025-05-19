import express from 'express';
import Role from '../models/role.model.js';
import User from '../models/user.model.js';
import Branch from '../models/branch.model.js';

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

        for (const role of roles) {
            const users = await User.find({ role: role._id })
                .populate("role")
                .select("-password");

            groupedUsers[role.name.toLowerCase()] = users;
        }

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

/**
 * GET /user-data - Get filtered users based on requester's role and branch
 */
export const getUserData = async (req, res) => {
    const { user } = req;

    try {
        const roleDoc = await Role.findById(user.role);
        if (!roleDoc) {
            return res.status(404).json({ message: "Role not found" });
        }

        const branchDoc = await Branch.findById(user.branch); // ✅ Fixed here
        if (!branchDoc) {
            return res.status(404).json({ message: "Branch not found" });
        }

        const role = roleDoc.name.toLowerCase();
        const userBranch = branchDoc.name.toLowerCase();

        const allGroupedUsers = await getGroupedUsersByRole();

        let filteredData = {};

        if (role === "admin") {
            filteredData = allGroupedUsers;
        } else if (role === "principal") {
            filteredData = pickRoles(allGroupedUsers, ["principal", "hod", "faculty", "student"]);
        } else if (role === "hod") {
            filteredData = filterByBranch(allGroupedUsers, ["hod", "faculty", "student"], userBranch);
        } else if (role === "faculty") {
            filteredData = filterByBranch(allGroupedUsers, ["faculty","student"], userBranch);
        } else {
            return res.status(403).json({ message: "Unauthorized to access this data" });
        }

        return res.status(200).json(filteredData);
    } catch (error) {
        console.error("Error in getUserData:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Pick roles without filtering by branch
const pickRoles = (data, roles) => {
    const result = {};
    for (const role of roles) {
        if (data[role]) {
            result[role] = data[role];
        }
    }
    return result;
};

// Filter users by their branch
const filterByBranch = (data, roles, branch) => {
    const result = {};
    for (const role of roles) {
        if (data[role]) {
            result[role] = data[role].filter(user => user.branch?.toLowerCase() === branch);
        }
    }
    return result;
};
