const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("sequelize")
const models = require("../models")

// Modulos de acceso a BD
const query = require("../persistencia/selectall")
const inserta = require("../persistencia/insert")

const usuario = models.Usuario;

const rutas = express.Router();

// Setear a express
rutas.use( express.urlencoded( {extended: true }) )
rutas.use( express.json() )

// Ruta de inicio o welcome page
rutas.route("/")
    .get( (req,res,next) => {
        res.render("inicio", {layout: "../layouts/plantilla1"})
    })

// La ruta principal
rutas.route("/principal")
    .get( async (req,res,next) => {
        // Aqui debo leer la BD y mostrar los datos en la vista principal
        // Voy a usar la pantilla2
        await query()
            .then( (listado) => {
                res.render('principal',{ p1: listado, layout: "../layouts/plantilla2"})
            } )
            .catch( (error) => {
                console.log("Ocurrio un error en el query", error)
            })

    })

// La ruta para agregar
rutas.route("/agregar")
    .post( async(req,res,next) =>{
        /*
        console.log(req.body.codigo)
        console.log(req.body.nombre)
        console.log(req.body.edad)
        */
       await inserta(
                req.body.codigo,
                req.body.nombre,
                req.body.edad
            )
            .then( async () =>{
                await query()
                .then( (listado) => {
                    res.render('principal',{ p1: listado, layout: "../layouts/plantilla2"})
                } )
                .catch( (error) => {
                    console.log("Ocurrio un error en el query", error)
                })                
            })
            .catch( (error) => {
                console.log("Ocurrio un error en el insert", error)
            })

    })


// No olvidar
module.exports = rutas