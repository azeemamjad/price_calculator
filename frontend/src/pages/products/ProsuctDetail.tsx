import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Product {
    _id: string;
    title: string;
    description?: string;
    price: number;
    discount: number;
    pictures?: string[];
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(setProduct);
    }, [id]);

    const addToCart = async () => {
        await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId: id, quantity })
        });
        alert('Added to cart!');
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <h2>{product.title}</h2>
            <img src={product.pictures?.[0]} alt={product.title} style={{ width: 300 }} />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            {product.discount > 0 && <p>Discount: {product.discount}%</p>}
            <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
            />
            <button onClick={addToCart}>Add to Cart</button>
        </div>
    );
}