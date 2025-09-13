import jwt from "jsonwebtoken";

// JWT Secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export interface JWTPayload {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

/**
 * Generate JWT Access Token
 * @param payload - User data to encode in the token
 * @returns JWT token string
 */
export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'goals-app',
    audience: 'goals-app-users'
  });
};

/**
 * Generate JWT Refresh Token
 * @param payload - User data to encode in the token
 * @returns JWT refresh token string
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'goals-app',
    audience: 'goals-app-users'
  });
};

/**
 * Generate both access and refresh tokens
 * @param payload - User data to encode in the tokens
 * @returns Object containing both tokens
 */
export const generateTokens = (payload: JWTPayload): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

/**
 * Verify JWT Token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

/**
 * Decode JWT Token without verification (for debugging)
 * @param token - JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token - JWT token to check
 * @returns True if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Token expiration check error:", error);
    return true;
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null if not found
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Get token expiration time
 * @param token - JWT token
 * @returns Expiration date or null if invalid
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error("Get token expiration error:", error);
    return null;
  }
};

/**
 * Refresh access token using refresh token
 * @param refreshToken - Valid refresh token
 * @returns New access token or null if refresh token is invalid
 */
export const refreshAccessToken = (refreshToken: string): string | null => {
  try {
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return null;
    }

    // Generate new access token with the same payload
    return generateAccessToken(decoded);
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
};

