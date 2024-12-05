function obtener_clientes() {
    fetch("http://127.0.0.1:5000/api/clientes")
        .then(response => response.json())
        .then(data => visualizarClientes(data))
        .catch(error => console.log(error));
}

function visualizarClientes(data) {
    let b = "";
    for (let i = 0; i < data.clientes.length; i++) {
        b += `<tr>
                <td>${data.clientes[i].id_cliente}</td>
                <td>${data.clientes[i].nombre}</td>
                <td>${data.clientes[i].telefono}</td>
                <td>${data.clientes[i].direccion}</td>
                <td>${data.clientes[i].correo}</td>
                <td>${data.clientes[i].fecha_registro}</td>
                <td>
                    <button type='button' class='btn btn-info' onclick="location.href = 'editclientes.html?id_cliente=${data.clientes[i].id_cliente}'"> 
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type='button' class='btn btn-warning' onclick="eliminar_cliente(${data.clientes[i].id_cliente})"> 
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
              </tr>`;
    }
    document.getElementById('data').innerHTML = b;
}

function eliminar_cliente(id_cliente) {
    fetch(`http://127.0.0.1:5000/api/clientes/${id_cliente}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Cliente eliminado') {
            Swal.fire({
                title: "¡Eliminado!",
                text: "El cliente ha sido eliminado exitosamente.",
                icon: "success"
            }).then(() => {
                obtener_clientes();
            });
        } else {
            Swal.fire('Error', data.mensaje, 'error');
        }
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'Hubo un problema al intentar eliminar el cliente.', 'error');
    });
}


function obtener_cliente(id_cliente) {
    fetch(`http://127.0.0.1:5000/api/clientes/${id_cliente}`)
        .then(response => response.json())
        .then(data => {
            if (data.cliente) {
                document.getElementById("nombre").value = data.cliente.nombre;
                document.getElementById("telefono").value = data.cliente.telefono;
                document.getElementById("direccion").value = data.cliente.direccion;
                document.getElementById("correo").value = data.cliente.correo;
                document.getElementById("fecha_registro").value = data.cliente.fecha_registro;
            } else {
                Swal.fire('Error', 'Cliente no encontrado', 'error');
            }
        });
}

// Obtener el id_cliente de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_cliente = urlParams.get('id_cliente');

// Función para actualizar el cliente
function actualizar_cliente() {
    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('correo').value;
    const fecha_registro = document.getElementById('fecha_registro').value;

    // Verificar que se ha obtenido el id_cliente de la URL
    if (!id_cliente) {
        Swal.fire({
            title: 'Error',
            text: 'No se ha proporcionado un id_cliente válido en la URL.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Hacer la solicitud PUT para actualizar el cliente
    fetch(`http://127.0.0.1:5000/api/clientes/${id_cliente}`, {
        method: 'PUT',
        body: JSON.stringify({
            nombre: nombre,
            telefono: telefono,
            direccion: direccion,
            correo: correo,
            fecha_registro: fecha_registro
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Cliente actualizado') {
            Swal.fire({
                title: "¡Editado exitosamente!",
                text: "El cliente ha sido actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                location.href = 'clientes.html'; // Redirigir a la lista de clientes
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
            text: 'Hubo un problema al intentar editar el cliente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}


function crear_cliente() {
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('correo').value;
    const fecha_registro = document.getElementById('fecha_registro').value;

    fetch("http://127.0.0.1:5000/api/clientes", {
        method: 'POST',
        body: JSON.stringify({
            nombre: nombre,
            telefono: telefono,
            direccion: direccion,
            correo: correo,
            fecha_registro: fecha_registro
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: data.mensaje,
            confirmButtonText: 'Aceptar'
        }).then(() => {
            location.href = 'Clientes.html'; // Redirigir al listado de clientes
        });
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema con el registro. Intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    });
}
