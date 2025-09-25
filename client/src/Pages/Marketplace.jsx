import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiShoppingCart, FiTrash2, FiCreditCard, FiPackage, FiFilter, FiX, FiLoader, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-indigo-500 text-4xl" />
    </div>
);

const ProductList = ({ products, addToCart, user, onSelectProduct }) => {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {products.map((product, i) => (
                <motion.div
                    key={product._id}
                    className="bg-[#111] border border-gray-800 rounded-lg p-4 flex flex-col group cursor-pointer"
                    onClick={() => onSelectProduct(product)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <div className="relative">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {user && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                                    className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-semibold"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mt-2">{product.name}</h2>
                    <p className="text-gray-400 text-sm flex-grow mt-1 truncate">{product.description}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-semibold text-indigo-400">&#x20B9;{product.price.toFixed(2)}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{product.category}</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

const CartView = ({ cart, removeFromCart, setView }) => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-10">Your cart is empty.</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.product._id} className="flex justify-between items-center bg-[#111] p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-4">
                                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                    <h3 className="text-xl font-bold">{item.product.name}</h3>
                                    <p>&#x20B9;{item.product.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.product._id)}><FiTrash2 className="text-red-500 hover:text-red-400" /></button>
                        </div>
                    ))}
                    <div className="text-right text-2xl font-bold mt-4">
                        Total: &#x20B9;{total.toFixed(2)}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={() => setView('checkout')} className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md font-semibold">Proceed to Checkout</button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

const CheckoutView = ({ handleCheckout }) => {
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        mobileNumber: '',
        alternateMobileNumber: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleCheckout('razorpay', shippingDetails);
    };

    return (
        <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Shipping & Payment</h2>
            <div className="space-y-4 bg-[#111] p-8 rounded-lg">
                <div>
                    <label htmlFor="fullName" className="block text-sm mb-1 text-neutral-300">Full Name</label>
                    <input 
                        type="text" 
                        name="fullName" 
                        id="fullName" 
                        value={shippingDetails.fullName} 
                        onChange={handleChange} 
                        className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" 
                        required 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm mb-1 text-neutral-300">Mobile Number</label>
                        <input 
                            type="tel" 
                            name="mobileNumber" 
                            id="mobileNumber" 
                            value={shippingDetails.mobileNumber} 
                            onChange={handleChange} 
                            className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="alternateMobileNumber" className="block text-sm mb-1 text-neutral-300">Alternate Mobile (Optional)</label>
                        <input 
                            type="tel" 
                            name="alternateMobileNumber" 
                            id="alternateMobileNumber" 
                            value={shippingDetails.alternateMobileNumber} 
                            onChange={handleChange} 
                            className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" 
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm mb-1 text-neutral-300">Address</label>
                    <input 
                        type="text" 
                        name="address" 
                        id="address" 
                        value={shippingDetails.address} 
                        onChange={handleChange} 
                        className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" 
                        required 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm mb-1 text-neutral-300">City</label>
                        <input 
                            type="text" 
                            name="city" 
                            id="city" 
                            value={shippingDetails.city} 
                            onChange={handleChange} 
                            className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="postalCode" className="block text-sm mb-1 text-neutral-300">Postal Code</label>
                        <input 
                            type="text" 
                            name="postalCode" 
                            id="postalCode" 
                            value={shippingDetails.postalCode} 
                            onChange={handleChange} 
                            className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" 
                            required 
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="country" className="block text-sm mb-1 text-neutral-300">Country</label>
                    <input 
                        type="text" 
                        name="country" 
                        id="country" 
                        value={shippingDetails.country} 
                        onChange={handleChange} 
                        className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" 
                        required 
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-end gap-4 pt-4">
                    <button 
                        type="button" 
                        onClick={() => handleCheckout('cod', shippingDetails)} 
                        className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 flex items-center justify-center gap-2 p-4 rounded-lg font-semibold"
                    >
                        <FiPackage /> Pay with Cash on Delivery
                    </button>
                    <button 
                        onClick={onFormSubmit} 
                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 p-4 rounded-lg font-semibold"
                    >
                        <FiCreditCard /> Pay with Razorpay
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const OrderHistory = ({ orders, onSelectOrder }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-400';
            case 'Pending': return 'text-yellow-400';
            case 'Cancellation Requested': return 'text-orange-400';
            case 'Cancelled': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {orders.length === 0 ? (
                <p className="text-center text-gray-400 py-10">You have no past orders.</p>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="bg-[#111] p-4 rounded-lg mb-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold">Order ID: {order._id.slice(-8)}</h3>
                            <p>Total: &#x20B9;{order.totalAmount.toFixed(2)}</p>
                            <p>Status: <span className={`font-semibold ${getStatusClass(order.status)}`}>{order.status}</span></p>
                        </div>
                        <button onClick={() => onSelectOrder(order)} className="text-indigo-400 flex items-center gap-2">
                            <FiInfo /> View Details
                        </button>
                    </div>
                ))
            )}
        </motion.div>
    );
};

const OrderDetailModal = ({ order, onClose, onCancelOrder }) => {
    const canCancel = order.status === 'Completed' || order.status === 'Pending';
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 text-white">
            <motion.div
                className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500"><FiX /></button>
                </div>
                
                {/* Order Information */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Order ID: {order._id.slice(-8)}</h3>
                    <p>Total: &#x20B9;{order.totalAmount.toFixed(2)}</p>
                    <p>Payment Method: {order.paymentMethod}</p>
                    <p>Status: <span className="font-semibold">{order.status}</span></p>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Items:</h3>
                    {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg mb-2">
                            <img 
                                src={item.product?.image || '/placeholder.jpg'} 
                                alt={item.product?.name || 'Product'} 
                                className="w-16 h-16 object-cover rounded-md" 
                            />
                            <div>
                                <h4 className="font-bold">{item.product?.name || 'Unknown Product'}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: &#x20B9;{(item.product?.price || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipping Details */}
                {order.shippingAddress && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2">Shipping Address:</h3>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p>Mobile: {order.shippingAddress.mobileNumber}</p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end mt-6">
                    {canCancel && (
                        <button 
                            onClick={() => onCancelOrder(order._id)} 
                            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold"
                        >
                            {order.paymentMethod === 'cod' ? 'Cancel Order' : 'Request Cancellation'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Product Detail Modal
const ProductDetailModal = ({ product, onClose, addToCart, user }) => {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4 text-black">
            <motion.div
                className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-3xl border border-gray-700 max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">{product.name}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500"><FiX /></button>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-96 object-cover rounded-lg mb-4" 
                        />
                    </div>
                    
                    <div className="lg:w-1/2">
                        <div className="mb-4">
                            <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">{product.category}</span>
                        </div>
                        
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{product.description}</p>
                        
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-indigo-400">&#x20B9;{product.price.toFixed(2)}</span>
                        </div>
                        
                        {user && (
                            <button
                                onClick={() => {
                                    addToCart(product._id);
                                    onClose();
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 p-4 rounded-lg font-semibold text-lg"
                            >
                                <FiShoppingCart /> Add to Cart
                            </button>
                        )}
                        
                        {!user && (
                            <p className="text-gray-400 text-center">Please log in to add items to cart</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState('products');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadData = async () => {
        setIsLoading(true);
        try {
            const productRes = await API.get('/products');
            setProducts(productRes.data);

            if (user) {
                const [cartRes, ordersRes] = await Promise.all([
                    API.get('/cart'),
                    API.get('/orders/my-orders')
                ]);
                setCart(cartRes.data.items || []);
                setOrders(ordersRes.data);
            }
        } catch (error) {
            console.error("Failed to load marketplace data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const addToCart = async (productId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            await API.post('/cart', { productId, quantity: 1 });
            const { data } = await API.get('/cart');
            setCart(data.items);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await API.delete(`/cart/${productId}`);
            const { data } = await API.get('/cart');
            setCart(data.items);
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const handleCheckout = async (paymentMethod, shippingAddress) => {
        try {
            if (paymentMethod === 'razorpay') {
                const { data: { order } } = await API.post('/orders/create', { 
                    paymentMethod, 
                    shippingAddress 
                });
                
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: "INR",
                    name: "SkillSphere Marketplace",
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            await API.post('/orders/verify', { 
                                ...response, 
                                orderId: order.id 
                            });
                            loadData();
                            setView('orders');
                        } catch (error) {
                            console.error('Payment verification failed:', error);
                            alert('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: shippingAddress.fullName,
                        contact: shippingAddress.mobileNumber,
                    },
                    theme: {
                        color: '#4f46e5'
                    }
                };
                
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                await API.post('/orders/create', { 
                    paymentMethod, 
                    shippingAddress 
                });
                loadData();
                setView('orders');
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await API.put(`/orders/${orderId}/cancel`);
                loadData();
                setSelectedOrder(null);
            } catch (error) {
                console.error("Failed to cancel order:", error);
                alert('Failed to cancel order. Please try again.');
            }
        }
    };

    const activeClass = "bg-indigo-600 text-white";
    const inactiveClass = "bg-gray-800 text-gray-300 hover:bg-gray-700";

    return (
        <div className="bg-[#1a1a1a] min-h-screen pb-8">
            <Navbar />
            <main className="container mx-auto pt-24 px-4 text-white">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Marketplace</h1>
                    {user && (
                        <div className="flex items-center gap-2 bg-[#111] p-1 rounded-lg">
                            <button 
                                onClick={() => setView('products')} 
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${view === 'products' ? activeClass : inactiveClass}`}
                            >
                                <FiFilter /> Products
                            </button>
                            <button 
                                onClick={() => setView('cart')} 
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${view === 'cart' ? activeClass : inactiveClass}`}
                            >
                                <FiShoppingCart /> Cart ({cart.length})
                            </button>
                            <button 
                                onClick={() => setView('orders')} 
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${view === 'orders' ? activeClass : inactiveClass}`}
                            >
                                <FiPackage /> My Orders
                            </button>
                        </div>
                    )}
                </div>

                {isLoading ? <LoadingSpinner /> : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {view === 'products' && (
                                products.length > 0 ? (
                                    <ProductList 
                                        products={products} 
                                        addToCart={addToCart} 
                                        user={user} 
                                        onSelectProduct={setSelectedProduct}
                                    />
                                ) : (
                                    <p className="text-center text-gray-400 py-10">No products available at the moment.</p>
                                )
                            )}
                            {view === 'cart' && (
                                <CartView 
                                    cart={cart} 
                                    removeFromCart={removeFromCart} 
                                    setView={setView} 
                                />
                            )}
                            {view === 'checkout' && (
                                <CheckoutView handleCheckout={handleCheckout} />
                            )}
                            {view === 'orders' && (
                                <OrderHistory 
                                    orders={orders} 
                                    onSelectOrder={setSelectedOrder} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>
            <Footer />
            
            {/* Modals */}
            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailModal 
                        order={selectedOrder} 
                        onClose={() => setSelectedOrder(null)} 
                        onCancelOrder={handleCancelOrder} 
                    />
                )}
                {selectedProduct && (
                    <ProductDetailModal 
                        product={selectedProduct} 
                        onClose={() => setSelectedProduct(null)} 
                        addToCart={addToCart} 
                        user={user} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Marketplace;