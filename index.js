import express, { urlencoded, json } from "express";
import cors from "cors";
import db from "./config/database.js";
import routes from "./routes/index.js";

const app = express();
const port = 5000;

try {
	await db.authenticate();
	console.log("Database connected");
} catch (error) {
	console.log("Connecting error ", error);
}

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/api", routes);

app.listen(port, () => console.log(`server running at port ${port}`));
