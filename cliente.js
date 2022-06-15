//Definición de variables
const url = 'http://localhost:8082/usuario/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'))
const formUsuario = document.querySelector('form')
const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const prioridad = document.getElementById('prioridad')
const emailElement = document.getElementById('emailDelete')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombre.value = ''
    email.value = ''
    prioridad.value = ''
    modalUsuario.show()
    opcion = 'crear'
})


//funcion para mostrar los resultados
const mostrar = (usuarios) => {
    resultados = '';
    usuarios.forEach(usuario => {
        
        resultados += `<tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nombre}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.prioridad}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `    
    })
    contenedor.innerHTML = resultados
    
}

//Procedimiento Mostrar

const getData = function(url){
    fetch(url)
    .then( response => response.json() )
    .then(data => {
        console.log(data)
        if(data.length===0){
            alertify.alert("El valor ingresado no existe como correo de usuario en la base de datos, Por favor ingrese el correo completo",()=>{
                location.reload()
            })
            
        }else{
            mostrar(data);
        }
    })
    //.then( data => mostrar(data) )
    .catch( error => console.log(error))
}

getData(url)

btnFind.addEventListener("click", () =>{
    let findEmail = document.getElementById("findEmail").value || null;
    if(findEmail!==null){
        getData(url+`findEmail/${findEmail}`);
    }else{
        getData(url);
    }
   
});

  
const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        //alertify.success('Ok')
    },
    function(){
        alertify.error('Cancel')
    })
})

//Procedimiento Borrar por email
on(document, 'click', '#btnDeleteEmail', e => {
    
    const email = document.getElementById('deleteEmail').value || null
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    
    if(email==null){
        emailElement.insertAdjacentHTML("beforebegin",`<h6 style = color:red>Debe ingresar un valor</h6>`);
        setTimeout(()=>{
            location.reload();
        },1500)
    }else{
        alertify.confirm(`Está seguro que sedes eliminar el usuario con correo ${email}`,
    function(){
        console.log(url+`deleteEmail/${email}`);
        let res = fetch(url+`deleteEmail/${email}`, {
            method: 'DELETE'
        })
        //.then(res =>{console.log(res)})
       .then( ()=> location.reload())
        //alertify.success('Ok')
    },
    function(){
        alertify.error('Cancel')
    })
    }
    
})


//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {    
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const emailForm = fila.children[2].innerHTML
    const prioridadForm = fila.children[3].innerHTML
    nombre.value =  nombreForm
    email.value =  emailForm
    prioridad.value =  prioridadForm
    opcion = 'editar'
    modalUsuario.show()
     
})

//Procedimiento para Crear y Editar
formUsuario.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre:nombre.value,
                email:email.value,
                prioridad:prioridad.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoUsuario = []
            nuevoUsuario.push(data)
            getData(url)
        })
    }
    if(opcion=='editar'){    
        //console.log('OPCION EDITAR')
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id:idForm,
                nombre:nombre.value,
                email:email.value,
                prioridad:prioridad.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalUsuario.hide()
})

