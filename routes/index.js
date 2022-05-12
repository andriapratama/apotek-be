import express from "express";
import {
	createRoleData,
	deleteRoleData,
	findAllRoleData,
	findOneRoleData,
	updateRoleData,
} from "../admins/roles/role.controller.js";

const router = express.Router();

router.post("/role", createRoleData);
router.get("/role", findAllRoleData);
router.get("/role/:id", findOneRoleData);
router.patch("/role", updateRoleData);
router.delete("/role/:id", deleteRoleData);

export default router;
