import * as Yup from 'yup';
import Entregadores from '../models/Entregadores';
import Encomendas from '../models/Encomendas';
import Deliveryproblem from '../models/Deliveryproblem';

import Mail from '../../lib/Mail';

class DeliveryProblemsController {

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id : Yup.number().required(),
      description : Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const entregador = await Entregadores.findByPk(req.params.id);
    if (!entregador) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const { delivery_id, description } = req.body;
    const encomenda = await Encomendas.findByPk(delivery_id);

    if(encomenda.entregador_id !== entregador.id) {
      return res.status(400).json({ error: 'Entrega não pertence a este entregador.' });
    }
    if(encomenda.end_at) {
      return res.status(400).json({ error: 'Entrega já finalizada.' });
    }

    await Deliveryproblem.create(req.body);

    return res.json({ delivery_id, description });
  }

  async index(req, res) {
    const { delivery_id } = req.body;

    const deliveryproblems = await Deliveryproblem.findAll({
      where: { delivery_id },
      attributes: ['description'],
      include: [{
        model: Encomendas,
        as: 'encomenda',
        attributes: ['product'],
      }]
    });

    return res.json(deliveryproblems);
  }

  async all(req, res) {
    const deliveryproblems = await Deliveryproblem.findAll({
      attributes: ['description'],
      include: [{
        model: Encomendas,
        as: 'encomenda',
        attributes: ['product'],
        where: {
          end_at: null
        }
      }]
    });

    return res.json(deliveryproblems);
  }

  async deleteDelivery(req, res) {

    const encomenda= await Encomendas.findByPk(req.params.id);
    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda não encontrada.' });
    }

    await encomenda.update({ canceled_at: new Date() });
    const entregador = await Entregadores.findByPk(encomenda.entregador_id);

    await Mail.sendMail({
      to: `${entregador.name} <${entregador.email}>`,
      subject: 'Entrega cancelada.',
      template: 'cancelamento-encomenda',
      context: {
        entregador: entregador.name,
        produto: encomenda.product,
      }
    })

    return res.json(encomenda);
  }

}

export default new DeliveryProblemsController();
