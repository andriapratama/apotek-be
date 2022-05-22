import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Product from "../products/product.js";
import Type from "../types/type.js";

const { DataTypes } = Sequelize;

const ProductType = db.define(
	"product_types",
	{
		product_type_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		product_id: { type: DataTypes.STRING },
		type_id: { type: DataTypes.STRING },
		name: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

Product.hasMany(ProductType, { foreignKey: "product_id" });
ProductType.belongsTo(Product, { foreignKey: "product_id" });

Type.hasMany(ProductType, { foreignKey: "type_id" });
ProductType.belongsTo(Type, { foreignKey: "type_id" });

export default ProductType;
