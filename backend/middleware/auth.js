// middleware/auth.js
const jwt = require("jsonwebtoken");

// IMPORTANT: Ensure JWT_SECRET is loaded from environment variables in production.
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // Check for the 'token' cookie
  const token = req.cookies.token;

  if (!token) {
    console.log("Auth Middleware: No token found in cookies.");
    return res.status(401).json({
      message: "No authentication token provided. Please log in.",
      success: false,
    });
  }

  if (!JWT_SECRET) {
    console.error("Auth Middleware: JWT_SECRET is not set!");
    return res
      .status(500)
      .json({ message: "Server configuration error.", success: false });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Auth Middleware: Token decoded successfully:", decoded);

    // Attach user info to the request object for downstream routes to use
    req.user = decoded; // E.g., req.user.id, req.user.email, req.user.name
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Auth Middleware: Token verification failed:", error.message);
    // Common errors: JsonWebTokenError (invalid signature), TokenExpiredError (token expired)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Authentication token has expired. Please log in again.",
        success: false,
      });
    }
    return res.status(401).json({
      message: "Invalid authentication token. Please log in again.",
      success: false,
    });
  }
};

module.exports = authMiddleware;
