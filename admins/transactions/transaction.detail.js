import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Transaction from "./transaction.js";
import Product from "../products/product.js";

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

Product.hasMany(TransactionDetail, { foreignKey: "product_id" });
TransactionDetail.belongsTo(Product, { foreignKey: "product_id" });

Transaction.hasMany(TransactionDetail, { foreignKey: "transaction_id" });
TransactionDetail.belongsTo(Transaction, { foreignKey: "transaction_id" });

export default TransactionDetail;
