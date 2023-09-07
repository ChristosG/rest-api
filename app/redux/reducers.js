const initialState = {
    cartQuantities: [], // Initial cart quantity state
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_CART_QUANTITY':
            const updatedCartQuantities = state.cartQuantities.map((cartQ) =>
                cartQ.product_id === action.payload.product_id
                    ? { ...cartQ, quantity: action.payload.newQuantity }
                    : cartQ
            );
            return { ...state, cartQuantities: updatedCartQuantities };
        default:
            return state;
    }
};

export default cartReducer;
