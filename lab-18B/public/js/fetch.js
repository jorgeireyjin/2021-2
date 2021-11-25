 const dns =  "http://localhost:3000"

 function consultarTodo() {
    // Se va a conectar al servidor y recibir gastos
    const promesa = fetch( dns + '/consulta',
        { method: 'GET' }
    );

     promesa.then((response) => {
        response.json().then((data) => {
            for (var d of data) {
                const nombre = d.nombre;
                const codigo = d.codigo;
                const edad = d.edad;

                // crear Nodo HTML y mostrarlo
                const tr = crearFila(nombre, codigo, edad);
                document.getElementById('datos').appendChild(tr);
            }
        })
    });
    promesa.catch((error) => {
        console.error(error);
    });

}

var crearFila = (nombre, codigo, edad) => {
    const tr = document.createElement("tr");
    const tdCodigo = document.createElement("td");
    const tdNombre = document.createElement("td");
    const tdEdad = document.createElement("td");
    const tdAcciones = document.createElement("td");

    tdCodigo.innerHTML = codigo;
    tdNombre.innerHTML = nombre;
    tdEdad.innerHTML = edad;

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-danger btn-sm");
    button.innerHTML = "Eliminar";
    button.addEventListener("click", eliminar);

    tdAcciones.appendChild(button);

    tr.appendChild(tdCodigo);
    tr.appendChild(tdNombre);
    tr.appendChild(tdEdad);
    tr.appendChild(tdAcciones);

    return tr;
}


var eliminar = (event) => {
    //event.target.parentNode.parentNode.remove();
    codigo = event.target.parentNode.parentNode.firstChild.textContent

    const formData = new FormData();
    formData.append("codigo", codigo);

    fetch( dns + '/remove',
        {
            method: 'DELETE',
            body: formData,
            /*
            headers: {
                'Access-Control-Allow-Origin': location.origin,
                'Origin': location.origin
              },*/
        }
    )
        .then((status) => {
            console.log(status)
            refrescar()
        })
        .catch((error) => {
            console.error(error)
        });
}


var agregar = (event) => {
    const codigo = document.getElementById("form-codigo").value;
    const nombre = document.getElementById("form-nombre").value;
    const edad = document.getElementById("form-edad").value;

    if (codigo == "" || nombre == "" || edad == "") {
        // Error
        const div = document.getElementById('mensaje');
        div.setAttribute("style", "display:block;")
        document.getElementById('but-cerrar').addEventListener("click", () => {
            document.getElementById('mensaje').setAttribute("style", "display:none;");
        });
    } else {
        // OK
        const formData = new FormData();
        formData.set("Content-Type","application/x-www-form-urlencoded")
        formData.append("codigo", codigo);
        formData.append("nombre", nombre);
        formData.append("edad", edad);

        fetch( dns + '/create',
            {
                method: 'POST',
                body: formData
            }
        )
            .then(refrescar)
            .catch((error) => {
                console.error(error)
            });

        /* Limpiar el Form */
        document.getElementById("form-codigo").value = "";
        document.getElementById("form-nombre").value = "";
        document.getElementById("form-edad").value = "";
    }
}

var refrescar = (response) => {
    // Limpiar navegador
    document.getElementById('datos').innerHTML = '';
    // Refrescar
    consultarTodo();
}


var main = () => {
    consultarTodo();
    document.querySelector("#but-agregar").addEventListener("click", agregar);
}

window.addEventListener("load", main);
