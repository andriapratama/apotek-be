import { Validator } from "node-input-validator";
import Brand from "./brand.js";
import { responses } from "../../util/response.util.js";

export const createBrandData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Brand.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundCode = await Brand.findOne({
				order: [["createdAt", "DESC"]],
			});

			if (!foundCode || typeof foundCode === "string") {
				const brand = await Brand.create({
					brand_id: 1,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Brand was created", { brand });
			} else {
				const code = parseInt(foundCode.brand_id);

				const brand = await Brand.create({
					brand_id: code + 1,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Brand was created", { brand });
			}
		} else {
			return responses(res, 400, "Brand name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllBrandData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const brand = await Brand.findAndCountAll({
			limit: limit,
			offset: start,
		});

		const countFilter = brand.count;
		const pagination = {};

		pagination.totalRow = brand.count;
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

		return responses(res, 200, "find all brand data", {
			pagination,
			brand,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneBrandData = async (req, res) => {
	try {
		const foundData = await Brand.findOne({
			where: {
				brand_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			const brand = await Brand.findOne({
				where: {
					brand_id: req.params.id,
				},
			});

			return responses(res, 200, "Find one brand data by id", brand);
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateBrandData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			brandId: "required|string",
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Brand.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundId = await Brand.findOne({
				where: {
					brand_id: req.body.brandId,
				},
			});

			if (!foundId || typeof foundId === "string") {
				return responses(res, 400, "Id is not valid");
			} else {
				await Brand.update(
					{
						name: req.body.name.toLowerCase(),
					},
					{
						where: {
							brand_id: req.body.brandId,
						},
					}
				);

				return responses(res, 200, "Brand name was changed");
			}
		} else {
			return responses(res, 400, "Brand name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteBrandData = async (req, res) => {
	try {
		const foundData = await Brand.findOne({
			where: {
				brand_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Brand.destroy({
				where: {
					brand_id: req.params.id,
				},
			});

			return responses(res, 200, "Brand data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
