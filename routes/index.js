import express from "express";
import {
	createCategoryData,
	deleteCategoryData,
	findAllCategoryData,
	findOneCategoryData,
	updateCategoryData,
} from "../admins/categories/category.controller.js";
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

router.post("/category", createCategoryData);
router.get("/category", findAllCategoryData);
router.get("/category/:id", findOneCategoryData);
router.patch("/category", updateCategoryData);
router.delete("/category/:id", deleteCategoryData);

export default router;
