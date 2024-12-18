import * as fs from 'fs/promises';

class ProductManager {
    static lastId = 0;
    constructor(path) {
        this.products = [];
        this.path = path
    }

    async addProduct({ title, description, code, status, price, stock, category, thumbnail }) {

        // Podemos leer el archivo y guardarme el array de producto
        const arrayProducts = await this.readProducts();

        if (!title || !description || !code || !status || !price || !stock || !category || !thumbnail) {
            console.log("Ningun codigo valido");
            return;
        }

        // validamos el codigo
        if (arrayProducts.some(item => item.code === code)) {
            console.log("Ya existe un producto con ese codigo!");
            return;
        }

        // si pasamos las validacioens ahora podemos crear el producto
        const newProduct = {
            title,
            description,
            code,
            status,
            price,
            stock,
            category,
            thumbnail
        }

        if (arrayProducts.length > 0) {
            ProductManager.ultId = arrayProducts.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        }

        newProduct.id = ++ProductManager.ultId;

        // una vez que lo puedo crear lo agrego al array
        arrayProducts.push(newProduct);

        // Una vez que agregamos el nuevo producto al array, guardamos el array al archivo
        await this.saveProducts(arrayProducts);
    }

    async getProducts() {
        const arrayProducts = await this.readProducts();
        return arrayProducts;
    }

    async getProductById(id) {
        // Primero leo el archio 
        const arrayProducts = await this.readProducts();
        const product = arrayProducts.find(item => item.id === id);

        if (!product) {
            return "Not found!";
        } else {
            return product;
        }
    }

    async saveProducts(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts));
        } catch (error) {
            console.log("Tenemos un error al guardar el archivo");
        }
    }

    async readProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            if (!data) {
                return [];        
            }
            const arrayProducts = JSON.parse(data);
            return arrayProducts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("Archivo no encontrado, creando uno nuevo...");
                await this.saveProducts([]);
                return [];
            } else if (error instanceof SyntaxError) {
                console.log("Archivo JSON vacío o mal formateado, creando uno nuevo...");
                await this.saveProducts([]);
                return [];
            } else {
                console.log("Tenemos un error al leer el archivo");
                throw error;
            }
        }
    }

    async updateProductForId(id, productUpdated) {
        try {
            const arrayProducts = await this.readProducts();
            const index = arrayProducts.findIndex(prod => prod.id == id);

            if (index != -1) {
                arrayProducts[index] = { ...arrayProducts[index], ...productUpdated };
                await this.saveProducts(arrayProducts);
                console.log("El producto fue actualizado con exito");
            } else {
                console.log("No se encontro el objeto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readProducts();
            const index = arrayProducts.findIndex(prod => prod.id == id);

            if (index != -1) {
                arrayProducts.splice(index, 1);
                this.saveProducts(arrayProducts);
                console.log("Producto eliminado con exito!");
            } else {
                console.log("No se encontro el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;


