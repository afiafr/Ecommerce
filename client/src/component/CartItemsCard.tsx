import { AiFillDelete } from "react-icons/ai";
import type { CartItem } from "../types/types";
import { server } from "../redux/store";
import { FaLaptop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { MdHeadphonesBattery } from "react-icons/md";
import React from "react";

type CartItemProps = {
	cartItem: CartItem;
	incrementHandler: (cartItem: CartItem) => void;
	decrementHandler: (cartItem: CartItem) => void;
	removeHandler: (id: string) => void;
};
const CartItemsCard = ({
	cartItem,
	incrementHandler,
	decrementHandler,
	removeHandler,
}: CartItemProps) => {
	const { productId, name, price, quantity, group } = cartItem;
	const [isRemoving, setIsRemoving] = React.useState(false);
	return (
		<>
			<div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
				{group === "Laptop" ? (
					<FaLaptop className="text-4xl text-gray-400 mb-2 items-center justify-self-center" />
				) : group === "Mobile" ? (
					<FaMobileAlt className="text-4xl text-gray-400 mb-2 items-center justify-self-center" />
				) : group === "Tablet" ? (
					<FaTabletAlt className="text-4xl text-gray-400 mb-2 items-center justify-self-center" />
				) : (
					<MdHeadphonesBattery className="text-4xl text-gray-400 mb-2 items-center justify-self-center" />
				)}
				<div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
					<div className="mt-5 sm:mt-0">
						<h2 className="text-lg font-bold text-gray-900 ">
							{name}
						</h2>
						<p className="mt-1 text-s text-gray-700">
							${price} * {quantity} = ${price * quantity}
						</p>
					</div>
					<div className="mt-4 flex flex-col items-center sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
						<div className="flex items-center border-gray-100">
							<span
								onClick={() => decrementHandler(cartItem)}
								className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
							>
								{" "}
								-{" "}
							</span>

							<p>{quantity}</p>
							<span
								onClick={() => incrementHandler(cartItem)}
								className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
							>
								{" "}
								+{" "}
							</span>
						</div>
						<button
							onClick={() => {
								setIsRemoving(true);
							}}
							className="mt-2 text-red-500 hover:text-red-700 text-2xl"
						>
							<AiFillDelete />
						</button>
						{isRemoving && (
							// Overlay
							<div
								className="fixed inset-0 bg-black/50 flex items-center justify-center"
								onClick={() => setIsRemoving(false)}
							>
								// Modal Content
								<div
									className="bg-white p-6 rounded-lg shadow-xl"
									onClick={(e) => e.stopPropagation()}
								>
									<h2 className="text-xl font-bold">
										Are you sure?
									</h2>
									<p className="py-4">
										Do you really want to delete this?
									</p>
									<div className="flex justify-end gap-4">
										<button
											onClick={() => setIsRemoving(false)}
											className="px-4 py-2 bg-gray-200 rounded"
										>
											Cancel
										</button>
										<button
											onClick={() => {
												removeHandler(productId);
												setIsRemoving(false);
											}}
											className="px-4 py-2 bg-red-600 text-white rounded"
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default CartItemsCard;
