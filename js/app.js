const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody'),
      inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
    // Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar el botón
    if(listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    //Buscador
    inputBuscador.addEventListener('input', buscarContactos);
    
    //Contador de contactos
    numeroContactos();

}

function leerFormulario(e) {
    e.preventDefault();

    // Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    if(nombre === '' || empresa === '' || telefono === '') {
        // 2 parámetros: Texto y Clase
        mostrarNotificacion('Todos los Campos son Obligatorios', 'error');
    } else {
        // Pasa la validación, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        if(accion === 'crear') {
            // Crearemos un nuevo Contacto
            insertarBD(infoContacto);
        } else {
            // Editar el Contacto
            //Leer el ID
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

// Inserta en la BD via Ajax
function insertarBD(datos) {
    // Llamado a Ajax //

    // Crear el objeto
    const xhr = new XMLHttpRequest();
    
    // Abrir la conexión
    xhr.open('POST', 'includes/models/modelo-contactos.php', true);
    
    // Pasar los datos
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            // Leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);

            // Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // Crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // Crear el icono de editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            // Crear el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // Agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // Crear al icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            // Crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // Agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            // Resetear el formulario
            document.querySelector('form').reset();

            // Mostrar Notificacion
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

            // Actualizamos el número de contactos
            numeroContactos();
        }
    }

    // Enviar los datos
    xhr.send(datos);
}

function actualizarRegistro(datos) {
    // Crear el objeto
    const xhr = new XMLHttpRequest();
    
    // Abrir la conexión
    xhr.open('POST', 'includes/models/modelo-contactos.php', true);
    
    // Leer la respuesta
    xhr.onload = function() {
        if(this.status === 200) {
            const respuesta = JSON.parse(xhr.responseText);

            if(respuesta.respuesta === 'correcto') {
                // Mostrar notificacion de Correcto
                mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
            } else {
                // Hubo un error
                mostrarNotificacion('Hubo un error...', 'error');
            }
            // Despues de 3 segundos redireccionar
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 4000)
        }
    }
    
    // Enviar la petición
    xhr.send(datos);
}

// Eliminar el Contacto
// parentElement = Regresa del hijo hacia el padre
function eliminarContacto(e) {
    if( e.target.parentElement.classList.contains('btn-borrar')) {
        // Tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');
        // Preguntar al usuario
        const respuesta = confirm('¿Estás Seguro (a) ?');

        if(respuesta) {
            // Llamado a Ajax
            // Crear el objeto
            const xhr = new XMLHttpRequest();
            // Abrir la conexion
            xhr.open('GET', `includes/models/modelo-contactos.php?id=${id}&accion=borrar`, true);
            // Leer la respuesta
            xhr.onload = function() {
                if(this.status == 200) {
                    const resultado = JSON.parse(xhr.responseText);
                
                if(resultado.respuesta == 'correcto') {
                    // Eliminar el registro del DOM
                    e.target.parentElement.parentElement.parentElement.remove();
                    // Mostrar notificación
                    mostrarNotificacion('Contacto eliminado', 'correcto');
                    
                    // Actualizamos el número de contactos
                    numeroContactos();
                } else {
                    // Mostramos una notificación
                    mostrarNotificacion('Hubo un error...', 'error');
                }

            }
        }
            // Enviar la petición
            xhr.send();
        
    }
}
}

// Notificación en Pantalla

function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            
            setTimeout(() => {
                notificacion.remove();
            }, 500);

        }, 3000);
    }, 100);
}

/** Buscador de registros **/
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i" );
          registros = document.querySelectorAll('tbody tr');

          registros.forEach(registro => {
              registro.style.display = 'none';

              if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1 ){
                registro.style.display = 'table-row';
              }
              numeroContactos();
          })
}

/** Muestra el número de contactos **/
function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if(contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });
    contenedorNumero.textContent = total;
}