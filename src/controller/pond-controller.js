const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../../db");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const postForm = multer({ storage });

// Get user ponds data
router.get("/", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		// Retrieve all ponds for the authenticated user
		const ponds = await db.query("SELECT * FROM ponds WHERE user_id = $1", [
			userId,
		]);

		if (ponds.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "User does not have any pond",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User ponds data retrieved succesfully",
			result: { ponds: ponds.rows },
		});
	} catch (error) {
		console.error("Error getting ponds:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Create a new pond for the authenticated user
router.post(
	"/add-pond",
	authenticateToken,
	postForm.none(),
	async (req, res) => {
		try {
			const userId = req.userId;
			const { name, n_fish, n_fish_feed_stock } = req.body;

			// Insert the new pond into the database
			const newPond = await db.query(
				"INSERT INTO ponds (user_id, name, n_fish, n_fish_feed_stock) VALUES ($1, $2, $3, $4) RETURNING *",
				[userId, name, n_fish, n_fish_feed_stock]
			);

			// Update user analytic on db change
			await db.query(
				"UPDATE users SET n_pond = (SELECT count(id) FROM ponds WHERE user_id = $1), n_fish_total = (SELECT sum(n_fish) FROM ponds WHERE user_id = $1), n_fish_feed_stock_total = (SELECT sum(n_fish_feed_stock) FROM ponds WHERE user_id = $1), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
				[userId]
			);

			res.status(201).json({
				code: "201",
				message: "User new pond data added successfully",
				result: { pond: newPond.rows[0] },
			});
		} catch (error) {
			console.error("Error creating pond:", error);
			res.status(500).json({
				code: "500",
				message: "Internal server error",
			});
		}
	}
);

// Get a specific pond by ID
router.get("/:id", authenticateToken, async (req, res) => {
	try {
		const pondId = req.params.id;

		// Retrieve the pond from the database
		const pond = await db.query("SELECT * FROM ponds WHERE id = $1", [pondId]);

		if (pond.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "Pond not found",
			});
		}

		res.status(200).json({
			code: "200",
			message: "Pond data retrieved successfully",
			result: { pond: pond.rows[0] },
		});
	} catch (error) {
		console.error("Error getting pond:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Update an existing pond
router.put(
	"/:id/edit-pond",
	authenticateToken,
	postForm.none(),
	async (req, res) => {
		try {
			const userId = req.userId;
			const pondId = req.params.id;
			const { name, n_fish, n_fish_feed_stock } = req.body;

			// Update the pond in the database
			const updatedPond = await db.query(
				"UPDATE ponds SET name = $1, n_fish = $2, n_fish_feed_stock = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
				[name, n_fish, n_fish_feed_stock, pondId]
			);

			if (updatedPond.rows.length === 0) {
				return res.status(404).json({
					code: "404",
					message: "Pond not found",
				});
			}

			// Update user analytic on db change
			await db.query(
				"UPDATE users SET n_fish_total = (SELECT sum(n_fish) FROM ponds WHERE user_id = $1), n_fish_feed_stock_total = (SELECT sum(n_fish_feed_stock) FROM ponds WHERE user_id = $1), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
				[userId]
			);

			res.status(200).json({
				code: "200",
				message: "Pond data updated successfully",
				result: { pond: updatedPond.rows[0] },
			});
		} catch (error) {
			console.error("Error updating pond:", error);
			res.status(500).json({
				code: "500",
				message: "Internal server error",
			});
		}
	}
);

// Delete a pond
router.delete("/:id/delete-pond", authenticateToken, async (req, res) => {
	try {
		const pondId = req.params.id;
		const userId = req.userId;

		// Delete the pond from the database
		const deletedPond = await db.query(
			"DELETE FROM ponds WHERE id = $1 RETURNING *",
			[pondId]
		);

		if (deletedPond.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "Pond not found",
			});
		}

		// Update user analytic on db change
		await db.query(
			"UPDATE users SET n_pond = (SELECT count(id) FROM ponds WHERE user_id = $1), n_fish_total = (SELECT sum(n_fish) FROM ponds WHERE user_id = $1), n_fish_feed_stock_total = (SELECT sum(n_fish_feed_stock) FROM ponds WHERE user_id = $1), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
			[userId]
		);

		res.status(200).json({
			code: "200",
			message: "Pond deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting pond:", error);
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
