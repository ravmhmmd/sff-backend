const db = require("../db");
const { authenticateToken } = require("../auth-token");
const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");

const router = express.Router();
const postForm = multer();

// Register endpoint
router.post("/register", postForm.none(), async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if the email already exists in the database
		const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		if (userExists.rows.length > 0) {
			return res.status(400).json({
				code: "400",
				message: "Email already exists",
			});
		}

		// Generate salt and hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert the new user into the database
		await db.query(
			"INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
			[name, email, hashedPassword]
		);

		res.status(201).json({
			code: "201",
			message: "User registered successfully",
		});
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Login endpoint
router.post("/login", postForm.none(), async (req, res) => {
	try {
		const { email, password } = req.body;

		// Retrieve the user from the database
		const user = await db.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		if (user.rows.length === 0) {
			return res.status(404).json({
				code: "404",
				message: "User not found",
			});
		}

		// Compare the password with the hashed password
		const match = await bcrypt.compare(password, user.rows[0].password);
		if (!match) {
			console.log(res);
			return res.status(401).json({
				code: "401",
				message: "Invalid credentials",
			});
		}

		// Generate a JWT token
		const token = jwt.sign(
			{ userId: user.rows[0].id },
			process.env.JWT_SECRET,
			{ expiresIn: "30d" }
		);

		res.status(200).json({
			code: "200",
			message: "User logged in successfully",
			result: { token },
		});
	} catch (error) {
		console.error("Error logging in:", error);
		res.status(500).json({
			code: "500",
			message: "Internal server error",
		});
	}
});

// Protected endpoint
router.get("/protected", authenticateToken, (req, res) => {
	res.json({
		code: "200",
		message: "Protected endpoint",
	});
});

module.exports = router;
