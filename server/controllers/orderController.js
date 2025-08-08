import Order from '../models/Order.js';
import Cart from '../models/Cart.js'; // Assuming you have a Cart model
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    const { paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (paymentMethod === 'razorpay') {
        const options = {
            amount: totalAmount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`
        };
        try {
            const order = await razorpay.orders.create(options);
            const newOrder = new Order({ user: req.user._id, items: cart.items, totalAmount, paymentMethod, razorpayOrderId: order.id });
            await newOrder.save();
            res.json({ order });
        } catch (error) {
            console.error("Razorpay order creation error:", error);
            res.status(500).json({ message: "Failed to create Razorpay order" });
        }
    } else if (paymentMethod === 'cod') {
        const newOrder = new Order({ user: req.user._id, items: cart.items, totalAmount, paymentMethod, paymentStatus: 'completed' });
        await newOrder.save();
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
        res.json({ message: 'Order placed successfully with Cash on Delivery' });
    } else {
        res.status(400).json({ message: "Invalid payment method" });
    }
};

export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment is authentic
        await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { 
            paymentStatus: 'completed',
            razorpayPaymentId: razorpay_payment_id 
        });
        // Clear the user's cart after successful payment
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
        res.json({ message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ message: 'Payment verification failed' });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
