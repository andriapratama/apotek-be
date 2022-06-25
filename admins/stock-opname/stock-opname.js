import { Sequelize } from "sequelize";
import db from "../../config/database.js";

const { DataTypes } = Sequelize;

const StockOpname = db.define(
	"stock_opname",
	{
		stock_opname_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		operator: { type: DataTypes.STRING },
		note: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

export default StockOpname;
