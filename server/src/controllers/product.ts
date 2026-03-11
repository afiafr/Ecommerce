import { Product } from "../models/product";
import { BaseQuery, ProductFilters, ProductType } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error";
import Axios from "axios";

const productsUrl =
	"https://s3.us-east-1.amazonaws.com/assets.spotandtango/products.json";

async function fetchAllProducts(): Promise<Array<ProductType>> {
	const productsResponse = await Axios.get(productsUrl);
	return productsResponse.data as Array<ProductType>;
}

export const getAllProducts = TryCatch(async (req: Request, res: Response) => {
	const products = await fetchAllProducts();
	res.status(200).json(products);
});

export const getProductByStatus = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const { status } = req.params;
		const products: Array<ProductType> = await fetchAllProducts();

		const availableProducts = products.filter(
			(product) =>
				product.status.toLowerCase() ===
				(status as string).toLowerCase()
		);

		res.status(200).json(availableProducts);
	}
);

export const getAllCategories = TryCatch(
	async (req: Request, res: Response) => {
		const products = await fetchAllProducts();
		const categories = Array.from(
			new Set(products.map((product) => product.group))
		);
		res.status(200).json(categories);
	}
);

export const getSingleProduct = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const products = await fetchAllProducts();
		const product = products.find((p) => p.id === id.toString());

		if (!product) {
			return next(new Error("Product not found"));
		}
		res.status(200).json(product);
	}
);

export const getAllProductsWithFilter = TryCatch(
	async (req: Request<{}, {}, {}, ProductFilters>, res, next) => {
		const { search, sort, category, price } = req.query;
		const page = Number(req.query.page) || 1;
		const limit = Number(process.env.PRODUCT_PER_PAGE) || 6;
		//pagination
		const skip = (page - 1) * limit;

		const baseQuery: BaseQuery = {};

		if (search)
			baseQuery.name = {
				$regex: search as unknown as RegExp,
				$options: "i",
			};

		if (price)
			baseQuery.price = {
				$lte: Number(price),
			};
		console.log("baseQuery===>", baseQuery.price);

		if (category) baseQuery.category = category;
		const products = await fetchAllProducts();
		const filteredProducts = products.filter((product) => {
			let isValid = true;
			if (baseQuery.name) {
				const regex = new RegExp(
					baseQuery.name.$regex,
					baseQuery.name.$options
				);
				isValid = isValid && regex.test(product.name);
			}
			if (baseQuery.price) {
				if (baseQuery.price!.$lte !== undefined) {
					isValid = isValid && product.price <= baseQuery.price!.$lte;
				}
			}

			if (baseQuery.category) {
				isValid = isValid && product.group === baseQuery.category;
			}
			return isValid;
		});

		const totalPage = Math.ceil(filteredProducts.length / limit);

		const sortedProducts = sort
			? [...filteredProducts].sort((a, b) => {
					if (sort === "asc") return a.price - b.price;
					else return b.price - a.price;
			  })
			: filteredProducts;

		return res.status(200).json({
			success: true,
			products: sortedProducts.slice(skip, skip + limit),
			totalPage,
		});
	}
);
