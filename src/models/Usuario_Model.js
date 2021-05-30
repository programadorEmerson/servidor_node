import { Schema, model } from 'mongoose';

const UsuarioSchema = new Schema({
  uuid: String,
  nome: String,
  setor: String,
  active: true,
  super_usuario: true,
  ultimo_acesso: String,
  email: String,
  senha: String,
});

export default model('Empresa', UsuarioSchema);
