import { Validator } from "node-input-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Unit from "./unit.js";
import { responses } from "../../util/response.util.js";

export const createUnitData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Unit.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const unit = await Unit.create({
				unit_id: uuidv4(),
				name: req.body.name.toLowerCase(),
			});

			return responses(res, 200, "Unit was created", { unit });
		} else {
			return responses(res, 400, "Unit name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllUnitData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const unit = await Unit.findAndCountAll({
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = unit.count;
		const pagination = {};

		pagination.totalRow = unit.count;
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

		return responses(res, 200, "find all unit data", {
			pagination,
			unit,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findUnitDataByName = async (req, res) => {
	try {
		const search = req.query.search;

		const unit = await Unit.findAll({
			where: {
				name: {
					[Op.like]: "%" + search + "%",
				},
			},
			order: [["name", "ASC"]],
			limit: 10,
		});

		return responses(res, 200, "Find unit data by name", { unit });
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneUnitData = async (req, res) => {
	try {
		const foundData = await Unit.findOne({
			where: {
				unit_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			const unit = await Unit.findOne({
				where: {
					unit_id: req.params.id,
				},
			});

			return responses(res, 200, "Find one unit data by id", unit);
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateUnitData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			unitId: "required|string",
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Unit.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundId = await Unit.findOne({
				where: {
					unit_id: req.body.unitId,
				},
			});

			if (!foundId || typeof foundId === "string") {
				return responses(res, 400, "Id is not valid");
			} else {
				await Unit.update(
					{
						name: req.body.name.toLowerCase(),
					},
					{
						where: {
							unit_id: req.body.unitId,
						},
					}
				);
			}

			return responses(res, 200, "Unit name was changed");
		} else {
			return responses(res, 400, "Unit name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteUnitData = async (req, res) => {
	try {
		const foundData = await Unit.findOne({
			where: {
				unit_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Unit.destroy({
				where: {
					unit_id: req.params.id,
				},
			});

			return responses(res, 200, "Unit data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
