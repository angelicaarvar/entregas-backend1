const socket = io();

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(prod => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${prod.title}</strong> - $${prod.price} <small>(Código: ${prod.description})</small>
            <button class="btn-delete" data-id="${prod._id}">❌</button>
        `;
        productList.appendChild(li);
    })

});


const form = document.getElementById('productForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('description').value;



    const newProduct = {
        title: title,
        price: Number(price), // Aseguramos que sea número
        code: code,
        description: "Agregado desde Sockets",
        stock: 10,
        category: "Tiempo Real"
    };

    socket.emit('addProduct', newProduct);

    form.reset();
});


document.getElementById('productList').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const productId = e.target.getAttribute('data-id');

        socket.emit('deleteProduct', productId);
    }
});