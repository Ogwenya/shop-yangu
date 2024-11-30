"use client";

import { useState, useEffect } from "react";
import ProductForm from "@/components/product-form";
import DeleteProduct from "./delete-product";

const ColumnActions = ({ product }) => {
	const [shops, setShops] = useState([]);

	useEffect(() => {
		async function fetchShops() {
			const response = await fetch(`/api/shops`);
			const data = await response.json();
			setShops(data);
		}
		fetchShops();
	}, []);

	return (
		<div className="flex items-center gap-3">
			<ProductForm product={product} shops={shops} />

			<DeleteProduct product={product} />
		</div>
	);
};

export default ColumnActions;
