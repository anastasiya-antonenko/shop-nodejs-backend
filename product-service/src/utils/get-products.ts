import { productList } from '../products';

export const getProducts = () => {
    return productList;
}

export function getProductsById(products: any[], id: string) {
    return products.find(item => item.id === id);
}
