import Firebase from '../conexao/index';

class Usuario {
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
}

export default new Usuario();
