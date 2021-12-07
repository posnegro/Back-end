const { Router } = require("express");
const { check } = require("express-validator");

//importamos los middlewares
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-rol");

//Importamos el checkcustom
const { productoExiste, categoriaExiste } = require("../helpers/db-validators");

//Importamos los controlladores
const {
  obtenerProductos,
  obtenerProductoId,
  crearProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");

const router = Router();
//obtener todas las categ por id
router.get("/", obtenerProductos);

//obtener todas los productos por id
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  obtenerProductoId
);
//Crear Productos
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("precio", "el precio es obligatorio").not().isEmpty(),
    check("categoria", "No es un ID valido").isMongoId(),
    check("categoria").custom(categoriaExiste),
    validarCampos,
  ],
  crearProducto
);

//Edito los productos
router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  actualizarProducto
);

//borro los productos
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
