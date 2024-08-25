const { register, login } = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

jest.mock("../models/User");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("Auth Controller - Register", () => {
  it("should register a user successfully", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    User.findOne.mockResolvedValue(null); 
    User.prototype.save = jest.fn().mockResolvedValueOnce(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, "mockToken");
    });

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
  });

  it("should return 400 for invalid email format", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "invalid-email",
        password: "Password123!",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Invalid email format" });
  });

  it("should return 400 for weak password", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "weakpass",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character",
    });
  });

  it("should return 400 if user already exists", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue({});

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "User already exists" });
  });
});

describe("Auth Controller - Login", () => {
  it("should login a user successfully", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "Password123!",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockUser = {
      id: "user_id_123",
      password: "hashedPassword",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true); 
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, "mockToken");
    });

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "Password123!",
      "hashedPassword"
    );
    expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
  });

  it("should return 400 for invalid email format", async () => {
    const req = {
      body: {
        email: "invalid-email",
        password: "Password123!",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Invalid email format" });
  });

  it("should return 400 for incorrect password", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "WrongPassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      id: "user_id_123",
      password: "hashedPassword",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); 

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Incorrect password" });
  });

  it("should return 400 if user does not exist", async () => {
    const req = {
      body: {
        email: "nonexistent@example.com",
        password: "Password123!",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Invalid credentials" });
  });
});
