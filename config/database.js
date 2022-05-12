import { Sequelize } from "sequelize";

const db = new Sequelize("db_apotek", "root", "88888888", {
	host: "localhost",
	dialect: "mysql",
});

export default db;
