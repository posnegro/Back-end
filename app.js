//Importamos 'dotenv', y para poder usar las variables de entorno, usarmos '.config()'.
require("dotenv").config();

const Server = require("./models/server");

const server = new Server();

server.listen();
