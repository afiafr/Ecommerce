import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { Badge } from "antd";

const Menu = () => {
	const { cartItems, totalItemsInCart } = useSelector((state: RootState) => state.cartReducer);

	return (
		<nav className="bg-blue-500 p-4  w-full z-10 pb-5 ">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/shop" className="text-white hover:text-gray-300">
					<FaShoppingBag className="text-xl" />
				</Link>

				<div className="space-x-4 flex items-center">
					<div className="relative inline-block pt-2 pr-1">
						<Link
							to="/cart"
							className="text-white hover:text-gray-300 relative flex items-center"
						>
							<Badge
								count={
									totalItemsInCart >= 1
										? totalItemsInCart
										: 0
								}
								showZero={true}
							>
								<FaShoppingCart className="text-xl text-white" />
							</Badge>
						</Link>
					</div>

					<div className="relative inline-block text-white">
						<div className="absolute hidden bg-white text-gray-800 p-2 mt-2 space-y-2 rounded shadow-md">
							<a href="#" className="block">
								Category 1
							</a>
							<a href="#" className="block">
								Category 2
							</a>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Menu;
