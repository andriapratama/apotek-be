import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Product from "../products/product.js";

const { DataTypes } = Sequelize;

const ProductPrice = db.define(
	"product_prices",
	{
		product_price_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		product_id: { type: DataTypes.STRING },
		selling_price: { type: DataTypes.INTEGER },
		purchase_price: { type: DataTypes.INTEGER },
		note: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

Product.hasMany(ProductPrice, { foreignKey: "product_id" });
ProductPrice.belongsTo(Product, { foreignKey: "product_id" });

export default ProductPrice;
