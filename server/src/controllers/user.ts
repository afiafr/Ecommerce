import { Request, NextFunction, Response } from "express";
import ErrorHandler from "../utils/utils-class";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { TryCatch } from "../middleware/error";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken";

const saltRounds = 10; // Adjust this based on your security needs
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone) {
    return next(new ErrorHandler("Please add all fields", 400));
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be 6 character log" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ error: "Email is taken" });
  }
  const hashedPassword = await hashPassword(password);
  const user = await new User({
    name,
    email,
    phone,
    password: hashedPassword,
  }).save();

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } else {
    throw new Error("Failed to create user");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Invalid email or password");
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isBanned) {
      return res
        .status(401)
        .json({ error: "User is banned. Please contact the admin." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    // Send response with user details and token
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token: generateToken(res, user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
});

export const getAllUsers = TryCatch(async (req: Request, res: Response) => {
  const search = req.query.search || "";
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const searchRegExp = new RegExp(".*" + search + ".*", "i");

  const filter = {
    $or: [
      { name: { $regex: searchRegExp } },
      { email: { $regex: searchRegExp } },
      { phone: { $regex: searchRegExp } },
    ],
  };
  const option = { password: 0 };

  const users = await User.find(filter, option)
    .limit(limit)
    .skip((page - 1) * 5);
  const count = await User.find(filter).countDocuments();

  if (!users) {
    return res
      .status(404)
      .json({ error: "No user found with the search term" });
  }

  return res.status(200).json({
    message: "success",
    users,
    pagination: {
      totalUser: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previousPage: page - 1 > 0 ? page - 1 : null,
      nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
    },
  });
});

export const singleUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid id", 400));
  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid id", 400));
  await user.deleteOne();
  return res.status(200).json({
    success: true,
    message: "User deleted successfull",
  });
});

export const updateUser = TryCatch(async (req, res) => {
  const userId = req.params.id;
  const { isBanned, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (isBanned != undefined) {
      user.isBanned = isBanned;
    }
    if (role) {
      user.role = role;
    }
    await User.findOneAndUpdate({ _id: userId }, user);
    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res
        .status(500)
        .json({ error: "Failed to fetch updated user data" });
    }
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!("user" in req)) {
      res.status(404);
      next({ error: "User not found" });
    } else {
      const user = req.user;
      res.json(user);
    }
  },
);
