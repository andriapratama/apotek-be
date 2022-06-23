import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Product from "../products/product.js";
import Purchasing from "./purchasing.js";

const { DataTypes } = Sequelize;

const PurchasingDetail = db.define(
	"purchasing_details",
	{
		purchasing_detail_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		purchasing_id: { type: DataTypes.STRING },
		product_id: { type: DataTypes.STRING },
		leftover_stock: { type: DataTypes.INTEGER },
		stock_in: { type: DataTypes.INTEGER },
	},
	{
		freezeTableName: true,
	}
);

Product.hasMany(PurchasingDetail, { foreignKey: "product_id" });
PurchasingDetail.belongsTo(Product, { foreignKey: "product_id" });

Purchasing.hasMany(PurchasingDetail, { foreignKey: "purchasing_id" });
PurchasingDetail.belongsTo(Purchasing, { foreignKey: "purchasing_id" });

export default PurchasingDetail;
