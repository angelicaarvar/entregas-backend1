import { Router } from "express";
import { productModel } from "../models/product-model.js";

const router = Router();


//listado de productos
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;


        //filtro de busqueda
        let filter = {};
        if (query) {
            if (query === true || query === false) {
                filter.status = query === 'true';
            } else {
                filter.category = query;
            }
        }

        //paginacion
        let options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };

        //ordenamiento
        if (sort === 'asc') {
            options.sort = { price: 1 };
        } else if (sort === 'desc') {
            options.sort = { price: -1 };
        }

        //busqueda y paginacion x parte de mongo
        const result = await productModel.paginate(filter, options);

        //respuesta como dice conisgna
        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `api/products?page=${result.nextPage}&limit=${limit}` : null,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


router.get('/:pid', async (req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid);

        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el producto' });
    }
});


router.post('/', async (req,res)=>{
    try {
        const newProduct = await productModel.create(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });

    } catch (error) {
        res.status(400).json({status:'error', error: error.message });
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const updateProduct = await productModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updateProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ status: 'success', payload: updateProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

export default router;

