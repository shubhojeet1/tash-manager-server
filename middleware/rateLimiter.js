const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  headers: true, // Send custom rate limit header with limit and remaining
  message: 'Too many login attempts from this IP, please try again after 15 minutes',

  // Custom handler for rate limiting
  handler: (req, res) => {
    const timeLeft = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    res.status(429).json({
      message: `Too many login attempts from this IP, please try again after ${minutes} minutes and ${seconds} seconds.`,
      retryAfter: timeLeft, // Time left in seconds
    });
  },
});

module.exports = {
  loginLimiter,
};
