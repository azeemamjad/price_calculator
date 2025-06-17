import React from 'react';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    discount: number;
    category: string;
    pictures: string[];
  };
  onUpdate: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow relative">
      <h3 className="font-semibold">{product.title}</h3>
      <p>Price: ${product.price - product.discount}</p>
      <p className="text-sm text-gray-600">Category: {product.category}</p>

      {product.pictures?.[0] && (
        <img
          src={`http://localhost:5000/${product.pictures[0]}`}
          alt={product.title}
          className="w-full h-40 object-cover mt-2"
        />
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onUpdate(product._id)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
