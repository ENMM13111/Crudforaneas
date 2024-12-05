// Función para obtener todas las ventas
function obtener_ventas() {
    fetch("http://127.0.0.1:5000/api/ventas")
        .then(response => response.json())
        .then(data => visualizarVentas(data))
        .catch(error => console.log(error));
}

// Función para mostrar todas las ventas
function visualizarVentas(data) {
    let b = "";
    for (let i = 0; i < data.ventas.length; i++) {
        b += `<tr>
                <td>${data.ventas[i].id_venta}</td>
                <td>${data.ventas[i].id_cliente}</td>
                <td>${data.ventas[i].fecha_venta}</td>
                <td>${data.ventas[i].total}</td>
                <td>
                    <button type='button' class='btn btn-info' onclick="location.href = 'editventas.html?id_venta=${data.ventas[i].id_venta}'"> 
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type='button' class='btn btn-warning' onclick="eliminar_venta(${data.ventas[i].id_venta})"> 
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
              </tr>`;
    }
    document.getElementById('data').innerHTML = b;
}

// Función para eliminar una venta
function eliminar_venta(id_venta) {
    fetch(`http://127.0.0.1:5000/api/ventas/${id_venta}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Venta eliminada') {
            Swal.fire({
                title: "¡Eliminada!",
                text: "La venta ha sido eliminada exitosamente.",
                icon: "success"
            }).then(() => {
                obtener_ventas();
            });
        } else {
            Swal.fire('Error', data.mensaje, 'error');
        }
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'Hubo un problema al intentar eliminar la venta.', 'error');
    });
}

// Función para obtener una venta específica
function obtener_venta(id_venta) {
    fetch(`http://127.0.0.1:5000/api/ventas/${id_venta}`)
        .then(response => response.json())
        .then(data => {
            if (data.venta) {
                document.getElementById("id_cliente").value = data.venta.id_cliente;
                document.getElementById("fecha_venta").value = data.venta.fecha_venta;
                document.getElementById("total").value = data.venta.total;
            } else {
                Swal.fire('Error', 'Venta no encontrada', 'error');
            }
        });
}

// Obtener el id_venta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_venta = urlParams.get('id_venta');

// Función para actualizar la venta
function actualizar_venta() {
    // Obtener los valores de los campos del formulario
    const id_cliente = document.getElementById('id_cliente').value;
    const fecha_venta = document.getElementById('fecha_venta').value;
    const total = parseFloat(document.getElementById('total').value);

    // Verificar que se ha obtenido el id_venta de la URL
    if (!id_venta) {
        Swal.fire({
            title: 'Error',
            text: 'No se ha proporcionado un id_venta válido en la URL.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Hacer la solicitud PUT para actualizar la venta
    fetch(`http://127.0.0.1:5000/api/ventas/${id_venta}`, {
        method: 'PUT',
        body: JSON.stringify({
            id_cliente: id_cliente,
            fecha_venta: fecha_venta,
            total: total
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Venta actualizada') {
            Swal.fire({
                title: "¡Editada exitosamente!",
                text: "La venta ha sido actualizada correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                location.href = 'ventas.html'; // Redirigir a la lista de ventas
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
            text: 'Hubo un problema al intentar editar la venta.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}

// Función para crear una nueva venta
function crear_venta() {
    // Obtén los valores de los campos del formulario
    const id_cliente = document.getElementById('id_cliente').value;
    const fecha_venta = document.getElementById('fecha_venta').value;
    const total = parseFloat(document.getElementById('total').value);

    // Validar que los campos no estén vacíos
    if (!id_cliente || !fecha_venta || !total) {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios.",
            icon: "error",
        });
        return;
    }

    // Realiza la solicitud POST al servidor
    fetch("http://127.0.0.1:5000/api/ventas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_cliente: id_cliente,
            fecha_venta: fecha_venta,
            total: total
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === "Venta creada") {
            Swal.fire({
                title: "¡Éxito!",
                text: "La venta se ha creado correctamente.",
                icon: "success",
            }).then(() => {
                location.href = 'ventas.html'; // Redirige a la lista de ventas
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
        console.error("Error al crear la venta:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al intentar crear la venta.",
            icon: "error",
        });
    });
}
