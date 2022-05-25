import { responses } from "../../util/response.util.js";
import moment from "moment";
import Transaction from "./transaction.js";
import TransactionDetail from "./transaction.detail.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Product from "../products/product.js";
import ProductStock from "../detail-products/product.stock.js";

export const findTransactionId = async (req, res) => {
	try {
		const today = moment().format("YYYYMMDD");

		const transaction = await Transaction.findOne({
			where: {
				transaction_id: {
					[Op.like]: "%" + today + "%",
				},
			},
			order: [["createdAt", "DESC"]],
		});

		if (!transaction || typeof transaction === "string") {
			const transactionId = "TS" + today + "001";

			return responses(res, 200, "find transaction id", transactionId);
		} else {
			const id = transaction.transaction_id;
			const filterId = id.split("").splice(0, 2).join("");
			const cleanId = id.replace(filterId, "");
			const newId = parseInt(cleanId);
			const transactionId = "TS" + (newId + 1);

			return responses(res, 200, "find transaction id", transactionId);
		}
	} catch (error) {
		console.log(error);
		return responses(req, 500, "server error");
	}
};

export const createTransactionData = async (req, res) => {
	try {
		const today = moment().format("YYYYMMDD");

		const foundTransactionId = await Transaction.findOne({
			where: {
				transaction_id: {
					[Op.like]: "%" + today + "%",
				},
			},
			order: [["createdAt", "DESC"]],
		});

		let transactionId = "";

		if (!foundTransactionId || typeof foundTransactionId === "string") {
			transactionId = "TS" + today + "001";
		} else {
			const id = foundTransactionId.transaction_id;
			const filterId = id.split("").splice(0, 2).join("");
			const cleanId = id.replace(filterId, "");
			const newId = parseInt(cleanId);
			transactionId = "TS" + (newId + 1);
		}

		await Transaction.create({
			transaction_id: transactionId,
			total: 0,
			discount: 0,
			total_discount: 0,
			grand_total: 0,
			payment: 0,
			change_payment: 0,
		});

		let subTotalTransactionDetail = [];
		const transactionList = req.body.transactionList;
		await transactionList.forEach(async (data) => {
			const subTotal = data.price * data.quantity;
			subTotalTransactionDetail.push(subTotal);

			if (data.discount === 0) {
				const total = subTotal - data.totalDiscount;

				await TransactionDetail.create({
					transaction_detail_id: uuidv4(),
					transaction_id: transactionId,
					product_id: data.productId,
					name: data.name,
					quantity: data.quantity,
					discount: data.discount,
					total_discount: data.totalDiscount,
					sub_total: total,
				});
			} else {
				const totalDiscount = (subTotal * data.discount) / 100;
				const total = subTotal - totalDiscount;
				subTotalTransactionDetail.push(subTotal);

				await TransactionDetail.create({
					transaction_detail_id: uuidv4(),
					transaction_id: transactionId,
					product_id: data.productId,
					name: data.name,
					quantity: data.quantity,
					discount: data.discount,
					total_discount: totalDiscount,
					sub_total: total,
				});
			}

			const product = await Product.findOne({
				where: {
					product_id: data.productId,
				},
			});

			await Product.update(
				{
					stock: product.stock - data.quantity,
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
				status: 2,
				description: "Sales transaction",
				transaction_code: transactionId,
			});
		});

		const sumTotalDetail = subTotalTransactionDetail.reduce(
			(prev, curr) => prev + curr,
			0
		);

		if (req.body.grandDiscount === 0) {
			const grandTotal = sumTotalDetail - req.body.grandTotalDiscount;
			const changePayment = req.body.payment - grandTotal;

			await Transaction.update(
				{
					total: sumTotalDetail,
					discount: req.body.grandDiscount,
					total_discount: req.body.grandTotalDiscount,
					grand_total: grandTotal,
					payment: req.body.payment,
					change_payment: changePayment,
				},
				{
					where: {
						transaction_id: transactionId,
					},
				}
			);
		} else {
			const grandTotalDiscount =
				(sumTotalDetail * req.body.grandDiscount) / 100;
			const grandTotal = sumTotalDetail - grandTotalDiscount;
			const changePayment = req.body.payment - grandTotal;

			await Transaction.update(
				{
					total: sumTotalDetail,
					discount: req.body.grandDiscount,
					total_discount: grandTotalDiscount,
					grand_total: grandTotal,
					payment: req.body.payment,
					change_payment: changePayment,
				},
				{
					where: {
						transaction_id: transactionId,
					},
				}
			);
		}

		return responses(res, 200, "success store transaction", req.body);
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
