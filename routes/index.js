import express from "express";
import {
	createBrandData,
	deleteBrandData,
	findAllBrandData,
	findBrandDataByName,
	findOneBrandData,
	updateBrandData,
} from "../admins/brands/brand.controller.js";
import {
	createCategoryData,
	deleteCategoryData,
	findAllCategoryData,
	findCategoryDataByName,
	findOneCategoryData,
	updateCategoryData,
} from "../admins/categories/category.controller.js";
import {
	createGroupData,
	deleteGroupData,
	findAllGroupData,
	findGroupDataByName,
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
	createSupplierData,
	deleteSupplierData,
	findAllSupplierData,
	findOneSupplierData,
	findSupplierDataByName,
	updateSupplierData,
} from "../admins/suppliers/supplier.controller.js";
import {
	createTypeData,
	deleteTypeData,
	findAllTypeData,
	findOneTypeData,
	findTypeDataByName,
	updateTypeData,
} from "../admins/types/type.controller.js";
import {
	createUnitData,
	deleteUnitData,
	findAllUnitData,
	findOneUnitData,
	findUnitDataByName,
	updateUnitData,
} from "../admins/units/unit.controller.js";

const router = express.Router();

router.post("/role", createRoleData);
router.get("/role", findAllRoleData);
router.get("/role/find", findRoleDataByName);
router.get("/role/:id", findOneRoleData);
router.patch("/role", updateRoleData);
router.delete("/role/:id", deleteRoleData);

router.post("/category", createCategoryData);
router.get("/category", findAllCategoryData);
router.get("/category/find", findCategoryDataByName);
router.get("/category/:id", findOneCategoryData);
router.patch("/category", updateCategoryData);
router.delete("/category/:id", deleteCategoryData);

router.post("/type", createTypeData);
router.get("/type", findAllTypeData);
router.get("/type/find", findTypeDataByName);
router.get("/type/:id", findOneTypeData);
router.patch("/type", updateTypeData);
router.delete("/type/:id", deleteTypeData);

router.post("/group", createGroupData);
router.get("/group", findAllGroupData);
router.get("/group/find", findGroupDataByName);
router.get("/group/:id", findOneGroupData);
router.patch("/group", updateGroupData);
router.delete("/group/:id", deleteGroupData);

router.post("/brand", createBrandData);
router.get("/brand", findAllBrandData);
router.get("/brand/find", findBrandDataByName);
router.get("/brand/:id", findOneBrandData);
router.patch("/brand", updateBrandData);
router.delete("/brand/:id", deleteBrandData);

router.post("/unit", createUnitData);
router.get("/unit", findAllUnitData);
router.get("/unit/find", findUnitDataByName);
router.get("/unit/:id", findOneUnitData);
router.patch("/unit", updateUnitData);
router.delete("/unit/:id", deleteUnitData);

router.post("/supplier", createSupplierData);
router.get("/supplier", findAllSupplierData);
router.get("/supplier/find", findSupplierDataByName);
router.get("/supplier/:id", findOneSupplierData);
router.patch("/supplier", updateSupplierData);
router.delete("/supplier/:id", deleteSupplierData);

export default router;
