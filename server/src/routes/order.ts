import express from "express";
import { makeNewOrder } from "../controllers/order";

const router = express.Router();

router.post("/new", makeNewOrder);
//router.get("/all", requireSignin, getAllOrders);
//router.get("/:id", requireSignIn, singleOrder);
//router.get("/:id", processOrder)
//router.get("/:id", cancelOrder)

export default router;
