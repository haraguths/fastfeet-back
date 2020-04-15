import * as Yup from 'yup';
import Entregadores from '../models/Entregadores';
import Files from '../models/Files';
import Encomendas from '../models/Encomendas';
import Recipients from '../models/Recipients';

class DeliverymanController {

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

  async deliveries(req, res) {
    const deliveries = await Encomendas.findAll({
      where: { entregador_id: req.params.id },
      attributes: ['id', 'product', 'start_at', 'end_at', 'canceled_at' ],
      include: [{
        model: Entregadores,
        as: 'entregador',
        attributes: ['name'],
      },{
        model: Recipients,
        as: 'recipient',
        attributes: ['name', 'rua', 'numero', 'complemento', 'estado', 'cidade', 'cep'],
      }]
    });
    return res.json(deliveries);
  }

  async delivered(req, res) {
    const deliveries = await Encomendas.findAll({
      where: { entregador_id: req.params.id, end_at: null },
      attributes: ['id', 'product', 'start_at', 'end_at', 'canceled_at' ],
      include: [{
        model: Entregadores,
        as: 'entregador',
        attributes: ['name'],
      },{
        model: Recipients,
        as: 'recipient',
        attributes: ['name', 'rua', 'numero', 'complemento', 'estado', 'cidade', 'cep'],
      }]
    });
    return res.json(deliveries);
  }

}

export default new DeliverymanController();
