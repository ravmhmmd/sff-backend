const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../../db");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const postForm = multer({ storage });

// Get user info
router.get("/", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		// Retrieve the user from the database
		const user = await db.query(
			"SELECT id, name, email, created_at FROM users WHERE id = $1",
			[userId]
		);
		if (user.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "User not found",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User data retrieved successfully",
			result: {
				user: user.rows[0],
			},
		});
	} catch (error) {
		console.error("Error getting user:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get user analytic
router.get("/analytic", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		// Retrieve the user from the database
		const userAnalytic = await db.query(
			"SELECT id, n_pond, n_fish_total, n_fish_feed_stock_total, updated_at FROM users WHERE id = $1",
			[userId]
		);
		if (userAnalytic.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "User analytic not found",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User analytic retrieved successfully",
			result: {
				userAnalytic: userAnalytic.rows[0],
			},
		});
	} catch (error) {
		console.error("Error getting user analytic:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Update user info data
router.put(
	"/edit-profile",
	authenticateToken,
	postForm.none(),
	async (req, res) => {
		try {
			const userId = req.userId;
			const { name, email } = req.body;

			// Update the user in the database
			await db.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [
				name,
				email,
				userId,
			]);

			res.status(200).json({
				code: "200",
				message: "User updated successfully",
			});
		} catch (error) {
			console.error("Error updating user:", error);
			res.status(500).json({
				code: "500",
				message: "Internal server error",
			});
		}
	}
);

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
