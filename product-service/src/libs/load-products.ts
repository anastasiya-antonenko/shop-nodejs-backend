import { getProducts } from "../utils/get-products";

export const loadProducts = () => Promise.resolve(getProducts());
