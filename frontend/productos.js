function obtener_productos() {
    fetch("http://127.0.0.1:5000/api/productos")
        .then(response => response.json())
        .then(data => visualizarProductos(data))
        .catch(error => console.log(error));
}

function visualizarProductos(data) {
    let b = "";
    for (let i = 0; i < data.productos.length; i++) {
        b += `<tr>
                <td>${data.productos[i].id_producto}</td>
                <td>${data.productos[i].nombre}</td>
                <td>${data.productos[i].descripcion}</td>
                <td>${data.productos[i].precio}</td>
                <td>${data.productos[i].tipo_producto}</td>
                <td>
                    <button type='button' class='btn btn-info' onclick="location.href = 'editproductos.html?id_producto=${data.productos[i].id_producto}'"> 
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type='button' class='btn btn-warning' onclick="eliminar_producto(${data.productos[i].id_producto})"> 
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
              </tr>`;
    }
    document.getElementById('data').innerHTML = b;
}

function eliminar_producto(id_producto) {
    fetch(`http://127.0.0.1:5000/api/productos/${id_producto}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Producto eliminado') {
            Swal.fire({
                title: "¡Eliminado!",
                text: "El producto ha sido eliminado exitosamente.",
                icon: "success"
            }).then(() => {
                obtener_productos();
            });
        } else {
            Swal.fire('Error', data.mensaje, 'error');
        }
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'Hubo un problema al intentar eliminar el producto.', 'error');
    });
}

function obtener_producto(id_producto) {
    fetch(`http://127.0.0.1:5000/api/productos/${id_producto}`)
        .then(response => response.json())
        .then(data => {
            if (data.producto) {
                document.getElementById("nombre").value = data.producto.nombre;
                document.getElementById("descripcion").value = data.producto.descripcion;
                document.getElementById("precio").value = data.producto.precio;
                document.getElementById("tipo_producto").value = data.producto.tipo_producto;
            } else {
                Swal.fire('Error', 'Producto no encontrado', 'error');
            }
        });
}

// Obtener el id_producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_producto = urlParams.get('id_producto');

// Función para actualizar el producto
function actualizar_producto() {
    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const tipo_producto = document.getElementById('tipo_producto').value;

    // Verificar que se ha obtenido el id_producto de la URL
    if (!id_producto) {
        Swal.fire({
            title: 'Error',
            text: 'No se ha proporcionado un id_producto válido en la URL.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Hacer la solicitud PUT para actualizar el producto
    fetch(`http://127.0.0.1:5000/api/productos/${id_producto}`, {
        method: 'PUT',
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            tipo_producto: tipo_producto
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Producto actualizado') {
            Swal.fire({
                title: "¡Editado exitosamente!",
                text: "El producto ha sido actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                location.href = 'productos.html'; // Redirigir a la lista de productos
            });
        } else {
            Swal.fire({
                title: 'Error al editar',
                text: data.mensaje,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar editar el producto.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}

function crear_producto() {
    // Obtén los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const tipo_producto = document.getElementById('tipo_producto').value;

    // Validar que los campos no estén vacíos
    if (!nombre || !descripcion || !precio || !tipo_producto) {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios.",
            icon: "error",
        });
        return;
    }

    // Realiza la solicitud POST al servidor
    fetch("http://127.0.0.1:5000/api/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            tipo_producto: tipo_producto
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === "Producto creado") {
            Swal.fire({
                title: "¡Éxito!",
                text: "El producto se ha creado correctamente.",
                icon: "success",
            }).then(() => {
                // Redirige o limpia el formulario según lo necesario
                location.href = 'productos.html';
            });
        } else {
            Swal.fire({
                title: "Error",
                text: data.mensaje,
                icon: "error",
            });
        }
    })
    .catch(error => {
        console.error("Error al crear el producto:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al intentar crear el producto.",
            icon: "error",
        });
    });
}
