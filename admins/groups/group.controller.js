import { Validator } from "node-input-validator";
import Group from "./group.js";
import { responses } from "../../util/response.util.js";

export const createGroupData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Group.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundCode = await Group.findOne({
				order: [["createdAt", "DESC"]],
			});

			if (!foundCode || typeof foundCode === "string") {
				const group = await Group.create({
					group_id: 31,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Group was created", { group });
			} else {
				const code = parseInt(foundCode.group_id);

				const group = await Group.create({
					group_id: code + 1,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Group was created", { group });
			}
		} else {
			return responses(res, 400, "Group name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllGroupData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const group = await Group.findAndCountAll({
			limit: limit,
			offset: start,
		});

		const countFilter = group.count;
		const pagination = {};

		pagination.totalRow = group.count;
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

		return responses(res, 200, "find all group data", {
			pagination,
			group,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneGroupData = async (req, res) => {
	try {
		const foundData = await Group.findOne({
			where: {
				group_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			const group = await Group.findOne({
				where: {
					group_id: req.params.id,
				},
			});

			return responses(res, 200, "Find one group data by id", group);
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateGroupData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			groupId: "required|string",
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Group.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundId = await Group.findOne({
				where: {
					group_id: req.body.groupId,
				},
			});

			if (!foundId || typeof foundId === "string") {
				return responses(res, 400, "Id is not valid");
			} else {
				await Group.update(
					{
						name: req.body.name.toLowerCase(),
					},
					{
						where: {
							group_id: req.body.groupId,
						},
					}
				);

				return responses(res, 200, "Group name was changed");
			}
		} else {
			return responses(res, 400, "Group name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteGroupData = async (req, res) => {
	try {
		const foundData = await Group.findOne({
			where: {
				group_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Group.destroy({
				where: {
					group_id: req.params.id,
				},
			});

			return responses(res, 200, "Group data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
