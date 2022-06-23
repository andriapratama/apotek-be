import { v4 as uuidv4 } from "uuid";
import { responses } from "../../util/response.util.js";
import Purchasing from "./purchasing.js";
import PurchasingDetail from "./purchasing.detail.js";
import ProductStock from "../detail-products/product.stock.js";
import moment from "moment";
import { Op } from "sequelize";
import Product from "../products/product.js";
import Unit from "../units/unit.js";

export const createPurchasingData = async (req, res) => {
	// return responses(res, 200, "masuk", req.body);
	try {
		const today = moment().format("YYYYMMDD");

		const foundId = await Purchasing.findOne({
			where: {
				purchasing_id: {
					[Op.like]: "%" + today + "%",
				},
			},
			order: [["createdAt", "DESC"]],
		});

		let purchasingId = "";

		if (!foundId || typeof foundId === "string") {
			purchasingId = "PR" + today + "001";
		} else {
			const id = foundId.purchasing_id;
			const filterId = id.split("").splice(0, 2).join("");
			const cleanId = id.replace(filterId, "");
			const newId = parseInt(cleanId);
			purchasingId = "PR" + (newId + 1);
		}

		const purchasing = await Purchasing.create({
			purchasing_id: purchasingId,
			operator: req.body.operator,
			note: req.body.note,
		});

		const transacitonList = req.body.transactionList;
		await transacitonList.forEach(async (data) => {
			await PurchasingDetail.create({
				purchasing_detail_id: uuidv4(),
				purchasing_id: purchasingId,
				product_id: data.productId,
				leftover_stock: data.stock,
				stock_in: data.quantity,
			});

			const product = await Product.findOne({
				where: {
					product_id: data.productId,
				},
			});

			await Product.update(
				{
					stock: product.stock + data.quantity,
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
				status: 1,
				description: "Incoming product",
				transaction_code: purchasingId,
			});
		});

		return responses(res, 200, "success store purchasing product");
	} catch (error) {
		console.log(error);
		return responses(res, 400, "server error");
	}
};

export const findAllPurchasingData = async (req, res) => {
	try {
		const limit = 10;
		const page = parseInt(req.query.page);

		const start = (page - 1) * limit;
		const end = page * limit;

		const purchasing = await Purchasing.findAndCountAll({
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = purchasing.count;
		const pagination = {};

		pagination.totalRow = purchasing.count;
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

		return responses(res, 200, "find all purchasing data", {
			pagination,
			purchasing,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findOnePurchasingData = async (req, res) => {
	try {
		const purchasing = await Purchasing.findOne({
			where: {
				purchasing_id: req.params.id,
			},
		});

		const purchasingDetail = await PurchasingDetail.findAll({
			include: [
				{
					model: Product,
					attributes: ["name", "unit_id"],
					include: [{ model: Unit, attributes: ["name"] }],
				},
			],
			where: {
				purchasing_id: req.params.id,
			},
		});

		return responses(res, 200, "success find purchasing data by id", {
			purchasing,
			purchasingDetail,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
