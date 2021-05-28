import * as Yup from 'yup';
import Empresa from '../models/Empresa_Model';

class Empresa_Controller {
  async criarEmpresa(req, res) {
    const { chave_atual, dados_cadastrais, plano_contratado } = req.body;
    const empresas = await Empresa.find();
    const result = empresas.some(
      (verify) =>
        verify.dados_cadastrais.cnpj === req.body.dados_cadastrais.cnpj
    );

    const verificaChaveAtual = Yup.object().shape({
      data_ativacao: Yup.string().required(),
      data_validade: Yup.string().required(),
      key: Yup.string().required(),
      valor: Yup.number().required(),
    });

    const verificaDadosCadastrais = Yup.object().shape({
      cnpj: Yup.string().required(),
      cidade: Yup.string().required(),
      complemento: Yup.string().required(),
      endereco: Yup.string().required(),
      estado: Yup.string().required(),
      inscricao_estadual: Yup.string().required(),
      inscricao_municipal: Yup.string().required(),
      nome: Yup.string().required(),
      saldo: Yup.number().required(),
    });

    const verificaPlanoContratado = Yup.object().shape({
      contratacao: Yup.string().required(),
      tipo: Yup.string().required(),
      valor: Yup.number().required(),
    });

    if (!result) {
      if (!(await verificaChaveAtual.isValid(chave_atual))) {
        return res
          .status(400)
          .json({ error: 'Invalid data for key validation.' });
      }

      if (!(await verificaDadosCadastrais.isValid(dados_cadastrais))) {
        return res
          .status(400)
          .json({ error: 'Invalid data for registration validation.' });
      }

      if (!(await verificaPlanoContratado.isValid(plano_contratado))) {
        return res
          .status(400)
          .json({ error: 'Invalid data for plan validation.' });
      }

      Empresa.create(req.body);
      return res
        .status(200)
        .json({ sucess: 'Company successfully registered' });
    }
    return res.status(403).json({
      error: `${req.body.dados_cadastrais.nome} is already registered`,
    });
  }
}

export default new Empresa_Controller();
