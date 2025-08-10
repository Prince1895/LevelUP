import React, { useState, useEffect } from 'react';
import API from '@/api/axios';
import { FiShoppingCart } from 'react-icons/fi';

const MarketplaceSection = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetches all published products from the correct public endpoint.
                const response = await API.get('/products');
                // Limits the display to the first 4 products on the client-side.
                setProducts(response.data.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch products for section:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="bg-[#0d0d0d] text-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                    Explore Our Marketplace
                </h2>
                <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                    Discover thousands of engaging courses and resources across various categories taught by expert instructors from around the world.
                </p>

                {/* Product Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {isLoading ? (
                        <p className="text-center col-span-4">Loading products...</p>
                    ) : (
                        products.map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow hover:shadow-indigo-500/30 transition"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-50 object-fit"
                                />
                                <div className="p-5">
                                    <span className="inline-block bg-indigo-600 text-xs text-white px-3 py-1 rounded-full mb-3">
                                        {item.category}
                                    </span>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center text-yellow-400 text-sm my-2">
                                        ⭐ 4.5 / 5
                                    </div>

                                    <div className="flex gap-2 text-white font-bold text-md">
                                        <span>&#x20B9;{item.price.toFixed(2)}</span>
                                    </div>

                                    <button className="w-full mt-4 px-4 py-2 bg-transparent border border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white transition rounded-lg text-sm flex items-center justify-center gap-2">
                                        <FiShoppingCart /> Add To Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* View All Button */}
                <div className="flex justify-center mt-12">
                    <a
                        href="/marketplace"
                        className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-lg text-sm"
                    >
                        View All Products →
                    </a>
                </div>
            </div>
        </section>
    );
}

export default MarketplaceSection;