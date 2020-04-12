import * as Yup from 'yup';
import Entregadores from '../models/Entregadores';
import Files from '../models/Files';

class EntregadorController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      avatar_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      name,
      email,
      avatar_id,
    } = await Entregadores.create(req.body)

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async index(req, res) {
    const entregadores = await Entregadores.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id', 'canceled_at' ],
      include: [{
        model: Files,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      }]
    });
    return res.json(entregadores);
  }

  async update(req, res) {

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      email: Yup.string().required(),
      avatar_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, name, email, avatar_id } = req.body;
    const entregador = await Entregadores.findByPk(id);

    if(!entregador) {
      return res.status(400).json({ error: 'Entregador not exists.' });
    }

    await entregador.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {

    const entregador = await Entregadores.findByPk(req.params.id);

    if(!entregador) {
      return res.status(400).json({ error: 'Entregador not exists.' });
    }

    await entregador.update({ canceled_at: new Date() });

    return res.json(entregador);
  }
}

export default new EntregadorController();
