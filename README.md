```markdown
# Entrega 1 - Backend I: Servidor con Express

Este proyecto consiste en un servidor de e-commerce desarrollado con **Node.js** y **Express**. Permite la gestión de productos y carritos mediante persistencia en archivos JSON.

## 🚀 Tecnologías Utilizadas
* **Node.js**: Entorno de ejecución.
* **Express**: Framework para el servidor web.
* **Nodemon**: Herramienta de desarrollo para reinicio automático.
* **FS (FileSystem)**: Módulo nativo para persistencia en archivos.

## 📂 Estructura del Proyecto
* `/src/managers`: Contiene las clases `ProductManager` y `CartManager`.
* `/src/data`: Archivos `.json` donde se guardan los datos.
* `/src/server.js`: Punto de entrada de la aplicación y definición de rutas.

---

## 🛠️ Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/angelicaarvar/entregas-backend1]

```
2. **Instalar dependencias:**
```bash
npm install

```
3. **Ejecutar el servidor:**
```bash
npm run dev

```
*El servidor correrá en: `http://localhost:8080*`

---

## 🚦 Pruebas con Postman

### 📦 Productos (`/api/products`)

* **GET `/**`: Lista todos los productos.
* **GET `/:pid**`: Busca un producto por ID.
* **POST `/**`: Crea un producto nuevo.
* *Body (JSON):*
```json
{
  "title": "Producto de prueba",
  "description": "Descripción",
  "code": "ABC123",
  "price": 500,
  "status": true,
  "stock": 10,
  "category": "Test",
  "thumbnails": []
}

```

* **PUT `/:pid**`: Actualiza campos de un producto.
* **DELETE `/:pid**`: Elimina un producto.


### 🛒 Carritos (`/api/carts`)

* **POST `/**`: Crea un nuevo carrito vacío.
* **GET `/:cid**`: Lista los productos contenidos en un carrito específico.
* **POST `/:cid/product/:pid**`: Agrega un producto al carrito.
* *Nota: Si el producto ya existe, incrementa su cantidad.*


---

## ✨ Autor

[ Angélica Argañaraz Vargas- Comisión 76815 ]

```
