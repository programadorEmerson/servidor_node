import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import Empresa from '../models/Empresa_Model';

class Empresa_Controller {
  async criarEmpresa(req, res) {
    const { chave_atual, dados_cadastrais, plano_contratado, usuarios } =
      req.body;
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

    const verificarUsuario = Yup.object().shape({
      nome: Yup.string().required(),
      setor: Yup.string().required(),
      super_usuario: Yup.boolean().required(),
      ultimo_acesso: Yup.string().required(),
      email: Yup.string().required(),
      senha: Yup.string().required(),
      active: Yup.boolean().required(),
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

      if (!(await verificarUsuario.isValid(usuarios[0]))) {
        return res
          .status(400)
          .json({ error: 'Data for initial user incomplete.' });
      }
      const dadosDaEmpresa = req.body;
      dadosDaEmpresa.dados_cadastrais.uuid = uuid();
      dadosDaEmpresa.usuarios[0].uuid = uuid();
      Empresa.create(dadosDaEmpresa);
      return res
        .status(200)
        .json({ sucess: 'Company successfully registered' });
    }
    return res.status(403).json({
      error: `${req.body.dados_cadastrais.nome} is already registered`,
    });
  }

  async atualizarEmpresa(req, res) {
    const empresas = await Empresa.find();
    const { email } = req.headers;
    const {
      chave_atual = null,
      dados_cadastrais = null,
      plano_contratado = null,
      email: novoEmail = null,
      telefone = null,
      usuario: novoUsuario = null,
    } = req.body;

    try {
      const empresa = empresas.filter((filtro) =>
        filtro.usuarios.some((usuario) => usuario.email === email)
      )[0];
      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (filtro) => filtro.email === email
      ).super_usuario;

      const verificaChaveAtual = Yup.object().shape({
        data_ativacao: Yup.string().required(),
        data_validade: Yup.string().required(),
        key: Yup.string().required(),
        valor: Yup.number().required(),
      });

      const verificaDadosCadastrais = Yup.object().shape({
        cnpj: Yup.string().required(),
        uuid: Yup.string().required(),
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

      const verificaEmail = Yup.object().shape({
        departamento: Yup.string().required(),
        email: Yup.string().required(),
        responsavel: Yup.string().required(),
      });

      const verificaTelefone = Yup.object().shape({
        departamento: Yup.string().required(),
        telefone: Yup.string().required(),
        ramal: Yup.string().required(),
        responsavel: Yup.string().required(),
      });

      const verificaUsuario = Yup.object().shape({
        nome: Yup.string().required(),
        setor: Yup.string().required(),
        super_usuario: Yup.boolean().required(),
        ultimo_acesso: Yup.string().required(),
        email: Yup.string().required(),
        active: Yup.boolean().required(),
      });

      if (administrador) {
        if (chave_atual) {
          if (!(await verificaChaveAtual.isValid(chave_atual))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for key validation.' });
          }
          novaAtualizacao.chaves_utilizadas.push(empresa.chave_atual);
          novaAtualizacao.chave_atual = chave_atual;
        }

        if (dados_cadastrais) {
          if (!(await verificaDadosCadastrais.isValid(dados_cadastrais))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for registration validation.' });
          }
          novaAtualizacao.dados_cadastrais = dados_cadastrais;
        }

        if (plano_contratado) {
          if (!(await verificaPlanoContratado.isValid(plano_contratado))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for plan validation.' });
          }
          novaAtualizacao.plano_contratado = plano_contratado;
        }

        if (novoEmail) {
          if (!(await verificaEmail.isValid(novoEmail))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for email validation.' });
          }

          const checkEmail = empresa.emails.find(
            (vEmail) => vEmail.email === novoEmail.email
          );

          if (checkEmail) {
            empresa.emails.forEach((cEmail, indice) => {
              if (cEmail.email === checkEmail.email) {
                novaAtualizacao.emails[indice] = novoEmail;
              }
            });
          } else {
            novaAtualizacao.emails.push(novoEmail);
          }
        }

        if (telefone) {
          if (!(await verificaTelefone.isValid(telefone))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for telephone validation.' });
          }
          const checkTelefone = empresa.telefones.find(
            (vTelefone) => vTelefone.telefone === telefone.telefone
          );

          if (checkTelefone) {
            empresa.telefones.forEach((cTelefone, indice) => {
              if (cTelefone.telefone === checkTelefone.telefone) {
                novaAtualizacao.telefones[indice] = telefone;
              }
            });
          } else {
            novaAtualizacao.telefones.push(telefone);
          }
        }

        if (novoUsuario) {
          if (!(await verificaUsuario.isValid(novoUsuario))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for new user validation.' });
          }

          const verificaUser = empresa.usuarios.find(
            (usuario) => usuario.email === novoUsuario.email
          );

          if (verificaUser) {
            empresa.usuarios.forEach((usuario, indice) => {
              if (usuario.email === verificaUser.email) {
                novoUsuario.uuid = verificaUser.uuid;
                novaAtualizacao.usuarios[indice] = novoUsuario;
              }
            });
          } else {
            novoUsuario.uuid = uuid();
            novaAtualizacao.usuarios.push(novoUsuario);
          }
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }
}

export default new Empresa_Controller();
