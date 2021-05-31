import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import Empresa_Model from '../models/Empresa_Model';
import Produto from '../models/Produto_Model';

function getRandomArbitrary() {
  const codigoDeBarras = [];
  for (let index = 0; index < 13; index += 1) {
    codigoDeBarras.push(Math.ceil(Math.random() * (9 - 0) + 0));
  }
  return codigoDeBarras.join('');
}

async function verificarCodigoBarrasRepetido(prod, uuidEmpresa) {
  const produtos = await Produto.find();

  while (
    produtos.some(
      (verifica) =>
        verifica.cod_barras === prod.cod_barras &&
        verifica.uuid_empresa === uuidEmpresa
    )
  ) {
    prod.cod_barras = getRandomArbitrary();
  }

  return prod.cod_barras;
}

class Produto_Controller {
  async cadastrarProduto(req, res) {
    const { uuid_empresa } = req.headers;
    const produto_novo = req.body;
    produto_novo.uuid = uuid();
    produto_novo.uuid_empresa = uuid_empresa;
    produto_novo.cod_barras = await verificarCodigoBarrasRepetido(
      req.body,
      uuid_empresa
    );

    const verificarProduto = Yup.object().shape({
      uuid_empresa: Yup.string().required(),
      uuid: Yup.string().required(),
      produto: Yup.string().required(),
      preco_venda: Yup.number().required(),
      preco_custo: Yup.number(),
      peso_liquido: Yup.number(),
      peso_bruto: Yup.number(),
      quantidade_estoque: Yup.number(),
      quantidade_minima: Yup.number(),
      imagem: Yup.string(),
      cod_barras: Yup.string().required(),
      composicao: Yup.string(),
      aplicacao: Yup.string(),
      complemento: Yup.string(),
      data_validade: Yup.string(),
      localizacao: Yup.string(),
      cor: Yup.string(),
      material: Yup.string(),
      marca: Yup.string(),
      fabricante: Yup.string(),
      unidade_medida: Yup.string(),
      fornecedor: Yup.string(),
    });

    if (!(await verificarProduto.isValid(produto_novo))) {
      return res.status(400).json({ error: 'Invalid data for registration.' });
    }

    Produto.create(produto_novo);
    return res.status(200).json({ sucess: 'Product successfully registered' });
  }

  async listarProdutos(req, res) {
    const { uuid_empresa } = req.headers;
    const produtos = await Produto.find();
    const listProdutos = produtos.filter(
      (verifica) => verifica.uuid_empresa === uuid_empresa
    );
    return res.status(200).json(listProdutos);
  }

  async atualizarProduto(req, res) {
    const { uuid_admin } = req.headers;
    const { produto: novo_produto } = req.body;

    const verificarProduto = Yup.object().shape({
      uuid_empresa: Yup.string().required(),
      uuid: Yup.string().required(),
      produto: Yup.string().required(),
      preco_venda: Yup.number().required(),
      preco_custo: Yup.number(),
      peso_liquido: Yup.number(),
      peso_bruto: Yup.number(),
      quantidade_estoque: Yup.number(),
      quantidade_minima: Yup.number(),
      imagem: Yup.string(),
      cod_barras: Yup.string().required(),
      composicao: Yup.string(),
      aplicacao: Yup.string(),
      complemento: Yup.string(),
      data_validade: Yup.string(),
      localizacao: Yup.string(),
      cor: Yup.string(),
      material: Yup.string(),
      marca: Yup.string(),
      fabricante: Yup.string(),
      unidade_medida: Yup.string(),
      fornecedor: Yup.string(),
    });

    if (!(await verificarProduto.isValid(novo_produto))) {
      return res
        .status(400)
        .json({ error: 'Invalid data for update product.' });
    }

    try {
      const empresas = await Empresa_Model.find();
      const empresa = empresas.find(
        (cEmpresa) =>
          cEmpresa.dados_cadastrais.uuid === novo_produto.uuid_empresa
      );

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const produtos = await Produto.find();
      const produto = produtos.find(
        (verifica) =>
          verifica.uuid === novo_produto.uuid &&
          verifica.uuid_empresa === novo_produto.uuid_empresa
      );

      if (administrador) {
        await Produto.updateOne({ _id: produto._id }, novo_produto);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for update.' });
    }
  }

  async deletarProduto(req, res) {
    const { uuid_admin, uuid_produto, uuid_empresa } = req.headers;

    try {
      const empresas = await Empresa_Model.find();
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const produtos = await Produto.find();
      const produto = produtos.find(
        (verifica) =>
          verifica.uuid === uuid_produto &&
          verifica.uuid_empresa === uuid_empresa
      );

      if (administrador) {
        await Produto.findByIdAndDelete({ _id: produto._id });
        return res
          .status(200)
          .json({ sucess: 'Product successfully deleted.' });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to delete.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for delete.' });
    }
  }
}

export default new Produto_Controller();
