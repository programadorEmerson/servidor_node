import * as Yup from 'yup';
import Firebase from '../conexao/index';
import User from '../models/Usuario';

class Usuario {
  // Não utilizada, faz a consulta no banco de dados do Firebase/Firestore
  setUsuario(req, res) {
    const { uuid_user } = req.headers;
    // const { nome, sobrenome } = req.body;

    Firebase.firestore()
      .collection('vinculo')
      .doc(uuid_user)
      .get()
      .then((vinculo) => {
        const resultados = [];
        const { empresa } = vinculo.data();

        Firebase.firestore()
          .collection(empresa)
          .get()
          .then((result) => {
            result.docs.forEach((doc) => {
              resultados.push(doc.data());
            });

            const logado = resultados
              .filter((us) => us && us.Departamentos)[0]
              .Departamentos.filter((obj) => obj.Id === uuid_user)[0];
            resultados.push({ UsuarioLogado: logado });
            return res.status(200).json(resultados);
          });
      })
      .catch(() => res.status(401).json({ erro: 'Usuário não encontrado' }));
  }

  async criarUsuario(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().required(),
      senha: Yup.string().required(),
      vinculo: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'The data reported is invalid.' });
    }

    if (!(await User.findOne({ email: req.body.email }))) {
      const user = await User.create(req.body);
      user.senha = undefined;
      return res.status(200).json({ sucess: user });
    }

    return res
      .status(401)
      .json({ error: `The user ${req.body.email} already exists.` });
  }
}

export default new Usuario();
