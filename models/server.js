//Para importar express llamo a una variable y le asigno express.
const express = require("express");
const cors = require("cors");

//Importar conexion a BD
const { dbConnection } = require("../database/config");
class Server {
constructor() {
    //llamo a otra variable y le asigno todos los metodos de express.
    this.app = express();

    //ruta autenticacion para token
    this.authPath = "/api/auth";
    //ruta categorias
    this.categoriasPath = "/api/categorias";
    //rutas usuarios
    this.usuariosPath = "/api/usuarios";
    //rutas producto
    this.productosPath = "/api/productos";
    //Buscar cosas
    this.buscarPath = "/api/buscar";
    //Conexion
    this.conectarDB();
    //middlewares
    this.middlewares();
    //rutas
    this.routes();
} //fin de constructor
    //------------------
  
//Conectando con la BD
async conectarDB() {
    await dbConnection();
  }
  middlewares() {
        //Carpeta public
        this.app.use(express.static("public"));
        //Cors
        this.app.use(cors());
        //Acceso al body, leer y parsear
        this.app.use(express.json());
        //otra manera para parcear |acepta todo tipo de texto en postman|
        //this.app.use(express.urlencoded({extended:true}))
      }

routes() {
      //ruta de autenticacion
      this.app.use(this.authPath, require("../routes/auth"));
      //ruta de usuarios
     this.app.use(this.usuariosPath, require("../routes/usuarios"));
     //ruta categorias
     this.app.use(this.categoriasPath, require("../routes/categorias"));
     //ruta de productos
     this.app.use(this.productosPath, require("../routes/productos"));
     //ruta de buscar
     this.app.use(this.buscarPath, require("../routes/buscar"));
    }

listen() {
  this.app.listen(process.env.PORT, () => {
    console.log("Servidor online en puerto", process.env.PORT);
  });
}
}
module.exports = Server;
  