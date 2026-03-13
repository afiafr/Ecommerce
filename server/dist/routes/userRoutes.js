var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_js_1 = require("../controllers/userControllers.js");
const auth_js_1 = require("../middleware/auth.js");
const routes = express_1.default.Router();
routes.post("/register", userControllers_js_1.register);
routes.post("/login", userControllers_js_1.login);
routes.post("/logout", userControllers_js_1.logout);
routes.get(
  "/profile",
  auth_js_1.requireSignIn,
  userControllers_js_1.getUserProfile,
);
routes.get(
  "/all",
  auth_js_1.requireSignIn,
  auth_js_1.isAdmin,
  userControllers_js_1.getAllUsers,
);
routes.get("/:id", auth_js_1.requireSignIn, userControllers_js_1.singleUser);
routes.delete(
  "/:id",
  auth_js_1.requireSignIn,
  auth_js_1.isAdmin,
  userControllers_js_1.deleteUser,
);
routes.put(
  "/:id",
  auth_js_1.requireSignIn,
  auth_js_1.isAdmin,
  userControllers_js_1.updateUser,
);
exports.default = routes;
