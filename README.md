# 🛒 E-Commerce Backend API - Node.js & MongoDB

Este proyecto consiste en el desarrollo de una API RESTful para gestionar el backend de una plataforma de e-commerce. La aplicación permite administrar un catálogo de productos, gestionar carritos de compras con referencias pobladas, y ofrece vistas dinámicas interactuando en tiempo real con el servidor.

**Estudiante:** Angélica Argañaraz Vargas
**Curso:** Programación Backend I

## 🚀 Tecnologías y Herramientas Utilizadas

* **Entorno de Ejecución:** Node.js
* **Framework Web:** Express.js
* **Base de Datos:** MongoDB Atlas
* **ODM:** Mongoose (incluyendo `mongoose-paginate-v2`)
* **Motores de Plantillas:** Express-Handlebars
* **WebSockets:** Socket.io (para actualizaciones en tiempo real)
* **Frontend interactivo:** SweetAlert2 (Notificaciones al cliente)
* **Variables de Entorno:** Dotenv

## 📁 Arquitectura del Proyecto (MVC)

El proyecto fue refactorizado para abandonar el uso de `FileSystem` y migrar hacia una base de datos escalable en la nube, estructurando el código de la siguiente manera:

```text
📦 src
 ┣ 📂 config
 ┃ ┗ 📜 db-connection.js      # Lógica de conexión a MongoDB Atlas
 ┣ 📂 models
 ┃ ┣ 📜 cart-model.js         # Esquema de Mongoose para el carrito
 ┃ ┗ 📜 product-model.js      # Esquema de Mongoose para productos (con paginación)
 ┣ 📂 public
 ┃ ┗ 📂 js
 ┃   ┗ 📜 realtime.js         # Lógica del cliente para WebSockets
 ┣ 📂 routes
 ┃ ┣ 📜 carts-router.js       # Endpoints API para la gestión de carritos
 ┃ ┗ 📜 product-router.js     # Endpoints API para la gestión de productos
 ┣ 📂 views
 ┃ ┣ 📂 layouts
 ┃ ┃ ┗ 📜 main.handlebars     # Plantilla principal HTML
 ┃ ┣ 📜 cart.handlebars       # Vista en detalle del carrito (con cálculos y eliminación)
 ┃ ┣ 📜 home.handlebars       # Vista estática de productos
 ┃ ┣ 📜 products.handlebars   # Catálogo paginado con botones de "Agregar al Carrito"
 ┃ ┗ 📜 realTimeProducts.handlebars # Panel de administrador WebSockets
 ┣ 📜 server.js               # Punto de entrada de la aplicación
 ┗ 📜 utils.js                # Configuraciones de rutas absolutas (__dirname)

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
3. **Configurar las variables de entorno:**
Crear un archivo .env en la raíz del proyecto (al mismo nivel que package.json) y agregar la cadena de conexión a MongoDB Atlas y el puerto:
```Fragmento de código
PORT=8080
MONGO_URL=mongodb+srv://<tu-usuario>:<tu-contraseña>@cluster0...
```
4. **Ejecutar el servidor:**
```bash
npm run dev

```
*El servidor correrá en: `http://localhost:8080*`

---
🌐 Endpoints y Vistas
🖥️ Vistas Frontend (Handlebars)
GET /products: Muestra el catálogo completo de productos utilizando paginación. Incluye botones para agregar ítems al carrito con notificaciones de SweetAlert2.

GET /carts/:cid: Muestra el detalle de un carrito específico. Utiliza .populate() para traer los datos reales de cada producto. Permite eliminar productos individuales o vaciar el carrito por completo simulando una compra.

GET /realtimeproducts: Panel de administración que utiliza WebSockets para agregar o eliminar productos, actualizando la pantalla de todos los clientes conectados al instante sin recargar la página.

🔌 API RESTful
Rutas de Productos (/api/products)

GET /: Obtiene todos los productos. Soporta query params: ?limit=, ?page=, ?sort=asc/desc, y ?query= (para buscar por categoría o estado).

GET /:pid: Obtiene un producto por su ID.

POST /: Crea un nuevo producto.

PUT /:pid: Actualiza un producto existente.

DELETE /:pid: Elimina un producto.

Rutas de Carritos (/api/carts)

POST /: Crea un nuevo carrito vacío.

GET /:cid: Obtiene los productos de un carrito (poblados).

POST /:cid/products/:pid: Agrega un producto al carrito. Si ya existe, incrementa la propiedad quantity.

DELETE /:cid/products/:pid: Elimina un producto específico del carrito seleccionado.

DELETE /:cid: Vacía por completo el carrito seleccionado.


---

## ✨ Autor

[ Angélica Argañaraz Vargas- Comisión 76815 ]


