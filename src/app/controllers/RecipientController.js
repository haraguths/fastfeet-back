import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class UserController {
  async store(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string().required(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep
    } = await Recipients.create(req.body)

    return res.json({
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string().required(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipients = await Recipients.findByPk(req.id);

    const {
      id,
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep
    } = await recipients.update(req.body);

    return res.json({
      id,
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep
    });
  }

}

export default new UserController();
