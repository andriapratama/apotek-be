import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Product from "../products/product.js";
import Supplier from "../suppliers/supplier.js";

const { DataTypes } = Sequelize;

const ProductSupplier = db.define(
	"product_suppliers",
	{
		product_supplier_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		product_id: { type: DataTypes.STRING },
		supplier_id: { type: DataTypes.STRING },
		name: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

Product.hasMany(ProductSupplier, { foreignKey: "product_id" });
ProductSupplier.belongsTo(Product, { foreignKey: "product_id" });

Supplier.hasMany(ProductSupplier, { foreignKey: "supplier_id" });
ProductSupplier.belongsTo(Supplier, { foreignKey: "supplier_id" });

export default ProductSupplier;
