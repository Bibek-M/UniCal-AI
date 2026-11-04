import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_unical_2026';

export function authMiddleware(req: any, res: any, next: any) {
  try {
    const rawHeader = req.headers.authorization || req.headers.token;
    if (!rawHeader) {
      res.status(401).json({
        message: "Access denied. No token provided.",
      });
      return;
    }

    // Support both 'Bearer <token>' and raw token string
    const token = typeof rawHeader === 'string' && rawHeader.startsWith('Bearer ')
      ? rawHeader.slice(7).trim()
      : String(rawHeader).trim();

    if (!token) {
      res.status(401).json({
        message: "Access denied. Token is empty.",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Attach decoded information to request (MongoDB ObjectIds are strings, not integers)
    req.userId = decoded.userId || decoded.id;
    req.userid = req.userId; // maintain backwards compatibility with legacy req.userid
    req.user = decoded;

    next();
  } catch (error: any) {
    res.status(403).json({
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
}
