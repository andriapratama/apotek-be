import { Validator } from "node-input-validator";
import { v4 as uuidv4 } from "uuid";
import Role from "./role.js";
import { responses } from "../../util/response.util.js";

export const createRoleData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Role.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const role = await Role.create({
				role_id: uuidv4(),
				name: req.body.name.toLowerCase(),
			});

			return responses(res, 200, "Role was created", { role });
		} else {
			return responses(res, 400, "Role name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllRoleData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const role = await Role.findAndCountAll({
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = role.count;
		const pagination = {};

		pagination.totalRow = role.count;
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

		return responses(res, 200, "find all role data", {
			pagination,
			role,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneRoleData = async (req, res) => {
	try {
		const role = await Role.findOne({
			where: {
				role_id: req.params.id,
			},
		});

		return responses(res, 200, "Find one role data by id", role);
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateRoleData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			roleId: "required|string",
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Role.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			await Role.update(
				{
					name: req.body.name,
				},
				{
					where: {
						role_id: req.body.roleId,
					},
				}
			);

			return responses(res, 200, "Role name was changed");
		} else {
			return responses(res, 400, "Role name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteRoleData = async (req, res) => {
	try {
		const foundData = await Role.findOne({
			where: {
				role_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Role.destroy({
				where: {
					role_id: req.params.id,
				},
			});

			return responses(res, 200, "Role data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
