import express from 'express';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import path from 'path';

const app = express();
const PORT = 8080;

const productManager = new ProductManager('./src/data/products.json');
const cartManager = new CartManager('./src/data/carts.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//handlebarss
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})
const io = new Server(httpServer);


app.get('/', async (req,res)=>{
    try {
        const products = await productManager.getProducts();

        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
})

app.get('/realtimeproducts', async (req,res)=>{

    res.render('realTimeProducts');
})

//listado de productos
app.get('/api/products', async (req, res) => {
    console.log("productos varios varios"); // <--- BORRAR es prueba
    try {
        const products = await productManager.getProducts();
        res.json(products);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
})

//traer por id
app.get('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params; //saca el id de la url
        const product = await productManager.getProductById(pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);

    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el producto' });
    }
})

//prod nuevo
app.post('/api/products', async (req, res) => {
    try {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });

        res.status(201).json(newProduct);

    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
})

//actualizar prod
app.put('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateProduct = await productManager.updateProduct(pid, req.body);

        if (!updateProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updateProduct);

    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
})


//borrar prod
app.delete('/api/products/:pid', async (req, res)=>{
    try {
        const { pid } = req.params;
        const success = await productManager.deleteProduct(pid);

        if (!success) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado' });

    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
})


//rutas del carrito 
//crear carro

app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear carrito' });
    }
})

//listar prod del carro
app.get('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart.products); //da array de productos del carro

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
});

//agregar prod al carro
app.post('/api/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const productExists = await productManager.getProductById(pid);
        if (!productExists) {
            return res.status(404).json({ error: 'El producto que intentas agregar no existe' });
        }

        const cart = await cartManager.addProductToCart(cid, pid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);

    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
})



//inicializa servidor

io.on('connection', async (socket)=>{
    console.log('Cliente conectado al servidor');
    
    const proucts = await productManager.getProducts();
    socket.emit('updateProducts', proucts);

    socket.on('addProduct', async (newProduct) => {
        await productManager.addProduct(newProduct);
        const updatedProducts = await productManager.getProducts();

        io.emit('updateProducts', updatedProducts);
    })


    socket.on('deleteProduct', async (productId) => {
        console.log('Producto a eliminar:', productId);

        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getProducts();

        io.emit('updateProducts', updatedProducts);
    })
})