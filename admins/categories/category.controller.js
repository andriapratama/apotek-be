import { Validator } from "node-input-validator";
import Category from "./category.js";
import { responses } from "../../util/response.util.js";

export const createCategoryData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Category.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundCode = await Category.findOne({
				order: [["createdAt", "DESC"]],
			});

			if (!foundCode || typeof foundCode === "string") {
				const category = await Category.create({
					category_id: 11,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Category was created", { category });
			} else {
				const code = parseInt(foundCode.category_id);

				const category = await Category.create({
					category_id: code + 1,
					name: req.body.name.toLowerCase(),
				});

				return responses(res, 200, "Category was created", { category });
			}
		} else {
			return responses(res, 400, "Category name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllCategoryData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const category = await Category.findAndCountAll({
			limit: limit,
			offset: start,
		});

		const countFilter = category.count;
		const pagination = {};

		pagination.totalRow = category.count;
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

		return responses(res, 200, "find all category data", {
			pagination,
			category,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findCategoryDataByName = async (req, res) => {
	try {
		const search = req.query.search;

		const category = await Category.findAll({
			where: {
				name: {
					[Op.like]: "%" + search + "%",
				},
			},
			order: [["name", "ASC"]],
			limit: 10,
		});

		return responses(res, 200, "Find category data by name", { category });
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneCategoryData = async (req, res) => {
	try {
		const foundData = await Category.findOne({
			where: {
				category_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			const category = await Category.findOne({
				where: {
					category_id: req.params.id,
				},
			});

			return responses(res, 200, "Find one category data by id", category);
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const updateCategoryData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			categoryId: "required|string",
			name: "required|string",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { errors: validator.errors });
		}

		const foundName = await Category.findOne({
			where: {
				name: req.body.name,
			},
		});

		if (!foundName || typeof foundName === "string") {
			const foundId = await Category.findOne({
				where: {
					category_id: req.body.categoryId,
				},
			});

			if (!foundId || typeof foundId === "string") {
				return responses(res, 400, "Id is not valid");
			} else {
				await Category.update(
					{
						name: req.body.name,
					},
					{
						where: {
							category_id: req.body.categoryId,
						},
					}
				);

				return responses(res, 200, "Category name was changed");
			}
		} else {
			return responses(res, 400, "Category name already used");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const deleteCategoryData = async (req, res) => {
	try {
		const foundData = await Category.findOne({
			where: {
				category_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			await Category.destroy({
				where: {
					category_id: req.params.id,
				},
			});

			return responses(res, 200, "Category data was deleted");
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
