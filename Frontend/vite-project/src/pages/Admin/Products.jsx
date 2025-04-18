// src/pages/Admin/Products.jsx
import React, { useEffect, useState } from 'react';
import { Package, Plus } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // TODO: fetch your products from API
    // fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` }})
    //   .then(res => res.json())
    //   .then(data => setProducts(data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <button className="flex items-center space-x-1 bg-[#63D2FF] text-white px-4 py-2 rounded-md hover:bg-[#72D3D5] transition">
          <Plus size={16} />
          <span className="text-sm font-medium">Add Product</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        {products.length === 0 ? (
          <p className="text-gray-500">No products to display.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3">${p.price}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3 space-x-2">
                    <button className="text-[#72D3D5] hover:underline text-xs">Edit</button>
                    <button className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
