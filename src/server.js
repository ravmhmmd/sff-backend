const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { connectDatabase } = require("./db");
dotenv.config();

// Middleware
app.use(express.json());

// Routes
const router = require("./router");
app.use("/api", router);

// Connect to the database on application startup
connectDatabase()
	.then(() => {
		// Start the server after the database connection is successful
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Error connecting to the database:", err);
		process.exit(1);
	});
