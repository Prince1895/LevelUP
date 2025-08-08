import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiShoppingCart, FiTrash2, FiCreditCard, FiPackage, FiFilter, FiShare2, FiX, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Dummy Data for UI Preview ---
const sampleProducts = [
    { _id: '1', name: 'Web Dev Study Kit', description: 'A comprehensive kit for aspiring web developers.', price: 499.00, category: 'eBook', image: 'https://m.media-amazon.com/images/I/71oTUAxrrCL._SY466_.jpg', createdBy: { name: 'Admin' } },
    { _id: '2', name: 'Data Science eBook', description: 'Master data science fundamentals with this eBook.', price: 799.00, category: 'eBook', image: 'https://m.media-amazon.com/images/I/A1l5b1RPffL._SY385_.jpg', createdBy: { name: 'Admin' } },
    { _id: '3', name: 'UI/UX Design Templates', description: 'A collection of modern UI/UX templates.', price: 1299.00, category: 'Templates', image: 'https://m.media-amazon.com/images/I/41Ved6pz+QL._SY445_SX342_.jpg', createdBy: { name: 'Admin' } },
    { _id: '4', name: 'Design Fundamentals Book', description: 'A physical book covering the principles of design.', price: 1999.00, category: 'Physical Books', image: 'https://m.media-amazon.com/images/I/41L8m3Z-x0L._SY445_SX342_.jpg', createdBy: { name: 'Admin' } },
];

// --- Sub-components ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-indigo-500 text-4xl" />
    </div>
);

const ProductList = ({ products, addToCart, user }) => {
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
                    className="bg-[#111] border border-gray-800 rounded-lg p-4 flex flex-col group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <div className="relative">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {user && (
                                <button onClick={() => addToCart(product._id)} className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-semibold">Add to Cart</button>
                            )}
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mt-2">{product.name}</h2>
                    <p className="text-gray-400 text-sm flex-grow mt-1">{product.description}</p>
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
                                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md"/>
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
    return (
        <motion.div className="max-w-md mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-4 text-center">Select Payment Method</h2>
            <div className="space-y-4">
                <button onClick={() => handleCheckout('razorpay')} className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 p-4 rounded-lg font-semibold">
                    <FiCreditCard /> Pay with Razorpay
                </button>
                <button onClick={() => handleCheckout('cod')} className="w-full bg-gray-500 hover:bg-gray-600 flex items-center justify-center gap-2 p-4 rounded-lg font-semibold">
                    <FiPackage /> Cash on Delivery
                </button>
            </div>
        </motion.div>
    );
};

const OrderHistory = ({ orders }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {orders.length === 0 ? (
                <p className="text-center text-gray-400 py-10">You have no past orders.</p>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="bg-[#111] p-4 rounded-lg mb-4">
                        <h3 className="text-xl font-bold">Order ID: {order._id}</h3>
                        <p>Total: &#x20B9;{order.totalAmount.toFixed(2)}</p>
                        <p>Status: <span className={`font-semibold ${order.paymentStatus === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{order.paymentStatus}</span></p>
                        <p>Payment Method: {order.paymentMethod}</p>
                    </div>
                ))
            )}
        </motion.div>
    );
};

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState('products');
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const productRes = await API.get('/products');
                setProducts(productRes.data.length > 0 ? productRes.data : sampleProducts);

                if (user) {
                    const [cartRes, ordersRes] = await Promise.all([
                        API.get('/cart'),
                        API.get('/orders/my-orders')
                    ]);
                    setCart(cartRes.data.items);
                    setOrders(ordersRes.data);
                }
            } catch (error) {
                console.error("Failed to load marketplace data:", error);
                setProducts(sampleProducts); // Fallback to dummy data on error
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user]);

    const addToCart = async (productId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        await API.post('/cart', { productId, quantity: 1 });
        const { data } = await API.get('/cart');
        setCart(data.items);
    };

    const removeFromCart = async (productId) => {
        await API.delete(`/cart/${productId}`);
        const { data } = await API.get('/cart');
        setCart(data.items);
    };

    const handleCheckout = async (paymentMethod) => {
        if (paymentMethod === 'razorpay') {
            const { data: { order } } = await API.post('/orders/create', { paymentMethod });
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "SkillSphere Marketplace",
                order_id: order.id,
                handler: async (response) => {
                    await API.post('/orders/verify', { ...response, orderId: order.id });
                    const [cartRes, ordersRes] = await Promise.all([API.get('/cart'), API.get('/orders/my-orders')]);
                    setCart(cartRes.data.items);
                    setOrders(ordersRes.data);
                    setView('orders');
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            await API.post('/orders/create', { paymentMethod });
            const [cartRes, ordersRes] = await Promise.all([API.get('/cart'), API.get('/orders/my-orders')]);
            setCart(cartRes.data.items);
            setOrders(ordersRes.data);
            setView('orders');
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
                            <button onClick={() => setView('products')} className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${view === 'products' ? activeClass : inactiveClass}`}><FiFilter /> Products</button>
                            <button onClick={() => setView('cart')} className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${view === 'cart' ? activeClass : inactiveClass}`}><FiShoppingCart /> Cart ({cart.length})</button>
                            <button onClick={() => setView('orders')} className={`px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2 ${view === 'orders' ? activeClass : inactiveClass}`}><FiPackage /> My Orders</button>
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
                            {view === 'products' && <ProductList products={products} addToCart={addToCart} user={user} />}
                            {view === 'cart' && <CartView cart={cart} removeFromCart={removeFromCart} setView={setView} />}
                            {view === 'checkout' && <CheckoutView handleCheckout={handleCheckout} />}
                            {view === 'orders' && <OrderHistory orders={orders} />}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Marketplace;
