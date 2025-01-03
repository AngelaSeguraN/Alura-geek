 // Funciones de simulación de API y LocalStorage
 function inicializarProductos() {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    return productosGuardados;
}

function guardarProductosEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(productos));
}

let productos = inicializarProductos();

async function obtenerProductos() {
    return new Promise((resolve) => setTimeout(() => resolve(productos), 500));
}

async function agregarProductoAPI(producto) {
    return new Promise((resolve) => {
        setTimeout(() => {
            productos.push(producto);
            guardarProductosEnLocalStorage();
            resolve(producto);
        }, 500);
    });
}

async function eliminarProductoAPI(nombre) {
    return new Promise((resolve) => {
        setTimeout(() => {
            productos = productos.filter(producto => producto.nombre !== nombre);
            guardarProductosEnLocalStorage();
            resolve(true);
        }, 500);
    });
}

async function cargarProductos() {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = '';
    const data = await obtenerProductos();
    data.forEach(producto => {
        agregarProductoUI(producto);
    });
}

function agregarProductoUI(producto) {
    const productosContainer = document.getElementById('productos');
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const info = document.createElement('div');
    info.classList.add('producto-info');
    info.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
    `;

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.onclick = async () => {
        await eliminarProductoAPI(producto.nombre);
        cargarProductos();
    };

    productoDiv.appendChild(img);
    productoDiv.appendChild(info);
    productoDiv.appendChild(botonEliminar);

    productosContainer.appendChild(productoDiv);
}

async function agregarProducto() {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagenInput = document.getElementById('imagen');

    if (nombre && precio && imagenInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const producto = { nombre, precio, imagen: e.target.result };
            await agregarProductoAPI(producto);
            cargarProductos();
        };
        reader.readAsDataURL(imagenInput.files[0]);
    } else {
        alert('Por favor, completa todos los campos.');
    }
}

cargarProductos();