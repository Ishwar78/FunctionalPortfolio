import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};
