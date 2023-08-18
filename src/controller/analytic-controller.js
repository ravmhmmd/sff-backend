const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../auth-token");
const router = express.Router();

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
			"SELECT * FROM fish_feedings WHERE user_id = $1",
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
		console.error("Error getting fish feeding data:", error);
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

// Get fish feed use total
router.get("/feed-use", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		const feedUse = await db.query(
			"SELECT user_id, SUM (n_fish_feed_use) as total_fish_feed_used FROM fish_feedings WHERE user_id = $1 GROUP BY user_id",
			[userId]
		);

		if (feedUse.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "User does not have any fish feeding analytic",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User fish feed use data retrieved succesfully",
			result: { feedUse: feedUse.rows },
		});
	} catch (error) {
		console.error("Error getting fish feed use data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get fish feed use per pond
router.get("/feed-use/ponds", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		const feedUse = await db.query(
			"SELECT ponds.id, ponds.name, COALESCE(feeding.total_fish_feed_used, 0) as total_fish_feed_used FROM ponds LEFT JOIN (SELECT pond_id, SUM(n_fish_feed_use) as total_fish_feed_used FROM fish_feedings WHERE user_id = $1 GROUP BY pond_id) as feeding ON ponds.id = feeding.pond_id",
			[userId]
		);

		if (feedUse.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "User does not have any fish feeding analytic",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User fish feed use data retrieved succesfully",
			result: { feedUse: feedUse.rows },
		});
	} catch (error) {
		console.error("Error getting fish feed use data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get fish feed use in one pond
router.get("/feed-use/ponds/:id", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;
		const pondId = req.params.id;

		const feedUse = await db.query(
			"SELECT ponds.id, ponds.name, COALESCE(feeding.total_fish_feed_used, 0) as total_fish_feed_used FROM ponds LEFT JOIN (SELECT pond_id, SUM(n_fish_feed_use) as total_fish_feed_used FROM fish_feedings WHERE user_id = $1 GROUP BY pond_id) as feeding ON ponds.id = feeding.pond_id WHERE ponds.id = $2",
			[userId, pondId]
		);

		if (feedUse.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "Pond does not have any fish feeding analytic",
			});
		}

		res.status(200).json({
			code: "200",
			message: "Pond fish feed use data retrieved succesfully",
			result: { feedUse: feedUse.rows },
		});
	} catch (error) {
		console.error("Error getting fish feed use data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get fish feed use daily
router.get("/feed-use/daily", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		const feedUse = await db.query(
			"SELECT DATE_TRUNC('day', created_at) AS date, SUM (n_fish_feed_use) AS total_fish_feed_used FROM fish_feedings WHERE user_id = $1 GROUP BY DATE_TRUNC('day', created_at)",
			[userId]
		);

		if (feedUse.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "User does not have any fish feeding analytic",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User fish feed use data retrieved succesfully",
			result: { feedUse: feedUse.rows },
		});
	} catch (error) {
		console.error("Error getting fish feed use data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Get today fish feed use
router.get("/feed-use/today", authenticateToken, async (req, res) => {
	try {
		const userId = req.userId;

		const feedUse = await db.query(
			"SELECT d.date, COALESCE(SUM(ff.n_fish_feed_use), 0) AS total_fish_feed_used FROM (SELECT CURRENT_DATE AS date) AS d LEFT JOIN fish_feedings AS ff ON DATE_TRUNC('day', ff.created_at) = d.date AND ff.user_id = $1 GROUP BY d.date;",
			[userId]
		);

		if (feedUse.rows.length === 0) {
			return res.status(200).json({
				code: "200",
				message: "User does not have any fish feeding analytic for today",
			});
		}

		res.status(200).json({
			code: "200",
			message: "User fish feed use data retrieved succesfully",
			result: { feedUse: feedUse.rows },
		});
	} catch (error) {
		console.error("Error getting fish feed use data:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});
module.exports = router;
