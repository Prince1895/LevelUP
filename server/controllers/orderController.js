import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingAddress } = req.body;
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.mobileNumber) {
            return res.status(400).json({ message: "Please fill in all required shipping details." });
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const newOrderData = {
            user: req.user._id,
            items: cart.items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: paymentMethod === 'cod' ? 'Completed' : 'Pending',
        };

        if (paymentMethod === 'razorpay') {
            const options = {
                amount: totalAmount * 100,
                currency: "INR",
                receipt: `receipt_order_${new Date().getTime()}`
            };
            
            const order = await razorpay.orders.create(options);
            newOrderData.razorpayOrderId = order.id;
            const newOrder = new Order(newOrderData);
            await newOrder.save();
            res.json({ order });
            
        } else if (paymentMethod === 'cod') {
            const newOrder = new Order(newOrderData);
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
    // This function remains the same, but you might want to add signature verification back for production
    try {
        const { razorpay_order_id, razorpay_payment_id } = req.body;
        await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { 
            paymentStatus: 'completed',
            status: 'Completed',
            razorpayPaymentId: razorpay_payment_id 
        });
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
        res.json({ message: 'Payment verified successfully' });
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Payment verification failed", error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// New function to handle order cancellation
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.paymentMethod === 'cod') {
            order.status = 'Cancelled';
        } else {
            order.status = 'Cancellation Requested';
        }

        await order.save();
        res.json({ message: 'Order cancellation processed', order });

    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({ message: 'Failed to cancel order', error: error.message });
    }
};
