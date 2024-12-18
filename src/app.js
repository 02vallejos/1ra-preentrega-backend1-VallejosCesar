// Imports
import express from "express"; 
import productsRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js";


// Config server
const app = express(); 
const PORT = 8080; 

//Middleware
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 

//Routes
app.use("/api/products", productsRouter);
app.use("/api/cart",cartRouter);

// ESCUCHANDO EL PUERTO
app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
}) 