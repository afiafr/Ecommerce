import express from "express";
import { isAdmin, requireSignIn } from "../middleware/auth";
import { getAllCategories, getAllProducts, getAllProductsWithFilter, getProductByStatus, getSingleProduct } from "../controllers/product";

const router = express.Router();

router.get("/", getAllProductsWithFilter);
router.get("/categories", getAllCategories);
router.get("/single/:id", getSingleProduct);
router.get("/:status", getProductByStatus);

export default router;
