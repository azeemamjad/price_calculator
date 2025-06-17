import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
    _id: string;
    title: string;
    price: number;
    discount: number;
    pictures?: string[];
    category?: { name: string };
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(setProducts);
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {products.map(p => (
                    <div key={p._id} style={{ border: '1px solid #ccc', padding: 16, width: 200 }}>
                        <img src={p.pictures?.[0]} alt={p.title} style={{ width: '100%' }} />
                        <h3>{p.title}</h3>
                        <p>Price: ${p.price}</p>
                        {p.discount > 0 && <p>Discount: {p.discount}%</p>}
                        <Link to={`/products/${p._id}`}>View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}