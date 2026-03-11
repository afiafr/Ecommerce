import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/utils-class";
import { User } from "../models/user";
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireSignIn = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };
    req.user = await User.findById(decoded.userId).select("-password"); //logged in user
    next();
  } catch (err) {
    res.status(401);
    return next(new ErrorHandler("Authentication failed", 401));
  }
};

export const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.role !== "admin") {
      return next(
        new ErrorHandler("Authentication failed, Need admin access", 401)
      );
    }

    next();
  } catch (err) {
    return next(new ErrorHandler("Something went wrong", 500));
  }
};
