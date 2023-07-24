const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../../db");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const postForm = multer({ storage });

// Get all fish hunger data for the authenticated user
router.get("/hunger", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		const fishHungers = await db.query(
			"SELECT * FROM fish_hungers WHERE user_id  = $1",
			[userId]
		);

		if (fishHungers.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "User does not have any fish hunger analytic",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User fish hunger data retrieved succesfully",
			result: { fishHungers: fishHungers.rows },
		});
	} catch (error) {
		console.error("Error getting fish hunger data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get a spesific fish hunger data by ID
router.get("/hunger/:id", authenticateToken, async (req, res) => {
	try {
		const fishHungerId = req.params.id;

		// Retrieve the pond from the database
		const fishHunger = await db.query(
			"SELECT * FROM fish_hungers WHERE id = $1",
			[fishHungerId]
		);

		if (fishHunger.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "Fish hunger data not found",
			});
		}

		res.status(200).json({
			code: "200",
			message: "Fish hunger data retrieved successfully",
			result: { fishHunger: fishHunger.rows[0] },
		});
	} catch (error) {
		console.error("Error getting fish hunger data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get a spesific fish hunger data by pond
router.get("/hunger/pond/:id", authenticateToken, async (req, res) => {
	try {
		const pondId = req.params.id;

		// Retrieve the pond from the database
		const fishHungers = await db.query(
			"SELECT * FROM fish_hungers WHERE pond_id = $1",
			[pondId]
		);

		if (fishHungers.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "Fish hunger data not found",
			});
		}

		res.status(200).json({
			code: "200",
			message: "Fish hunger data retrieved successfully",
			result: { fishHungers: fishHungers.rows },
		});
	} catch (error) {
		console.error("Error getting fish hunger data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get all fish feeding data for the authenticated user
router.get("/feeding", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		const fishFeedings = await db.query(
			"SELECT * FROM fish_feedings WHERE user_id  = $1",
			[userId]
		);

		if (fishFeedings.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "User does not have any fish feeding analytic",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User fish feeding data retrieved succesfully",
			result: { fishFeedings: fishFeedings.rows },
		});
	} catch (error) {
		console.error("Error getting fish feeding data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get a spesific fish feeding data by ID
router.get("/feeding/:id", authenticateToken, async (req, res) => {
	try {
		const fishFeedingId = req.params.id;

		// Retrieve the pond from the database
		const fishFeeding = await db.query(
			"SELECT * FROM fish_feedings WHERE id = $1",
			[fishFeedingId]
		);

		if (fishFeeding.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "Fish feeding data not found",
			});
		}

		res.status(200).json({
			code: "200",
			message: "Fish feeding data retrieved successfully",
			result: { fishFeeding: fishFeeding.rows[0] },
		});
	} catch (error) {
		console.error("Error getting fish hunger data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get a spesific fish feeding data by pond
router.get("/feeding/pond/:id", authenticateToken, async (req, res) => {
	try {
		const pondId = req.params.id;

		// Retrieve the pond from the database
		const fishFeedings = await db.query(
			"SELECT * FROM fish_feedings WHERE pond_id = $1",
			[pondId]
		);

		if (fishFeedings.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "Fish feeding data not found",
			});
		}

		res.status(200).json({
			code: "200",
			message: "Fish feeding data retrieved successfully",
			result: { fishFeedings: fishFeedings.rows },
		});
	} catch (error) {
		console.error("Error getting fish feeding data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({
			code: "401",
			message: "No token provided",
		});
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({
				code: "403",
				message: "Invalid token",
			});
		}

		req.userId = decoded.userId;
		next();
	});
}

module.exports = router;
