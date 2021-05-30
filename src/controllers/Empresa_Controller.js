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
    const { uuid_admin, uuid_empresa } = req.headers;
    const {
      chave_atual: novaChave = null,
      dados_cadastrais = null,
      plano_contratado = null,
      email: novoEmail = null,
      telefone = null,
      usuario: novoUsuario = null,
    } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

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
        if (novaChave) {
          if (!(await verificaChaveAtual.isValid(novaChave))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for key validation.' });
          }

          novaAtualizacao.chaves_utilizadas.push({
            uuid: empresa.chave_atual.uuid,
            data_ativacao: empresa.chave_atual.data_ativacao,
            data_validade: empresa.chave_atual.data_validade,
            key: empresa.chave_atual.key,
            valor: empresa.valor,
          });
          novaChave.uuid = uuid();
          novaAtualizacao.chave_atual = novaChave;
        }

        if (dados_cadastrais) {
          if (!(await verificaDadosCadastrais.isValid(dados_cadastrais))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for registration validation.' });
          }
          dados_cadastrais.uuid = uuid_empresa;
          novaAtualizacao.dados_cadastrais = dados_cadastrais;
        }

        if (plano_contratado) {
          if (!(await verificaPlanoContratado.isValid(plano_contratado))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for plan validation.' });
          }
          plano_contratado.uuid = empresa.plano_contratado.uuid;
          novaAtualizacao.plano_contratado = plano_contratado;
        }

        if (novoEmail) {
          if (!(await verificaEmail.isValid(novoEmail))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for email validation.' });
          }

          const checkEmail = empresa.emails.find(
            (vEmail) => vEmail.uuid === novoEmail.uuid
          );

          if (checkEmail) {
            empresa.emails.forEach((cEmail, indice) => {
              if (cEmail.uuid === checkEmail.uuid) {
                novaAtualizacao.emails[indice] = novoEmail;
              }
            });
          } else {
            novoEmail.uuid = uuid();
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
            (vTelefone) => vTelefone.uuid === telefone.uuid
          );

          if (checkTelefone) {
            empresa.telefones.forEach((cTelefone, indice) => {
              if (cTelefone.uuid === checkTelefone.uuid) {
                novaAtualizacao.telefones[indice] = telefone;
              }
            });
          } else {
            telefone.uuid = uuid();
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
            (usuario) => usuario.uuid === novoUsuario.uuid
          );

          if (verificaUser) {
            empresa.usuarios.forEach((usuario, indice) => {
              if (usuario.uuid === novoUsuario.uuid) {
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
        // .json({ sucess: novaAtualizacao })
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async listarEmails(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );
      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        return res.status(200).json({ sucess: empresa.emails });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async listarTelefones(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        return res.status(200).json({ sucess: empresa.telefones });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async planoContratado(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        return res.status(200).json({ sucess: empresa.plano_contratado });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async chaveAtual(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        return res.status(200).json({ sucess: empresa.chave_atual });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async chavesUtilizadas(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        return res.status(200).json({ sucess: empresa.chaves_utilizadas });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async dadosCadastrais(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        return res.status(200).json({ sucess: empresa.dados_cadastrais });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async deletarEmail(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa, uuid_email } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );
      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        const usuariosFiltrados = empresa.emails.filter(
          (consulta) => consulta.uuid !== uuid_email
        );

        novaAtualizacao.emails = usuariosFiltrados;

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

  async deletarTelefone(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa, uuid_telefone } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );
      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        const filtroRealizado = empresa.telefones.filter(
          (consulta) => consulta.uuid !== uuid_telefone
        );

        novaAtualizacao.telefones = filtroRealizado;

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

  async atualizarPlano(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { plano_contratado = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaPlanoContratado = Yup.object().shape({
        contratacao: Yup.string().required(),
        uuid: Yup.string().required(),
        tipo: Yup.string().required(),
        valor: Yup.number().required(),
      });

      if (administrador) {
        if (plano_contratado) {
          if (!(await verificaPlanoContratado.isValid(plano_contratado))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for plan validation.' });
          }
          novaAtualizacao.plano_contratado = plano_contratado;
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return (
          res
            .status(200)
            // .json({ sucess: 'Operation completed with sucess.' });
            .json({ sucess: novaAtualizacao.plano_contratado })
        );
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async adicionarChave(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { nova_chave = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaChaveAtual = Yup.object().shape({
        data_ativacao: Yup.string().required(),
        data_validade: Yup.string().required(),
        key: Yup.string().required(),
        valor: Yup.number().required(),
      });

      if (administrador) {
        if (nova_chave) {
          if (!(await verificaChaveAtual.isValid(nova_chave))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for key validation.' });
          }

          novaAtualizacao.chaves_utilizadas.push({
            uuid: empresa.chave_atual.uuid,
            data_ativacao: empresa.chave_atual.data_ativacao,
            data_validade: empresa.chave_atual.data_validade,
            key: empresa.chave_atual.key,
            valor: empresa.valor,
          });
          nova_chave.uuid = uuid();
          novaAtualizacao.chave_atual = nova_chave;
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
        // .json({ sucess: novaAtualizacao })
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async adicionarTelefone(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { telefone = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaTelefone = Yup.object().shape({
        departamento: Yup.string().required(),
        telefone: Yup.string().required(),
        ramal: Yup.string().required(),
        responsavel: Yup.string().required(),
      });

      if (administrador) {
        if (telefone) {
          if (!(await verificaTelefone.isValid(telefone))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for telephone validation.' });
          }
          const checkTelefone = empresa.telefones.find(
            (vTelefone) => vTelefone.uuid === telefone.uuid
          );

          if (checkTelefone) {
            empresa.telefones.forEach((cTelefone, indice) => {
              if (cTelefone.uuid === checkTelefone.uuid) {
                novaAtualizacao.telefones[indice] = telefone;
              }
            });
          } else {
            telefone.uuid = uuid();
            novaAtualizacao.telefones.push(telefone);
          }
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
        // .json({ sucess: novaAtualizacao })
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async adicionarUsuario(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { novo_usuario = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaUsuario = Yup.object().shape({
        nome: Yup.string().required(),
        setor: Yup.string().required(),
        super_usuario: Yup.boolean().required(),
        ultimo_acesso: Yup.string().required(),
        email: Yup.string().required(),
        active: Yup.boolean().required(),
      });
      if (administrador) {
        if (novo_usuario) {
          if (!(await verificaUsuario.isValid(novo_usuario))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for new user validation.' });
          }

          const verificaUser = empresa.usuarios.find(
            (usuario) => usuario.uuid === novo_usuario.uuid
          );

          if (verificaUser) {
            empresa.usuarios.forEach((usuario, indice) => {
              if (usuario.uuid === novo_usuario.uuid) {
                novaAtualizacao.usuarios[indice] = novo_usuario;
              }
            });
          } else {
            novo_usuario.uuid = uuid();
            novaAtualizacao.usuarios.push(novo_usuario);
          }
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
        // .json({ sucess: novaAtualizacao })
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async atualizarEmail(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { email_update = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaEmail = Yup.object().shape({
        uuid: Yup.string().required(),
        departamento: Yup.string().required(),
        email: Yup.string().required(),
        responsavel: Yup.string().required(),
      });

      if (administrador) {
        if (email_update) {
          if (!(await verificaEmail.isValid(email_update))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for email validation.' });
          }

          const checkEmail = empresa.emails.find(
            (vEmail) => vEmail.uuid === email_update.uuid
          );

          if (checkEmail) {
            empresa.emails.forEach((cEmail, indice) => {
              if (cEmail.uuid === checkEmail.uuid) {
                novaAtualizacao.emails[indice] = email_update;
              }
            });
          } else {
            email_update.uuid = uuid();
            novaAtualizacao.emails.push(email_update);
          }
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
        // .json({ sucess: novaAtualizacao })
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async atualizarTelefone(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { telefone = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaTelefone = Yup.object().shape({
        departamento: Yup.string().required(),
        uuid: Yup.string().required(),
        telefone: Yup.string().required(),
        ramal: Yup.string().required(),
        responsavel: Yup.string().required(),
      });

      if (administrador) {
        if (telefone) {
          if (!(await verificaTelefone.isValid(telefone))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for telephone validation.' });
          }
          const checkTelefone = empresa.telefones.find(
            (vTelefone) => vTelefone.uuid === telefone.uuid
          );

          if (checkTelefone) {
            empresa.telefones.forEach((cTelefone, indice) => {
              if (cTelefone.uuid === checkTelefone.uuid) {
                novaAtualizacao.telefones[indice] = telefone;
              }
            });
          } else {
            telefone.uuid = uuid();
            novaAtualizacao.telefones.push(telefone);
          }
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
        // .json({ sucess: novaAtualizacao })
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async atualizarCadastro(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { dados_cadastrais = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaDadosCadastrais = Yup.object().shape({
        uuid: Yup.string().required(),
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

      if (administrador) {
        if (dados_cadastrais) {
          if (!(await verificaDadosCadastrais.isValid(dados_cadastrais))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for registration validation.' });
          }
          dados_cadastrais.uuid = uuid_empresa;
          novaAtualizacao.dados_cadastrais = dados_cadastrais;
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
        // .json({ sucess: novaAtualizacao })
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
