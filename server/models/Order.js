import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: { type: Number, required: true },
    // Expanded shippingAddress to include more customer details
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        alternateMobileNumber: { type: String }, // Optional field
    },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentStatus: { type: String, default: 'pending' },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancellation Requested', 'Cancelled'],
        default: 'Pending'
    },
    razorpayOrderId: String,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
