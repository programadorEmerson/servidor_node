import { Schema, model } from 'mongoose';

const ProdutoSchema = new Schema({
  uuid_empresa: String,
  uuid: String,
  produto: String,
  preco_venda: Number,
  preco_custo: Number,
  peso_liquido: Number,
  peso_bruto: Number,
  quantidade_estoque: Number,
  quantidade_minima: Number,
  imagem: String,
  cod_barras: String,
  composicao: String,
  aplicacao: String,
  complemento: String,
  data_validade: String,
  localizacao: String,
  cor: String,
  material: String,
  marca: String,
  fabricante: String,
  unidade_medida: String,
  fornecedor: String,
});

export default model('Produto', ProdutoSchema);
