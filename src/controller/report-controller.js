const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../../db");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const postForm = multer({ storage });

// Create a new fish hunger data for the authenticated user
router.post(
	"/hunger/add-report",
	authenticateToken,
	postForm.none(),
	async (req, res) => {
		try {
			const userId = req.userId;
			const { pond_id } = req.body;

			// Insert the new hunger data into the database
			const newHunger = await db.query(
				"INSERT INTO fish_hungers (user_id, pond_id) VALUES ($1, $2) RETURNING *",
				[userId, pond_id]
			);

			res.status(201).json({
				code: "201",
				message: "User new fish hunger data added successfully",
				result: { newHunger: newHunger.rows[0] },
			});
		} catch (error) {
			console.error("Error creating fish hunger data:", error);
			res.status(500).json({
				code: "500",
				message: "Internal server error",
			});
		}
	}
);

// Add fish hunger data video path
router.put(
	"/hunger/:id/update-video-path",
	authenticateToken,
	postForm.none(),
	async (req, res) => {
		try {
			const hungerId = req.params.id;
			const { video_path } = req.body;

			const updatedHunger = await db.query(
				"UPDATE fish_hungers SET video_path = $1 WHERE id = $2 RETURNING *",
				[video_path, hungerId]
			);

			if (updatedHunger.rows.length === 0) {
				return res.status(404).json({
					code: "404",
					message: "Fish hunger data not found",
				});
			}

			res.status(200).json({
				code: "200",
				message: "Fish hunger data video path added successfully",
				result: { updatedHunger: updatedHunger.rows[0] },
			});
		} catch (error) {
			console.error("Error updating fish hunger data video path:", error);
			res.status(500).json({
				code: "500",
				message: "Internal server error",
			});
		}
	}
);

// Add fish hunger data prediction result
router.put(
	"/hunger/:id/update-prediction",
	authenticateToken,
	postForm.none(),
	async (req, res) => {
		try {
			const hungerId = req.params.id;
			const { is_hungry } = req.body;

			const updatedHunger = await db.query(
				"UPDATE fish_hungers SET is_predicted = $1, is_hungry = $2 WHERE id = $3 RETURNING *",
				[true, is_hungry, hungerId]
			);

			if (updatedHunger.rows.length === 0) {
				return res.status(404).json({
					code: "404",
					message: "Fish hunger data not found",
				});
			}

			res.status(200).json({
				code: "200",
				message: "Fish hunger data prediction result added successfully",
				result: { updatedHunger: updatedHunger.rows[0] },
			});
		} catch (error) {
			console.error("Error updating fish hunger data video path:", error);
			res.status(500).json({
				code: "500",
				message: "Internal server error",
			});
		}
	}
);

// Create a new fish feeding data for the authenticated user
router.post(
	"/feeding/add-report",
	authenticateToken,
	postForm.none(),
	async (req, res) => {
		try {
			const userId = req.userId;
			const { pond_id, feeding_type, n_fish_feed_use } = req.body;

			// Insert the new feeding data into the database
			const newFeeding = await db.query(
				"INSERT INTO fish_feedings (user_id, pond_id, feeding_type, n_fish_feed_use) VALUES ($1, $2, $3, $4) RETURNING *",
				[userId, pond_id, feeding_type, n_fish_feed_use]
			);

			// Update fish feed stock in pond
			await db.query(
				"UPDATE ponds SET n_fish_feed_stock = n_fish_feed_stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
				[n_fish_feed_use, pond_id]
			);

			// Update fish feed stock in user
			await db.query(
				"UPDATE users SET n_fish_feed_stock_total = (SELECT sum(n_fish_feed_stock) FROM ponds WHERE user_id = $1), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
				[userId]
			);

			res.status(201).json({
				code: "201",
				message: "User new fish feeding data added successfully",
				result: { newFeeding: newFeeding.rows[0] },
			});
		} catch (error) {
			console.error("Error creating fish feeding data:", error);
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
