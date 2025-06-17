import { useEffect, useState } from 'react';

interface CartProduct {
    id: string;
    title: string;
    price: number;
    discount: number;
    picture?: string;
}

interface CartItem {
    product: CartProduct;
    quantity: number;
    total: number;
}

interface CartResponse {
    items: CartItem[];
    fullBill: number;
}

export default function Cart() {
    const [cart, setCart] = useState<CartResponse>({ items: [], fullBill: 0 });

    useEffect(() => {
        fetch('http://localhost:5000/api/cart', { credentials: 'include' })
            .then(res => res.json())
            .then(setCart);
    }, []);

    return (
        <div>
            <h2>Your Cart</h2>
            {cart.items.length === 0 ? (
                <p>Cart is empty.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Product</th><th>Price</th><th>Discount</th><th>Quantity</th><th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.items.map(item => (
                            <tr key={item.product.id}>
                                <td>{item.product.title}</td>
                                <td>${item.product.price}</td>
                                <td>{item.product.discount}%</td>
                                <td>{item.quantity}</td>
                                <td>${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3>Full Bill: ${cart.fullBill.toFixed(2)}</h3>
        </div>
    );
}