import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  login,
  logout,
  register,
  singleUser,
  updateUser,
} from "../controllers/user.js";
import { requireSignIn, isAdmin } from "../middleware/auth.js";

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);
routes.get("/profile", requireSignIn, getUserProfile);
routes.get("/all", requireSignIn, isAdmin, getAllUsers);
routes.get("/:id", requireSignIn, singleUser);
routes.delete("/:id", requireSignIn, isAdmin, deleteUser);
routes.put("/:id", requireSignIn, isAdmin, updateUser);

export default routes;
