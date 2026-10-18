import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Please login first" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { userId }
    next();
  } catch {
    res.status(401).json({ error: "Session expired, please login again" });
  }
}