import * as productService from './../../utils/get-products';

test('get products', () => {
    expect(productService.getProducts().length).toBe(8);
});
