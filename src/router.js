const express = require("express");
const router = express.Router();

// Import controller files
const authController = require("./controller/auth-controller");
const profileController = require("./controller/profile-controller");
const pondController = require("./controller/pond-controller");
const analyticController = require("./controller/analytic-controller");
const reportController = require("./controller/report-controller");

// Routes for different API endpoints
router.use("/auth", authController);
router.use("/profile", profileController);
router.use("/ponds", pondController);
router.use("/analytic", analyticController);
router.use("/report", reportController);

module.exports = router;
