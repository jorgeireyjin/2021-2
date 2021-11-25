const express = require("express");
const bodyParser = require("body-parser");

/* OJO */
/*
FormData siempre utiliza multipart/form-data.
para utilizar  x-www-form-urlencoded se debe hacer encode
o usar Multer
*/
const multer = require("multer")

const sequelize = require("sequelize")
const models = require("../models")

// Modulos de acceso a BD
const query = require("../persistencia/selectall")
const query1 = require("../persistencia/selectfiltro")
const inserta = require("../persistencia/insert")
const elimina = require("../persistencia/delete");
const actualiza = require("../persistencia/update")


const usuario = models.Usuario;

const rutas = express.Router();

// Setear a express
rutas.use( express.urlencoded( {extended: false }) )
rutas.use( express.json() )

// Usar multer
const formdata = multer()
rutas.use( formdata.array() )

// La ruta principal
rutas.route("/consulta")
    .get( async (req,res,next) => {
        // Aqui debo leer la BD y mostrar los datos en la vista principal
        // Voy a usar la pantilla2
        await query()
            .then( (listado) => {
                res.status(200).send( listado )
            } )
            .catch( (error) => {
                console.log("Ocurrio un error en el query", error)
            })

    })

// La ruta para agregar
rutas.route("/create")
    .post( async(req,res,next) =>{
        console.log(req.body.codigo)
        console.log(req.body.nombre)
        console.log(req.body.edad)
        
       await inserta(
                req.body.codigo,
                req.body.nombre,
                req.body.edad
            )
            .then( async () =>{
              res.sendStatus(201)
            })
            .catch( (error) => {
                console.log("Ocurrio un error en el insert", error)
            })

    })

// La ruta para eliminar un registro
rutas.route("/remove")
    .delete( async (req,res,next) => {
        await elimina(
            req.body.codigo
        )
        .then( async () =>{
            res.sendStatus(200)               
        })
        .catch( (error) => {
            console.log("Ocurrio un error en el delete", error)
        })

    })

    
// La ruta para actualizar
rutas.route("/actualizar")
    .put( async (req,res,next) => {
        // Debo actualizar la data en la BD
        // Mostrar la vista principal
        
        await actualiza(
            req.body.codigo,
            req.body.nombre,
            req.body.edad
            )
            .then( async () =>{
                res.sendStatus(204)
            })
            .catch( (error) => {
                console.log("error en actualiza ...")
            })
    })

// No olvidar
module.exports = rutas