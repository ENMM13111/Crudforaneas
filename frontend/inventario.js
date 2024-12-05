// Función para obtener todos los inventarios
function obtener_inventarios() {
    fetch("http://127.0.0.1:5000/api/inventarios")
        .then(response => response.json())
        .then(data => visualizarInventarios(data))
        .catch(error => console.log(error));
}

// Función para visualizar los inventarios en una tabla
function visualizarInventarios(data) {
    let b = "";
    for (let i = 0; i < data.inventarios.length; i++) {
        b += `<tr>
                <td>${data.inventarios[i].id_inventario}</td>
                <td>${data.inventarios[i].id_producto}</td>
                <td>${data.inventarios[i].cantidad}</td>
                <td>${data.inventarios[i].fecha_ingreso}</td>
                <td>
                    <button type='button' class='btn btn-info' onclick="location.href = 'editinventarios.html?id_inventario=${data.inventarios[i].id_inventario}'"> 
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type='button' class='btn btn-warning' onclick="eliminar_inventario(${data.inventarios[i].id_inventario})"> 
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
              </tr>`;
    }
    document.getElementById('data').innerHTML = b;
}

// Función para eliminar un inventario
function eliminar_inventario(id_inventario) {
    fetch(`http://127.0.0.1:5000/api/inventarios/${id_inventario}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Inventario eliminado') {
            Swal.fire({
                title: "¡Eliminado!",
                text: "El inventario ha sido eliminado exitosamente.",
                icon: "success"
            }).then(() => {
                obtener_inventarios();
            });
        } else {
            Swal.fire('Error', data.mensaje, 'error');
        }
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'Hubo un problema al intentar eliminar el inventario.', 'error');
    });
}

// Función para obtener un inventario por id_inventario
function obtener_inventario(id_inventario) {
    fetch(`http://127.0.0.1:5000/api/inventarios/${id_inventario}`)
        .then(response => response.json())
        .then(data => {
            if (data.inventario) {
                document.getElementById("id_producto").value = data.inventario.id_producto;
                document.getElementById("cantidad").value = data.inventario.cantidad;
                document.getElementById("fecha_ingreso").value = data.inventario.fecha_ingreso;
            } else {
                Swal.fire('Error', 'Inventario no encontrado', 'error');
            }
        });
}

// Obtener el id_inventario de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_inventario = urlParams.get('id_inventario');

// Función para actualizar un inventario
function actualizar_inventario() {
    // Obtener los valores de los campos del formulario
    const id_producto = document.getElementById('id_producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const fecha_ingreso = document.getElementById('fecha_ingreso').value;

    // Verificar que se ha obtenido el id_inventario de la URL
    if (!id_inventario) {
        Swal.fire({
            title: 'Error',
            text: 'No se ha proporcionado un id_inventario válido en la URL.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Hacer la solicitud PUT para actualizar el inventario
    fetch(`http://127.0.0.1:5000/api/inventarios/${id_inventario}`, {
        method: 'PUT',
        body: JSON.stringify({
            id_producto: id_producto,
            cantidad: cantidad,
            fecha_ingreso: fecha_ingreso
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Inventario actualizado') {
            Swal.fire({
                title: "¡Editado exitosamente!",
                text: "El inventario ha sido actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                location.href = 'inventarios.html'; // Redirigir a la lista de inventarios
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
            text: 'Hubo un problema al intentar editar el inventario.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}

// Función para crear un nuevo inventario
function crear_inventario() {
    // Obtener los valores de los campos del formulario
    const id_producto = document.getElementById('id_producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const fecha_ingreso = document.getElementById('fecha_ingreso').value;

    // Validar que los campos no estén vacíos
    if (!id_producto || !cantidad || !fecha_ingreso) {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios.",
            icon: "error",
        });
        return;
    }

    // Realiza la solicitud POST al servidor
    fetch("http://127.0.0.1:5000/api/inventarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_producto: id_producto,
            cantidad: cantidad,
            fecha_ingreso: fecha_ingreso
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === "Inventario creado") {
            Swal.fire({
                title: "¡Éxito!",
                text: "El inventario se ha creado correctamente.",
                icon: "success",
            }).then(() => {
                // Redirige o limpia el formulario según lo necesario
                location.href = 'inventarios.html';
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
        console.error("Error al crear el inventario:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al intentar crear el inventario.",
            icon: "error",
        });
    });
}
