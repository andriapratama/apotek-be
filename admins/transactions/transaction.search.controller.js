import { responses } from "../../util/response.util.js";
import Transaction from "./transaction.js";
import { Op } from "sequelize";

export const findTransactionDataByDay = async (req, res) => {
	try {
		const day = req.query.day;
		const limit = 10;
		const page = parseInt(req.query.page);
		const min = day + " 00:00:00";
		const max = day + " 23:59:59";

		const start = (page - 1) * limit;
		const end = page * limit;

		const transaction = await Transaction.findAndCountAll({
			where: {
				createdAt: {
					[Op.between]: [min, max],
				},
			},
			order: [["createdAt", "ASC"]],
			limit: limit,
			offset: start,
		});

		const countFilter = transaction.count;
		const pagination = {};

		pagination.totalRow = transaction.count;
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

		return responses(res, 200, "Find transaction data by day", {
			pagination,
			transaction,
		});
	} catch (error) {
		console.log(error);
		return responses(res, 500, "server error");
	}
};

export const findTransactionDataByMonth = async (req, res) => {};

export const findTransactionDataByYear = async (req, res) => {};
