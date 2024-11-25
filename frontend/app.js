function consulta_general() {
    let url = "http://127.0.0.1:5000/"; 
    fetch(url)
        .then(response => response.json())
        .then(data => visualizar(data))
        .catch(error => console.log(error));

    let b = "";
    const visualizar = (data) => {
        console.log(data);
        for (let i = 0; i < data.baul.length; i++) {
            b += `<tr>
                    <td>${data.baul[i].id_baul}</td>
                    <td>${data.baul[i].Plataforma}</td>
                    <td>${data.baul[i].usuario}</td>
                    <td>${data.baul[i].clave}</td>
                    <td>
                    <button type='button' class='btn btn-info' onclick="location.href = 'edit.html?variableB=${data.baul[i].id_baul}'">
                        <i class="fas fa-edit" style="font-size: 30px;"></i>
                    </button>
                    <button type='button' class='btn btn-warning' onclick="eliminar(${data.baul[i].id_baul})">
                        <i class="fas fa-trash-alt" style="font-size: 30px;"></i>
                    </button>
                </td>
                  </tr>`;
        }
        document.getElementById('data').innerHTML = b;
    }
}


function eliminar(id_baul) {
    fetch(`http://127.0.0.1:5000/eliminar/${id_baul}`, {
        method: 'DELETE',  
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())  
    .then(data => {
        
        if (data.mensaje === "") {
            
            Swal.fire({
                title: "¡Eliminado!",
                text: "El registro se eliminó exitosamente.",
                icon: "success"  
            }).then(() => {
                consulta_general();  
            });
        } else {
            
            Swal.fire('ELIMINADO', data.mensaje, 'error');
        }
  
    
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        
        Swal.fire('Error', 'Hubo un problema al intentar eliminar el registro.', 'error');
    });
    

    
}

var id = getParameterByName('variableB');
consulta_individual(id);


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function consulta_individual(id) {
    fetch(`http://127.0.0.1:5000/consulta_individual/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("Plataforma").value = data.baul.Plataforma;
            document.getElementById("usuario").value = data.baul.usuario;
            document.getElementById("clave").value = data.baul.clave;
        });
}

function guardar() {
    const plataforma = document.getElementById('Plataforma').value;
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;

    fetch(`http://127.0.0.1:5000/actualizar/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            plataforma: plataforma,
            usuario: usuario,
            clave: clave
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Registro actualizado') {
            // Muestra el SweetAlert cuando la actualización es exitosa
            Swal.fire({
                title: "¡Editado exitosamente!",
                text: "El registro se ha editado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                // Redirige a la página principal después de confirmar
                location.href = 'index.html';
            });
        } else {
            // Si hay algún mensaje de error, se muestra un SweetAlert de error
            Swal.fire({
                title: 'Error al editar',
                text: data.mensaje,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    })
    .catch(error => {
        // Si ocurre un error al hacer la petición, se muestra un SweetAlert de error
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar editar el registro.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}

function registrar() {
    const plataforma = document.getElementById('Plataforma').value;
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;

    fetch("http://127.0.0.1:5000/registro/", {
        method: 'POST',
        body: JSON.stringify({
            plataforma: plataforma,
            usuario: usuario,
            clave: clave
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        // Usamos SweetAlert en lugar de alert
        Swal.fire({
            icon: 'success', // O puedes usar 'error', 'warning', etc.
            title: '¡Registro exitoso!',
            text: data.mensaje,
            confirmButtonText: 'Aceptar'
        }).then(() => {
            location.href = 'index.html';
        });
    })
    .catch(error => {
        // Si hay un error, mostramos una alerta de error
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema con el registro. Intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    });
}
