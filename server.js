const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
dotenv.config();

// Middleware
app.use(express.json());

// Routes
const routeAuth = require("./src/controller/auth-controller");
app.use("/api/auth", routeAuth);

const routeProfile = require("./src/controller/profile-controller");
app.use("/api/profile", routeProfile);

const routePonds = require("./src/controller/pond-controller");
app.use("/api/ponds", routePonds);

const routeAnalytic = require("./src/controller/analytic-controller");
app.use("/api/analytic", routeAnalytic);

const routeReport = require("./src/controller/report-controller");
app.use("/api/report", routeReport);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
