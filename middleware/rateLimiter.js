const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3, 
  headers: true,
  message: 'Too many login attempts from this IP, please try again after 2 minutes',

 
  handler: (req, res) => {
    const timeLeft = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    res.status(429).json({
      message: `Too many login attempts from this IP, please try again after ${minutes} minutes and ${seconds} seconds.`,
      retryAfter: timeLeft,
    });
  },
});

module.exports = {
  loginLimiter,
};
