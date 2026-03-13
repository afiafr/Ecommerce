"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductsWithFilter =
  exports.getSingleProduct =
  exports.getAllCategories =
  exports.getProductByStatus =
  exports.getAllProducts =
    void 0;
const error_1 = require("../middleware/error");
const axios_1 = __importDefault(require("axios"));
const productsUrl =
  "https://s3.us-east-1.amazonaws.com/assets.spotandtango/products.json";
async function fetchAllProducts() {
  const productsResponse = await axios_1.default.get(productsUrl);
  return productsResponse.data;
}
exports.getAllProducts = (0, error_1.TryCatch)(async (req, res) => {
  const products = await fetchAllProducts();
  res.status(200).json(products);
});
exports.getProductByStatus = (0, error_1.TryCatch)(async (req, res) => {
  const { status } = req.params;
  const products = await fetchAllProducts();
  const availableProducts = products.filter(
    (product) => product.status.toLowerCase() === status.toLowerCase(),
  );
  res.status(200).json(availableProducts);
});
exports.getAllCategories = (0, error_1.TryCatch)(async (req, res) => {
  const products = await fetchAllProducts();
  const categories = Array.from(
    new Set(products.map((product) => product.group)),
  );
  res.status(200).json(categories);
});
exports.getSingleProduct = (0, error_1.TryCatch)(async (req, res, next) => {
  const { id } = req.params;
  const products = await fetchAllProducts();
  const product = products.find((p) => p.id === id.toString());
  if (!product) {
    return next(new Error("Product not found"));
  }
  res.status(200).json(product);
});
exports.getAllProductsWithFilter = (0, error_1.TryCatch)(async (req, res) => {
  const { search, sort, category, price } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 6;
  //pagination
  const skip = (page - 1) * limit;
  const baseQuery = {};
  if (search)
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };
  if (price)
    baseQuery.price = {
      $lte: Number(price),
    };
  if (category) baseQuery.category = category;
  const products = await fetchAllProducts();
  const filteredProducts = products.filter((product) => {
    let isValid = true;
    if (baseQuery.name) {
      const regex = new RegExp(baseQuery.name.$regex, baseQuery.name.$options);
      isValid = isValid && regex.test(product.name);
    }
    if (baseQuery.price) {
      if (baseQuery.price.$lte !== undefined) {
        isValid = isValid && product.price <= baseQuery.price.$lte;
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
});
