import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import path from 'path';
import { connectDB } from './config/db-connection.js';
import { productModel } from './models/product-model.js';
import productsRouter from './routes/product-router.js';
import cartsRouter from './routes/carts-router.js';
import { cartModel } from './models/cart-model.js';

const app = express();
const PORT = 8080;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
    try {
        const products = await productModel.find().lean();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const result = await productModel.paginate({}, { page, limit, lean: true });

        res.render('products', {
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar la vista' });
    }
})

// Vista de un carro específico
app.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send('Error al cargar la vista del carrito');
    }
});


app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
io.on('connection', async (socket) => {
    console.log('Cliente conectado al servidor');

    const products = await productModel.find().lean();
    socket.emit('updateProducts', products);

    socket.on('addProduct', async (newProduct) => {
        await productModel.create(newProduct);
        const updatedProducts = await productModel.find().lean();
        io.emit('updateProducts', updatedProducts);
    });

    socket.on('deleteProduct', async (productId) => {
        await productModel.findByIdAndDelete(productId);
        const updatedProducts = await productModel.find().lean();
        io.emit('updateProducts', updatedProducts);
    });

});
