import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import StockOpname from "./stock-opname.js";
import Product from "../products/product.js";

const { DataTypes } = Sequelize;

const StockOpnameDetail = db.define(
	"stock_opname_detail",
	{
		stock_opname_detail_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		stock_opname_id: { type: DataTypes.STRING },
		product_id: { type: DataTypes.STRING },
		stock: { type: DataTypes.INTEGER },
		real_stock: { type: DataTypes.INTEGER },
		difference: { type: DataTypes.INTEGER },
	},
	{
		freezeTableName: true,
	}
);

Product.hasMany(StockOpnameDetail, { foreignKey: "product_id" });
StockOpnameDetail.belongsTo(Product, { foreignKey: "product_id" });

StockOpname.hasMany(StockOpnameDetail, { foreignKey: "stock_opname_id" });
StockOpnameDetail.belongsTo(StockOpname, { foreignKey: "stock_opname_id" });

export default StockOpnameDetail;
