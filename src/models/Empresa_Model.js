import { Schema, model } from 'mongoose';

const EmpresaSchema = new Schema({
  chave_atual: {
    data_ativacao: String,
    data_validade: String,
    key: String,
    valor: Number,
  },
  chaves_utilizadas: [{}],
  dados_cadastrais: {
    cnpj: String,
    cidade: String,
    complemento: String,
    endereco: String,
    estado: String,
    inscricao_estadual: String,
    inscricao_municipal: String,
    nome: String,
    saldo: Number,
  },
  plano_contratado: {
    contratacao: String,
    tipo: String,
    valor: Number,
  },
  emails: [{}],
  telefones: [{}],
});

export default model('Empresa', EmpresaSchema);
