import { Validator } from "node-input-validator";
import Type from "./type.js";
import { responses } from "../../util/response.util.js";

export const createTypeData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Type.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundCode = await Type.findOne({
				order: [["createdAt", "DESC"]],
			});

			if (!foundCode || typeof foundCode === "string") {
				const type = await Type.create({
					type_id: 221,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Type was created", { type });
			} else {
				const code = parseInt(foundCode.type_id);

				const type = await Type.create({
					type_id: code + 1,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Type was created", { type });
			}
		} else {
			return responses(res, 400, "Type name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllTypeData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const type = await Type.findAndCountAll({
			limit: limit,
			offset: start,
		});

		const countFilter = type.count;
		const pagination = {};

		pagination.totalRow = type.count;
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

		return responses(res, 200, "find all type data", {
			pagination,
			type,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneTypeData = async (req, res) => {
	try {
		const type = await Type.findOne({
			where: {
				type_id: req.params.id,
			},
		});

		return responses(res, 200, "Find one type data by id", type);
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateTypeData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			typeId: "required|string",
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Type.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			await Type.update(
				{
					name: req.body.name,
				},
				{
					where: {
						type_id: req.body.typeId,
					},
				}
			);

			return responses(res, 200, "Type name was changed");
		} else {
			return responses(res, 400, "Type name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteTypeData = async (req, res) => {
	try {
		const foundData = await Type.findOne({
			where: {
				type_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Type.destroy({
				where: {
					type_id: req.params.id,
				},
			});

			return responses(res, 200, "Type data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
