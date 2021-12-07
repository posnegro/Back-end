//Inporto de express req y res para poder utilizar sus metodos
const { request, response } = require("express");
//Importamos el Schema
const Producto = require("../models/producto");
//Muestra los producto----------------------------------------
const obtenerProductos = async (req = request, res = response) => {
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
  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre email")
      .populate("categoria", "nombre"),
  ]);
  //------------------------------------------

  res.json({
    Total: total,
    productos,
  });
};
  //Muestra el id del Producto------------------------------------------
const obtenerProductoId = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre");

  res.json({
    producto,
  });
};
//Crea el producto------------------------------------------------
const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({
    nombre: body.nombre.toUpperCase(),
  });

  if (productoDB) {
    return res.status(400).json({
      msg: `el producto ${productoDB.nombre} ya existe`,
    });
  }

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);
  //guardar en DB
  await producto.save();

  res.json({
    producto,
  });
};
//Edita el producto----------------------------------------------
const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, estado, usuario, ...resto } = req.body;

  if (resto.nombre) {
    resto.nombre = resto.nombre.toUpperCase();
  }

  resto.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    msg: "Producto actualizado",
    producto,
  });
};
//Elimina el producto--------------------------------------------
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    msg: "Producto eliminado",
    producto,
  });
};
//Los exportamos-------------------------------------------
module.exports = {
  obtenerProductos,
  obtenerProductoId,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
