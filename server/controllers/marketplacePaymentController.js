import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        if (paymentMethod === 'razorpay') {
            const options = {
                amount: totalAmount * 100,
                currency: "INR",
                receipt: `marketplace_${new Date().getTime()}`
            };
            
            const order = await razorpay.orders.create(options);
            const newOrder = new Order({ 
                user: req.user._id, 
                items: cart.items, 
                totalAmount, 
                paymentMethod, 
                razorpayOrderId: order.id 
            });
            await newOrder.save();
            res.json({ order });
            
        } else if (paymentMethod === 'cod') {
            const newOrder = new Order({ 
                user: req.user._id, 
                items: cart.items, 
                totalAmount, 
                paymentMethod, 
                paymentStatus: 'completed' 
            });
            await newOrder.save();
            await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
            res.json({ message: 'Order placed successfully with Cash on Delivery' });
        } else {
            res.status(400).json({ message: "Invalid payment method" });
        }
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { 
                paymentStatus: 'completed',
                razorpayPaymentId: razorpay_payment_id 
            });
            await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
            res.json({ message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Payment verification failed", error: error.message });
    }
};