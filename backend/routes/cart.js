import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Initialize cart in session
function getCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

// Add product to cart
router.post("/add", async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const cart = getCart(req);
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  res.json({ cart });
});

// Get cart with product details and total
router.get("/", async (req, res) => {
  const cart = getCart(req);
  const detailedCart = await Promise.all(
    cart.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) return null;
      const priceAfterDiscount =
        product.price - (product.price * (product.discount || 0)) / 100;
      return {
        product: {
          id: product._id,
          title: product.title,
          price: product.price,
          discount: product.discount,
          picture: product.pictures[0]
        },
        quantity: item.quantity,
        total: priceAfterDiscount * item.quantity
      };
    })
  );

  const filteredCart = detailedCart.filter(Boolean);
  const fullBill = filteredCart.reduce((sum, item) => sum + item.total, 0);

  res.json({ items: filteredCart, fullBill });
});

export default router;
