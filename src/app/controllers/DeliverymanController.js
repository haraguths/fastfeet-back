import {
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import Files from '../models/Files';
import Entregadores from '../models/Entregadores';
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

  async startDate(req, res) {

    const schema = Yup.object().shape({
      encomendaId: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const entregador = await Entregadores.findByPk(req.params.id);
    if(!entregador) {
      return res.status(400).json({ error: 'Entregador not exists.' });
    }

    const encomendas = await Encomendas.findAll({
      where: {
        entregador_id: req.params.id,
        start_at: {
          [Op.between]:  [startOfDay(new Date()), endOfDay(new Date())]
        }
      }
    });

    if(encomendas.length > 4) {
      return res.status(400).json({ error: 'Entregador já retirou 5 encomendas hoje.' });
    }

    const { encomendaId } = req.body;
    const encomenda = await Encomendas.findByPk(encomendaId);

    await encomenda.update({ start_at: new Date() });

    return res.json(encomenda);
  }

  async endDate(req, res) {

    const schema = Yup.object().shape({
      encomendaId: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const entregador = await Entregadores.findByPk(req.params.id);
    if(!entregador) {
      return res.status(400).json({ error: 'Entregador not exists.'});
    }

    const { encomendaId } = req.body;
    const encomenda = await Encomendas.findByPk(encomendaId);
    if(encomenda.entregador_id !== entregador.id) {
      return res.status(400).json({ error: 'Entregador possui essa encomenda.'});
    }

    await encomenda.update({ end_at: new Date() });

    return res.json(encomenda);
  }
}

export default new DeliverymanController();
