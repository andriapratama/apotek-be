import { Validator } from "node-input-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Location from "./location.js";
import { responses } from "../../util/response.util.js";

export const createLocationData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Location.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const location = await Location.create({
				location_id: uuidv4(),
				name: req.body.name.toLowerCase(),
			});

			return responses(res, 200, "Location was created", { location });
		} else {
			return responses(res, 400, "Location name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllLocationData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const location = await Location.findAndCountAll({
			order: [["createdAt", "ASC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = location.count;
		const pagination = {};

		pagination.totalRow = location.count;
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

		return responses(res, 200, "find all location data", {
			pagination,
			location,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findLocationDataByName = async (req, res) => {
	try {
		const search = req.query.search;

		const location = await Location.findAll({
			where: {
				name: {
					[Op.like]: "%" + search + "%",
				},
			},
			order: [["name", "ASC"]],
			limit: 10,
		});

		return responses(res, 200, "Find location data by name", { location });
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneLocationData = async (req, res) => {
	try {
		const foundData = await Location.findOne({
			where: {
				location_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			const location = await Location.findOne({
				where: {
					location_id: req.params.id,
				},
			});

			return responses(res, 200, "Find one location data by id", location);
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateLocationData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			locationId: "required|string",
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Location.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundId = await Location.findOne({
				where: {
					location_id: req.body.locationId,
				},
			});

			if (!foundId || typeof foundId === "string") {
				return responses(res, 400, "Id is not valid");
			} else {
				await Location.update(
					{
						name: req.body.name.toLowerCase(),
					},
					{
						where: {
							location_id: req.body.locationId,
						},
					}
				);
			}

			return responses(res, 200, "Location name was changed");
		} else {
			return responses(res, 400, "Location name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteLocationData = async (req, res) => {
	try {
		const foundData = await Location.findOne({
			where: {
				location_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Location.destroy({
				where: {
					location_id: req.params.id,
				},
			});

			return responses(res, 200, "Location data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
