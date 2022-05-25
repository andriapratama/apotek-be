import { Sequelize } from "sequelize";
import db from "../../config/database.js";

const { DataTypes } = Sequelize;

const Transaction = db.define(
	"transactions",
	{
		transaction_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		total: { type: DataTypes.INTEGER },
		discount: { type: DataTypes.INTEGER },
		total_discount: { type: DataTypes.INTEGER },
		grand_total: { type: DataTypes.INTEGER },
		payment: { type: DataTypes.INTEGER },
		change_payment: { type: DataTypes.INTEGER },
	},
	{
		freezeTableName: true,
	}
);

export default Transaction;
