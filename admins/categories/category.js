import { Sequelize } from "sequelize";
import db from "../../config/database.js";

const { DataTypes } = Sequelize;

const Category = db.define(
	"categories",
	{
		category_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

export default Category;
