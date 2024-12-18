import { Router } from "express";
import CartManager from "../managers/cart-manager.js";

const cartRouter = Router();
const pathFile = "./src/data/carts.json"
const cartManager = new CartManager(pathFile);

//Get all cart
cartRouter.get("/all", async (req, res) => {
    try {
        const carts = await cartManager.readCarts();
        res.json(carts);
    } catch (error) {
        console.log("Error al listar los carritos");
        res.status(500).json({error: "Error interno del servidor"})
    }
});

// Create cart
cartRouter.get("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.log("Error al crear un nuevo carrito");
        res.status(500).json({error: "Error interno del servidor"})
    }
});

// List all the products that belong to a cart
cartRouter.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Add products to a cart
cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default cartRouter;