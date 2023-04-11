import * as productService from './../../utils/get-products';
import { productList } from '../../products';

const testProduct = {
        "count": 4,
        "description": "Short Product Description1",
        "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        "price": 2.4,
        "title": "ProductOne"
}

describe('get product', () => {
    it('return correct product', () => {
        const spy = jest.spyOn(productService, 'getProductsById');
        const product = productService.getProductsById(productList, testProduct.id);

        spy.mockReturnValue(productList);
        expect(product).toEqual(testProduct);
    })
});
