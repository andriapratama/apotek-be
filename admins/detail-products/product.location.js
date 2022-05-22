import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import Product from "../products/product.js";
import Location from "../locations/location.js";

const { DataTypes } = Sequelize;

const ProductLocation = db.define(
	"product_locations",
	{
		product_location_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		product_id: { type: DataTypes.STRING },
		location_id: { type: DataTypes.STRING },
		name: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

Product.hasMany(ProductLocation, { foreignKey: "product_id" });
ProductLocation.belongsTo(Product, { foreignKey: "product_id" });

Location.hasMany(ProductLocation, { foreignKey: "location_id" });
ProductLocation.belongsTo(Location, { foreignKey: "location_id" });

export default ProductLocation;
