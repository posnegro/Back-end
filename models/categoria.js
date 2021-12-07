const { Schema, model } = require("mongoose");
//Creamos el Schema/Objeto
const CategoriaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  img: {
    type: String,
  },
});
//Para no mostrar password ni __v
CategoriaSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();

  return data;
};

module.exports = model("Categoria", CategoriaSchema);
