import { useState } from "react";

const productTabs = [
  "All Products",
  "eBooks",
  "Templates",
  "Study Kits",
  "Physical Books",
];

const marketplaceItems = [
  {
    title: "Data Science eBook",
    label: "eBook",
    pages: "450 Pages",
    format: "PDF & EPUB",
    rating: 4.5,
    price: "$39.99",
    oldPrice: "$59.99",
    image: "https://m.media-amazon.com/images/I/A1l5b1RPffL._SY385_.jpg",
  },
  {
    title: "Web Dev Study Kit",
    label: "Study Kit",
    pages: "8 Items",
    format: "Digital Kit",
    rating: 4.5,
    price: "$39.99",
    image: "https://m.media-amazon.com/images/I/71oTUAxrrCL._SY466_.jpg",
  },
  {
    title: "Success Planner",
    label: "Templates",
    pages: "12 Templates",
    format: "Digital Download",
    rating: 4.5,
    price: "$39.99",
    oldPrice: "$69.99",
    image: "https://m.media-amazon.com/images/I/41Ved6pz+QL._SY445_SX342_.jpg",
  },
  {
    title: "Design Fundamental",
    label: "Physical Books",
    pages: "450 Pages",
    format: "Hardcover",
    rating: 4.5,
    price: "$39.99",
    image: "https://m.media-amazon.com/images/I/41L8m3Z-x0L._SY445_SX342_.jpg",
  },
];

export default function MarketplaceSection() {
  const [activeTab, setActiveTab] = useState("All Products");

  return (
    <section className="bg-[#0d0d0d] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          Explore Our Marketplace
        </h2>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
          Discover thousands of engaging courses and resources across various categories taught by expert instructors from around the world.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {productTabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {marketplaceItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow hover:shadow-indigo-500/30 transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-bottom-cover"
              />
              <div className="p-5">
                <span className="inline-block bg-indigo-600 text-xs text-white px-3 py-1 rounded-full mb-3">
                  {item.label}
                </span>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {item.pages} · {item.format}
                </p>

                <div className="flex items-center text-yellow-400 text-sm my-2">
                  ⭐ {item.rating} / 5
                </div>

                <div className="flex gap-2 text-white font-bold text-md">
                  <span>{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-gray-400 line-through">
                      {item.oldPrice}
                    </span>
                  )}
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-transparent border border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white transition rounded-lg text-sm">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
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
