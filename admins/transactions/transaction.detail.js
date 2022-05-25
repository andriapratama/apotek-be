import { Sequelize } from "sequelize";
import db from "../../config/database.js";
const { DataTypes } = Sequelize;

const TransactionDetail = db.define(
	"transaction_details",
	{
		transaction_detail_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		transaction_id: { type: DataTypes.STRING },
		product_id: { type: DataTypes.STRING },
		name: { type: DataTypes.STRING },
		quantity: { type: DataTypes.INTEGER },
		discount: { type: DataTypes.INTEGER },
		total_discount: { type: DataTypes.INTEGER },
		sub_total: { type: DataTypes.INTEGER },
	},
	{
		freezeTableName: true,
	}
);

export default TransactionDetail;
