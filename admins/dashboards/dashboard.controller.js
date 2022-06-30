import { responses } from "../../util/response.util.js";
import moment from "moment";
import db from "../../config/database.js";

const today = moment().format("YYYY-MM-DD");

const min = today + " 00:00:00";
const max = today + " 23:59:59";

export const findTotalTransactionToday = async (req, res) => {
	try {
		const transaction = await db.query(`SELECT transaction_id 
		FROM transactions
		WHERE createdAt BETWEEN "${min}" AND "${max}" 
		`);

		const total = transaction[0].length;

		return responses(
			res,
			200,
			"successfully found all the total transactions today",
			total
		);
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findTotalProductSoldToday = async (req, res) => {
	try {
		const product = await db.query(
			`SELECT SUM(quantity) as total 
			FROM transaction_details
			WHERE transaction_details.createdAt BETWEEN "${min}" AND "${max}" 
		`
		);

		let total = 0;

		product[0].map((value) => {
			total = value.total;
		});

		return responses(
			res,
			200,
			"successfully found total product sold today",
			total
		);
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findTotalIncomeToday = async (req, res) => {
	try {
		const income = await db.query(
			`SELECT SUM(grand_total) as total 
			From transactions
			WHERE transactions.createdAt BETWEEN "${min}" AND "${max}" 
			`
		);

		let total = 0;

		income[0].map((value) => {
			total = value.total;
		});

		return responses(res, 200, "successfully found total income today", total);
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findTotalOfAllProductSoldToday = async (req, res) => {
	try {
		const data = await db.query(
			`SELECT products.name, SUM(transaction_details.quantity) as total_quantity 
			FROM products 
			INNER JOIN transaction_details 
			ON transaction_details.product_id = products.product_id 
			WHERE transaction_details.createdAt BETWEEN "${min}" AND "${max}" 
			GROUP BY products.name 
			ORDER BY SUM(transaction_details.quantity) DESC
			LIMIT 10`
		);

		return responses(
			res,
			200,
			"successfully found total all product sold today",
			data[0]
		);
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};
