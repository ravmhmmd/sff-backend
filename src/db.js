const { Pool } = require("pg");
const { Connector } = require("@google-cloud/cloud-sql-connector");
const dotenv = require("dotenv");
dotenv.config();
var pool;

// Function to connect to the database
async function connectDatabase() {
	const connector = new Connector();
	const clientOpts = await connector.getOptions({
		instanceConnectionName: process.env.DB_CONNECTION_NAME,
		ipType: process.env.DB_IP_TYPE,
	});

	// Create a new PostgreSQL pool instance
	pool = new Pool({
		...clientOpts,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		max: 5,
	});
	try {
		console.log("Connected to the database!");
	} catch (err) {
		console.error("Error connecting to the database:", err);
		process.exit(1); // Exit the application with an error code if the database connection fails
	}
}

module.exports = {
	query: (text, params) => pool.query(text, params),
	connectDatabase,
};
