import React, { useState, useEffect, useContext } from 'react';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { FiPlusSquare, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiX, FiGrid, FiUsers, FiUserCheck, FiFileText, FiUser, FiBook, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Product Modal for Create/Edit ---
const ProductModal = ({ product, onClose, onSave }) => {
    const [productDetails, setProductDetails] = useState(
        product || { name: '', description: '', price: 0, category: '', image: '' }
    );
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(product?.image || null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(productDetails).forEach(key => {
            formData.append(key, productDetails[key]);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        onSave(formData, product?._id);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div 
                className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{product ? 'Edit Product' : 'Create Product'}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500"><FiX /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={productDetails.name} onChange={handleChange} placeholder="Product Name" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                    <textarea name="description" value={productDetails.description} onChange={handleChange} placeholder="Product Description" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 h-24" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" name="price" value={productDetails.price} onChange={handleChange} placeholder="Price" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                        <input type="text" name="category" value={productDetails.category} onChange={handleChange} placeholder="Category" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 text-neutral-300">Product Image</label>
                        <input type="file" name="image" onChange={handleImageChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-auto rounded-lg mt-4" />}
                    </div>
                    <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition">Save Product</button>
                </form>
            </motion.div>
        </div>
    );
};


const ManageMarketplace = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { user } = useContext(AuthContext);

    const getSidebarLinks = (role) => {
        if (role === 'admin') {
            return [
                { label: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
                { label: "User Management", path: "/admin/users", icon: <FiUsers /> },
                { label: "Instructor Approvals", path: "/admin/approvals", icon: <FiUserCheck /> },
                { label: "Reports", path: "/admin/reports", icon: <FiFileText /> },
                { label: "Manage Marketplace", path: "/manage-marketplace", icon: <FiShoppingCart /> },
                { label: "Profile", path: "/profile", icon: <FiUser /> },
            ];
        }
        return [
            { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
            { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
            { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
            { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
            { label: "Manage Marketplace", path: "/manage-marketplace", icon: <FiShoppingCart /> },
            { label: "Profile", path: "/profile", icon: <FiUser /> },
        ];
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const url = user.role === 'admin' ? '/products/all' : '/products/my-products';
            const { data } = await API.get(url);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchProducts();
    }, [user]);

    const handleSaveProduct = async (formData, productId) => {
        try {
            if (productId) {
                await API.put(`/products/${productId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchProducts();
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await API.delete(`/products/${productId}`);
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    const handleTogglePublish = async (product) => {
        try {
            await API.put(`/products/${product._id}/publish`, { published: !product.published });
            fetchProducts();
        } catch (error) {
            console.error("Failed to toggle publish status:", error);
        }
    };

    return (
        <div className="flex bg-[#1a1a1a] min-h-screen text-white">
            <Sidebar links={getSidebarLinks(user?.role)} />
            <div className="ml-64 w-full flex flex-col">
                <Navbar />
                <main className="flex-grow p-10">
                    <div className="flex justify-between items-center mb-8 pt-10">
                        <h1 className="text-3xl font-bold">Manage Marketplace</h1>
                        <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                            <FiPlusSquare /> Add Product
                        </button>
                    </div>
                    {isLoading ? <p>Loading products...</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product._id} className="bg-[#111] border border-gray-800 rounded-lg p-4 flex flex-col">
                                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                                    <h2 className="text-xl font-bold">{product.name}</h2>
                                    <p className="text-gray-400 text-sm flex-grow mt-1">{product.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-lg font-semibold text-indigo-400">&#x20B9;{product.price.toFixed(2)}</span>
                                        <span className={`px-3 py-1 text-xs rounded-full ${product.published ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {product.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 border-t border-gray-700 pt-4">
                                        <button onClick={() => handleTogglePublish(product)} className="text-gray-400 hover:text-white">
                                            {product.published ? <FiToggleRight size={24} className="text-green-400"/> : <FiToggleLeft size={24}/>}
                                        </button>
                                        <div>
                                            <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="text-gray-400 hover:text-indigo-400 mr-4"><FiEdit /></button>
                                            <button onClick={() => handleDeleteProduct(product._id)} className="text-gray-400 hover:text-red-400"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
            <AnimatePresence>
                {isModalOpen && <ProductModal product={editingProduct} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />}
            </AnimatePresence>
        </div>
    );
};

export default ManageMarketplace;
