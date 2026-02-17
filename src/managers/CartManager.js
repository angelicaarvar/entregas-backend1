import { log } from 'console';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CartManager{
    constructor(path){
        this.path = path;
    }

    async getCarts(){
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            return [];
        }
    }

    async createCart(){
        const carts = await this.getCarts();

        const newCart = {
            id: uuidv4(),
            products: []
        };

        carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id){
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);

        return cart || null;
    }

    async addProductToCart(cartId, productId){
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if(cartIndex === -1) return null;

        const cleanProductId = String(productId).trim();

        const productIndex = carts[cartIndex].products.findIndex(p => String(p.product).trim() === cleanProductId);

        if (productIndex !== -1) {
            //prod ya estaba
            carts[cartIndex].products[productIndex].quantity++;
        } else{
            //agregamos prod
            carts[cartIndex].products.push({
                product: productId,
                quantity: 1
            })
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

        return carts[cartIndex];
    }
}

export default CartManager;
