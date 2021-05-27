import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  nome: String,
  email: String,
  senha: String,
  vinculo: String,
});

export default model('User', UserSchema);
