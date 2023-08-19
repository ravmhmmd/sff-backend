const express = require("express");
const db = require("../db");
const multer = require("multer");
const { authenticateToken } = require("../auth-token");

const router = express.Router();
const storage = multer.memoryStorage();
const postForm = multer({ storage });

// Create a new fish hunger data for the authenticated user
router.post("/hunger/add-report", postForm.none(), async (req, res) => {
	try {
		const { user_id, pond_id, video_path } = req.body;

		const isUserHaveThePond = await db.query(
			"SELECT * FROM ponds WHERE user_id = $1 AND id = $2",
			[user_id, pond_id]
		);

		if (isUserHaveThePond.rows.length === 0) {
			return res.status(400).json({
				code: "400",
				message: "User doesn't have pond with the id provided",
			});
		}

		// Insert the new hunger data into the database
		const newHunger = await db.query(
			"INSERT INTO fish_hungers (user_id, pond_id, video_path) VALUES ($1, $2, $3) RETURNING *",
			[user_id, pond_id, video_path]
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
});

// Add fish hunger data video path (deprecated)
router.put(
	"/hunger/:id/update-video-path",
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
router.post("/feeding/add-report", postForm.none(), async (req, res) => {
	try {
		const { user_id, pond_id, feeding_type, n_fish_feed_use } = req.body;

		const isUserHaveThePond = await db.query(
			"SELECT * FROM ponds WHERE user_id = $1 AND id = $2",
			[user_id, pond_id]
		);

		if (isUserHaveThePond.rows.length === 0) {
			return res.status(400).json({
				code: "400",
				message: "User doesn't have pond with the id provided",
			});
		}

		// Insert the new feeding data into the database
		const newFeeding = await db.query(
			"INSERT INTO fish_feedings (user_id, pond_id, feeding_type, n_fish_feed_use) VALUES ($1, $2, $3, $4) RETURNING *",
			[user_id, pond_id, feeding_type, n_fish_feed_use]
		);

		// Update fish feed stock in pond
		await db.query(
			"UPDATE ponds SET n_fish_feed_stock = n_fish_feed_stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
			[n_fish_feed_use, pond_id]
		);

		// Update fish feed stock in user
		await db.query(
			"UPDATE users SET n_fish_feed_stock_total = (SELECT sum(n_fish_feed_stock) FROM ponds WHERE user_id = $1), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
			[user_id]
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
});

module.exports = router;
