import * as fs from 'fs/promises'

class CartManager {
    constructor(path){
        this.carts = [];
        this.path = path;
        this.lastId = 0

        // Load the carts stored in the file
        this.readCarts();
    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
        

            if(this.carts.length > 0) {
                //cart not empty!
                this.lastId = Math.max(...this.carts.map(cart => cart.id ));
                //Method to find the highest ID in the cart array.
            }
        } catch (error) {
             //Si no existe el archivo, lo voy a crear: 
             await this.saveCart(); 
        }

    }

    async  saveCart() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts));
        } catch (error) {
            console.log("Tenemos un error al guardar el archivo");
            console.log(`Error: ${error.message}`);
        }
    }

    async createCart() {
        try {
            const newCart = {
                id: ++this.lastId,
                products: []
            };
            //Add new cart to arrayCart
            this.carts.push(newCart);
            console.log(this.carts);
            await this.saveCart();
            return newCart;
        } catch (error) {
            console.log("Tenemos un error al crear el carrito");
            console.log(`Error: ${error.message}`);
        }
        
    }

    async getCarritoById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId); 

        if(!cart) {
            throw new Error("No existe un carrito con ese id"); 
        }
        return cart; 
        } catch (error) {
            console.log("Tenemos un error al crear el carrito");
            console.log(`Error: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        
        try {
            const cart = await this.getCarritoById(cartId); 

            //Product exist in the cart: 
            const productFind = cart.products.find(p => p.product === productId); 
    
            // If the product is already added to the cart, I increase the quantity.
            // If the product hasn't been added yet, I push it.
            if(productFind) {
                productFind.quantity += quantity; 
            } else {
                cart.products.push({product: productId, quantity}); 
            }
    
            await this.saveCart(); 
            return cart; 
    
        } catch (error) {
            console.log("Tenemos un error al crear el carrito");
            console.log(`Error: ${error.message}`);
        }
       
    }

}

export default CartManager;