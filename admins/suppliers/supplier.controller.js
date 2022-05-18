import { Validator } from "node-input-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Supplier from "./supplier.js";
import { responses } from "../../util/response.util.js";

export const createSupplierData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
			phone: "required|string",
			address: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Supplier.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const supplier = await Supplier.create({
				supplier_id: uuidv4(),
				name: req.body.name,
				phone: req.body.phone,
				address: req.body.address,
			});

			return responses(res, 200, "Supplier was created", { supplier });
		} else {
			return responses(res, 400, "Supplier name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllSupplierData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const supplier = await Supplier.findAndCountAll({
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = supplier.count;
		const pagination = {};

		pagination.totalRow = supplier.count;
		pagination.totalPage = Math.ceil(countFilter / limit);

		if (end < countFilter) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		} else if (start > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}

		return responses(res, 200, "find all supplier data", {
			pagination,
			supplier,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findSupplierDataByName = async (req, res) => {
	try {
		const search = req.query.search;

		const supplier = await Supplier.findAll({
			where: {
				name: {
					[Op.like]: "%" + search + "%",
				},
			},
			order: [["name", "ASC"]],
			limit: 10,
		});

		return responses(res, 200, "Find supplier data by name", { supplier });
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneSupplierData = async (req, res) => {
	try {
		const foundData = await Supplier.findOne({
			where: {
				supplier_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			const supplier = await Supplier.findOne({
				where: {
					supplier_id: req.params.id,
				},
			});

			return responses(res, 200, "Find one supplier data by id", supplier);
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateSupplierData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			supplierId: "required|string",
			name: "required|string",
			phone: "required|string",
			address: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}
		const foundId = await Supplier.findOne({
			where: {
				supplier_id: req.body.supplierId,
			},
		});

		if (!foundId || typeof foundId === "string") {
			return responses(res, 400, "Id is not valid");
		} else {
			await Supplier.update(
				{
					name: req.body.name,
					phone: req.body.phone,
					address: req.body.address,
				},
				{
					where: {
						supplier_id: req.body.supplierId,
					},
				}
			);

			return responses(res, 200, "Supplier data was changed");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteSupplierData = async (req, res) => {
	try {
		const foundData = await Supplier.findOne({
			where: {
				supplier_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Supplier.destroy({
				where: {
					supplier_id: req.params.id,
				},
			});

			return responses(res, 200, "Supplier data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
