const jwt = require("jsonwebtoken");

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

module.exports = { authenticateToken };
