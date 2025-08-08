import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [] });
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const itemIndex = cart.items.findIndex(p => p.product == productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
    } else {
        cart = new Cart({
            user: req.user._id,
            items: [{ product: productId, quantity }]
        });
    }
    await cart.save();
    res.status(201).json(cart);
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    await Cart.updateOne({ user: req.user._id }, { $pull: { items: { product: productId } } });
    res.json({ message: 'Product removed from cart' });
};
