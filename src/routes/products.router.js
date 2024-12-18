import { Router } from "express";
import ProductManager from "../managers/product-manager.js";

const productsRouter = Router();
const pathFile = "./src/data/products.json"
const productsManager = new ProductManager(pathFile);

// Get all product
productsRouter.get("/", async (req, res) => {
    try {
        let limit = req.query.limit;
        let products = await productsManager.getProducts();
        if (limit) {
            res.send(products.slice(0, limit));
        } else {
            res.send(products);
        }
    } catch (error) {
        console.log("Error el obtener los productos: ", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//Get product for your id
productsRouter.get("/:pid", async (req, res) => {
    let { pid } = req.params;
    try {
        const product = await productsManager.getProductById(parseInt(pid));
        if (!product) {
            return res.json({
                error: "Producto no encontrado"
            });
        }
        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Add new product
productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await productsManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Update product for id
productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const productUpdated = req.body;
    try {
        await productsManager.updateProductForId(parseInt(pid), productUpdated);
        res.json({
            messaje: "Producto actualizado con exito!"
        })
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//Delet product
productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await productsManager.deleteProduct(parseInt(pid));
        res.json({
            message: "Producto eliminado con exito"
        })
    } catch (error) {
        console.error("Error al borrar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor "
        })
    }
})

export default productsRouter;