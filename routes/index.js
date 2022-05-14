import express from "express";
import {
	createBrandData,
	deleteBrandData,
	findAllBrandData,
	findOneBrandData,
	updateBrandData,
} from "../admins/brands/brand.controller.js";
import {
	createCategoryData,
	deleteCategoryData,
	findAllCategoryData,
	findOneCategoryData,
	updateCategoryData,
} from "../admins/categories/category.controller.js";
import {
	createGroupData,
	deleteGroupData,
	findAllGroupData,
	findOneGroupData,
	updateGroupData,
} from "../admins/groups/group.controller.js";
import {
	createRoleData,
	deleteRoleData,
	findAllRoleData,
	findOneRoleData,
	findRoleDataByName,
	updateRoleData,
} from "../admins/roles/role.controller.js";
import {
	createTypeData,
	deleteTypeData,
	findAllTypeData,
	findOneTypeData,
	updateTypeData,
} from "../admins/types/type.controller.js";

const router = express.Router();

router.post("/role", createRoleData);
router.get("/role", findAllRoleData);
router.get("/role/find", findRoleDataByName);
router.get("/role/:id", findOneRoleData);
router.patch("/role", updateRoleData);
router.delete("/role/:id", deleteRoleData);

router.post("/category", createCategoryData);
router.get("/category", findAllCategoryData);
router.get("/category/:id", findOneCategoryData);
router.patch("/category", updateCategoryData);
router.delete("/category/:id", deleteCategoryData);

router.post("/type", createTypeData);
router.get("/type", findAllTypeData);
router.get("/type/:id", findOneTypeData);
router.patch("/type", updateTypeData);
router.delete("/type/:id", deleteTypeData);

router.post("/group", createGroupData);
router.get("/group", findAllGroupData);
router.get("/group/:id", findOneGroupData);
router.patch("/group", updateGroupData);
router.delete("/group/:id", deleteGroupData);

router.post("/brand", createBrandData);
router.get("/brand", findAllBrandData);
router.get("/brand/:id", findOneBrandData);
router.patch("/brand", updateBrandData);
router.delete("/brand/:id", deleteBrandData);

export default router;
