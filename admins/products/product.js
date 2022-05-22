import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Category from "../categories/category.js";
import Group from "../groups/group.js";
import Unit from "../units/unit.js";
import Brand from "../brands/brand.js";

const { DataTypes } = Sequelize;

const Product = db.define(
	"products",
	{
		product_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING },
		category_id: { type: DataTypes.STRING },
		group_id: { type: DataTypes.STRING },
		unit_id: { type: DataTypes.STRING },
		brand_id: { type: DataTypes.STRING },
		stock: { type: DataTypes.INTEGER },
		stock_min: { type: DataTypes.INTEGER },
		selling_price: { type: DataTypes.INTEGER },
		purchase_price: { type: DataTypes.INTEGER },
	},
	{
		freezeTableName: true,
	}
);

Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

Group.hasMany(Product, { foreignKey: "group_id" });
Product.belongsTo(Group, { foreignKey: "group_id" });

Unit.hasMany(Product, { foreignKey: "unit_id" });
Product.belongsTo(Unit, { foreignKey: "unit_id" });

Brand.hasMany(Product, { foreignKey: "brand_id" });
Product.belongsTo(Brand, { foreignKey: "brand_id" });

export default Product;
