import { Validator } from "node-input-validator";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { responses } from "../../util/response.util.js";
import Category from "../categories/category.js";
import Group from "../groups/group.js";
import Unit from "../units/unit.js";
import Brand from "../brands/brand.js";
import Location from "../locations/location.js";
import Supplier from "../suppliers/supplier.js";
import Type from "../types/type.js";
import Product from "./product.js";
import ProductLocation from "../detail-products/product.location.js";
import ProductSupplier from "../detail-products/product.supplier.js";
import ProductType from "../detail-products/product.type.js";
import ProductPrice from "../detail-products/product.prices.js";
import ProductStock from "../detail-products/product.stock.js";

export const createProductData = async (req, res) => {
	try {
		const validator = new Validator(req.body, {
			name: "required|string",
			category: "required|string",
			group: "required|string",
			unit: "required|string",
			brand: "required|string",
			location: "required|array",
			type: "required|array",
			supplier: "required|array",
			stock: "required|integer",
			stockMin: "required|integer",
			sellingPrice: "required|integer",
			purchasePrice: "required|integer",
		});

		const check = await validator.check();
		if (!check) {
			return responses(res, 400, { error: validator.errors });
		}

		const category = await Category.findOne({
			where: {
				name: req.body.category,
			},
		});

		const group = await Group.findOne({
			where: {
				name: req.body.group,
			},
		});

		const unit = await Unit.findOne({
			where: {
				name: req.body.unit,
			},
		});

		const brand = await Brand.findOne({
			where: {
				name: req.body.brand,
			},
		});

		const customId = "OBT" + category.category_id + group.group_id;
		const foundProductId = await Product.findOne({
			where: {
				product_id: {
					[Op.like]: "%" + customId + "%",
				},
			},
			order: [["createdAt", "DESC"]],
		});

		const foundProduct = await Product.findOne({
			where: {
				name: req.body.name,
				category_id: category.category_id,
				group_id: group.group_id,
				brand_id: brand.brand_id,
			},
		});

		let product = null;

		if (!foundProduct || typeof foundProduct === "string") {
			if (!foundProductId || typeof foundProductId === "string") {
				product = await Product.create({
					product_id: customId + "001",
					name: req.body.name,
					category_id: category.category_id,
					group_id: group.group_id,
					unit_id: unit.unit_id,
					brand_id: brand.brand_id,
					stock: req.body.stock,
					stock_min: req.body.stockMin,
					selling_price: req.body.sellingPrice,
					purchase_price: req.body.purchasePrice,
				});
			} else {
				const productId = foundProductId.product_id;
				const filterId = productId.split("").splice(0, 3).join("");
				const cleanId = productId.replace(filterId, "");
				const newId = parseInt(cleanId);

				product = await Product.create({
					product_id: "OBT" + (newId + 1),
					name: req.body.name,
					category_id: category.category_id,
					group_id: group.group_id,
					unit_id: unit.unit_id,
					brand_id: brand.brand_id,
					stock: req.body.stock,
					stock_min: req.body.stockMin,
					selling_price: req.body.sellingPrice,
					purchase_price: req.body.purchasePrice,
				});
			}
		} else {
			return responses(res, 400, "Product was ready used");
		}

		const locationList = req.body.location;
		locationList.forEach(async (data) => {
			const location = await Location.findOne({
				where: {
					name: data,
				},
			});

			await ProductLocation.create({
				product_location_id: uuidv4(),
				product_id: product.product_id,
				location_id: location.location_id,
				name: location.name,
			});
		});

		const supplierList = req.body.supplier;
		supplierList.forEach(async (data) => {
			const supplier = await Supplier.findOne({
				where: {
					name: data,
				},
			});

			await ProductSupplier.create({
				product_supplier_id: uuidv4(),
				product_id: product.product_id,
				supplier_id: supplier.supplier_id,
				name: supplier.name,
			});
		});

		const typeList = req.body.type;
		typeList.forEach(async (data) => {
			const type = await Type.findOne({
				where: {
					name: data,
				},
			});

			await ProductType.create({
				product_type_id: uuidv4(),
				product_id: product.product_id,
				type_id: type.type_id,
				name: type.name,
			});
		});

		await ProductPrice.create({
			product_price_id: uuidv4(),
			product_id: product.product_id,
			selling_price: req.body.sellingPrice,
			purchase_price: req.body.purchasePrice,
			note: "first add product",
		});

		await ProductStock.create({
			product_stock_id: uuidv4(),
			product_id: product.product_id,
			stock: req.body.stock,
			status: 0,
			description: "first add product",
			transaction_code: null,
		});

		return responses(res, 200, "Product was created", { product });
	} catch (error) {
		console.log(error);
		return responses(res, 400, "server error");
	}
};

export const findAllProductData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const product = await Product.findAndCountAll({
			include: [
				{ model: Category, attributes: ["name"] },
				{ model: Group, attributes: ["name"] },
				{ model: Unit, attributes: ["name"] },
				{ model: Brand, attributes: ["name"] },
				{ model: ProductLocation, attributes: ["name"] },
				{ model: ProductSupplier, attributes: ["name"] },
			],
			order: [["name", "ASC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = product.count;
		const pagination = {};

		pagination.totalRow = product.count;
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

		return responses(res, 200, "find all product data", {
			pagination,
			product,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findProductDataByName = async (req, res) => {
	try {
		const search = req.query.search;

		const product = await Product.findAll({
			include: [
				{ model: Category, attributes: ["name"] },
				{ model: Group, attributes: ["name"] },
				{ model: Unit, attributes: ["name"] },
				{ model: Brand, attributes: ["name"] },
				{ model: ProductLocation, attributes: ["name"] },
				{ model: ProductSupplier, attributes: ["name"] },
			],
			where: {
				name: {
					[Op.like]: "%" + search + "%",
				},
			},
			order: [["name", "ASC"]],
			limit: 10,
		});

		return responses(res, 200, "Find product data by name", { product });
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneProductData = async (req, res) => {
	try {
		const foundData = await Product.findOne({
			where: {
				product_id: req.params.id,
			},
		});

		if (!foundData || typeof foundData === "string") {
			return responses(res, 400, "Data is not valid");
		} else {
			const product = await Product.findOne({
				include: [
					{ model: Category, attributes: ["name"] },
					{ model: Group, attributes: ["name"] },
					{ model: Unit, attributes: ["name"] },
					{ model: Brand, attributes: ["name"] },
					{ model: ProductLocation, attributes: ["name"] },
					{ model: ProductSupplier, attributes: ["name"] },
					{ model: ProductType, attributes: ["name"] },
				],
				where: {
					product_id: req.params.id,
				},
			});

			return responses(res, 200, "find one product data by id", { product });
		}
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllProductStockData = async (req, res) => {
	try {
		const limit = 5;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const stock = await ProductStock.findAndCountAll({
			where: {
				product_id: req.params.id,
			},
			order: [["createdAt", "ASC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = stock.count;
		const pagination = {};

		pagination.totalRow = stock.count;
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

		return responses(res, 200, "find all product stock", {
			pagination,
			stock,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllProductPriceData = async (req, res) => {
	try {
		const limit = 5;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const price = await ProductPrice.findAndCountAll({
			where: {
				product_id: req.params.id,
			},
			order: [["createdAt", "ASC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = price.count;
		const pagination = {};

		pagination.totalRow = price.count;
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

		return responses(res, 200, "find all product price", {
			pagination,
			price,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
