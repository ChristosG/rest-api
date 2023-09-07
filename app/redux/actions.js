export const updateCartQuantity = (product_id, newQuantity) => ({
    type: 'UPDATE_CART_QUANTITY',
    payload: { product_id, newQuantity },
});