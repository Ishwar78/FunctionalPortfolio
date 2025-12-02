import rateLimit from 'express-rate-limit';

export const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many contact requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
