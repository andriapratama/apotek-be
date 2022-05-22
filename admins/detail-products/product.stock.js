import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Product from "../products/product.js";

const { DataTypes } = Sequelize;

const ProductStock = db.define(
	"product_stocks",
	{
		product_stock_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		product_id: { type: DataTypes.STRING },
		stock: { type: DataTypes.INTEGER },
		status: { type: DataTypes.INTEGER },
		description: { type: DataTypes.STRING },
		transaction_code: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

Product.hasMany(ProductStock, { foreignKey: "product_id" });
ProductStock.belongsTo(Product, { foreignKey: "product_id" });

export default ProductStock;
