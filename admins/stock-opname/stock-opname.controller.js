import { v4 as uuidv4 } from "uuid";
import { responses } from "../../util/response.util.js";
import StockOpname from "./stock-opname.js";
import StockOpnameDetail from "./stock-opname.detail.js";
import Product from "../products/product.js";
import ProductStock from "../detail-products/product.stock.js";
import Unit from "../units/unit.js";
import moment from "moment";
import { Op } from "sequelize";

export const createSotckOpnameData = async (req, res) => {
	try {
		const today = moment().format("YYYYMMDD");

		const foundId = await StockOpname.findOne({
			where: {
				stock_opname_id: {
					[Op.like]: "%" + today + "%",
				},
			},
			order: [["createdAt", "DESC"]],
		});

		let stockOpnameId = "";

		if (!foundId || typeof foundId === "string") {
			stockOpnameId = "SO" + today + "001";
		} else {
			const id = foundId.stock_opname_id;
			const filterId = id.split("").splice(0, 2).join("");
			const cleanId = id.replace(filterId, "");
			const newId = parseInt(cleanId);
			stockOpnameId = "SO" + (newId + 1);
		}

		await StockOpname.create({
			stock_opname_id: stockOpnameId,
			operator: req.body.operator,
			note: req.body.note,
		});

		const transactionList = req.body.transactionList;
		await transactionList.forEach(async (data) => {
			await StockOpnameDetail.create({
				stock_opname_detail_id: uuidv4(),
				stock_opname_id: stockOpnameId,
				product_id: data.productId,
				stock: data.stock,
				real_stock: data.quantity,
				difference: data.quantity - data.stock,
			});

			await Product.update(
				{
					stock: data.quantity,
				},
				{
					where: {
						product_id: data.productId,
					},
				}
			);

			await ProductStock.create({
				product_stock_id: uuidv4(),
				product_id: data.productId,
				stock: data.quantity,
				status: 0,
				description: "Stock opname",
				transaction_code: stockOpnameId,
			});
		});

		return responses(res, 200, "success store stock opname");
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findAllStockOpnameData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const stockOpname = await StockOpname.findAndCountAll({
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = stockOpname.count;
		const pagination = {};

		pagination.totalRow = stockOpname.count;
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

		return responses(res, 200, "find all stock opname data", {
			pagination,
			stockOpname,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOneStockOpnameData = async (req, res) => {
	try {
		const stockOpname = await StockOpname.findOne({
			where: {
				stock_opname_id: req.params.id,
			},
		});

		const stockOpnameDetail = await StockOpnameDetail.findAll({
			include: [
				{
					model: Product,
					attributes: ["name", "unit_id"],
					include: [{ model: Unit, attributes: ["name"] }],
				},
			],
			where: {
				stock_opname_id: req.params.id,
			},
		});

		return responses(res, 200, "success find one stock opname data", {
			stockOpname,
			stockOpnameDetail,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
