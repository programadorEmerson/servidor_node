import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import Empresa from '../models/Empresa_Model';

class Usuario_Controller {
  async gerenciarUsuario(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const novoUsuario = {
      uuid: req.body.uuid,
      nome: req.body.nome,
      setor: req.body.setor,
      super_usuario: req.body.super_usuario,
      ultimo_acesso: req.body.ultimo_acesso,
      email: req.body.email,
      active: req.body.active,
    };
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
        if (!(await verificaUsuario.isValid(req.body))) {
          return res
            .status(400)
            .json({ error: 'Invalid data for new user validation.' });
        }

        const verificaUser = empresa.usuarios.find(
          (usuario) => usuario.uuid === novoUsuario.uuid
        );

        if (verificaUser) {
          empresa.usuarios.forEach((usuario, indice) => {
            if (usuario.uuid === req.body.uuid) {
              novaAtualizacao.usuarios[indice] = novoUsuario;
            }
          });
        } else {
          novoUsuario.uuid = uuid();
          novaAtualizacao.usuarios.push(novoUsuario);
        }

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return res
          .status(200)
          .json({ sucess: 'Operation completed with sucess.' });
        // .json({ sucess: novaAtualizacao.usuarios })
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async deletarUsuario(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa, uuid_user } = req.headers;
    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );
      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      if (administrador) {
        const usuariosFiltrados = empresa.usuarios.filter(
          (usuario) => usuario.uuid !== uuid_user
        );

        novaAtualizacao.usuarios = usuariosFiltrados;

        await Empresa.updateOne({ _id: empresa._id }, novaAtualizacao);
        return (
          res
            .status(200)
            // .json({ sucess: 'Operation completed with sucess.' });
            .json({ sucess: novaAtualizacao.usuarios })
        );
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async listarUsuario(req, res) {
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
        return res.status(200).json({ sucess: empresa.usuarios });
      }

      return res
        .status(400)
        .json({ error: 'User with no privileges to update.' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data for this request' });
    }
  }

  async atualizarUsuario(req, res) {
    const empresas = await Empresa.find();
    const { uuid_admin, uuid_empresa } = req.headers;
    const { usuario = null } = req.body;

    try {
      const empresa = empresas.find(
        (cEmpresa) => cEmpresa.dados_cadastrais.uuid === uuid_empresa
      );

      const novaAtualizacao = empresa;

      const administrador = empresa.usuarios.find(
        (cUsuario) => cUsuario.uuid === uuid_admin
      ).super_usuario;

      const verificaUsuario = Yup.object().shape({
        uuid: Yup.string().required(),
        nome: Yup.string().required(),
        setor: Yup.string().required(),
        super_usuario: Yup.boolean().required(),
        ultimo_acesso: Yup.string().required(),
        email: Yup.string().required(),
        active: Yup.boolean().required(),
      });
      if (administrador) {
        if (usuario) {
          if (!(await verificaUsuario.isValid(usuario))) {
            return res
              .status(400)
              .json({ error: 'Invalid data for new user validation.' });
          }

          const verificaUser = empresa.usuarios.find(
            (busca) => busca.uuid === usuario.uuid
          );

          if (verificaUser) {
            empresa.usuarios.forEach((loop, indice) => {
              if (loop.uuid === usuario.uuid) {
                novaAtualizacao.usuarios[indice] = usuario;
              }
            });
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
}

export default new Usuario_Controller();
