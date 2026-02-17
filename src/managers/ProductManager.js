import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            if(fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const size = fs.statSync(this.path).size;
                if(size === 0 ) return [];
                return JSON.parse(data);
            }

        return [];

        } catch (error) {
            console.error('Error al leer el producto', error);
            return [];
        }
    }

    async addProduct(product){
        try {
            const products = await this.getProducts();
            const newProduct = {
                id: uuidv4(),
                ...product
            };

            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        
            return newProduct;
        
        } catch (error) {
            console.error('Error al guardar producto', error);
            throw error;
        }
    }


    async getProductById(id, updateData) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        return product || null;
    }


    async updateProduct(id, updateData) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        products[index] = { ...products[index], ...updateData, id};

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;

        products = products.filter(p => p.id !== id);
        if (products.length === initialLength) return false;

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return true;
    }

}

export default ProductManager;