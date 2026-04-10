import { Router } from "express";
import { cartModel } from "../models/cart-model.js";

const router = Router();

router.post('/', async (req, res) => { 
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);

        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json({ status: 'success', payload: cart });

    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        // filtramos el array dejando afuera el producto q queremos borrar
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        // vaciamos el array de productos
        cart.products = [];
        
        await cart.save();
        res.json({ status: 'success', message: 'Carrito vaciado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


export default router;