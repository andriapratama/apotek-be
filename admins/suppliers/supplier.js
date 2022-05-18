import { Sequelize } from "sequelize";
import db from "../../config/database.js";

const { DataTypes } = Sequelize;

const Supplier = db.define(
	"suppliers",
	{
		supplier_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING },
		phone: { type: DataTypes.STRING },
		address: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

export default Supplier;
