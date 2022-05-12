import { Sequelize } from "sequelize";
import db from "../../config/database.js";

const { DataTypes } = Sequelize;

const Group = db.define(
	"groups",
	{
		group_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING },
	},
	{
		freezeTableName: true,
	}
);

export default Group;
