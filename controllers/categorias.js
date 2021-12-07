//Inporto de express req y res para poder utilizar sus metodos
const { response } = require("express");
//Importamos el Schema
const Categoria = require("../models/categoria");

//Muestra las categorias----------------------------------------
const obtenerCategorias = async (req, res = response) => {
  let { limite = 4, desde = 0 } = req.query;

  limite = Number(limite);
  desde = Number(desde);

  if (isNaN(limite)) {
    limite = 4;
  }
  if (isNaN(desde)) {
    desde = 0;
  }

  //------------------------------------------
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre email"),
  ]);
  //-------------------------------------------
  res.json({
    Total: total,
    categorias,
  });
};

 //Muestra el id de la categorias------------------------------------------
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate(
    "usuario",
    "nombre email"
  );

  res.json({
    categoria,
  });
};

//Crea las categorias------------------------------------------------
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }


  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  //guardar en DB
  await categoria.save();
  res.status(201).json(categoria);
};

//Edita las categorias----------------------------------------------
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  resto.nombre = resto.nombre.toUpperCase();
  resto.usuario = req.usuario;

  const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    msg: "Categoria actualizada",
    categoria,
  });
};

//Elimina las categorias--------------------------------------------
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    msg: "Categoria eliminada",
    categoria,
  });
};
//Los exportamos-------------------------------------------
module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
};
