import * as Yup from 'yup';
import Entregadores from '../models/Entregadores';
import Recipient from '../models/Recipients';
import Encomendas from '../models/Encomendas';

import Mail from '../../lib/Mail';

class EncomendasController {

  async store(req, res) {


    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { entregador_id, product, recipient_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient invalid.' });
    }

    const entregador = await Entregadores.findByPk(recipient_id);
    if (!entregador) {
      return res.status(400).json({ error: 'Entregador invalid.' });
    }

    await Encomendas.create(req.body)

    // enviar email
    await Mail.sendMail({
      to: `${entregador.name} <${entregador.email}>`,
      subject: 'Entrega cadastrada.',
      template: 'nova-encomenda',
      context: {
        entregador: entregador.name,
        produto: product,
      }
    })

    return res.json({
      product,
      recipient_id,
      entregador_id,
    });
  }

  async index(req, res) {
    const encomendas = await Encomendas.findAll({
      attributes: ['id', 'product', 'start_at', 'end_at', 'canceled_at' ],
      include: [{
        model: Entregadores,
        as: 'entregador',
        attributes: ['name'],
      },{
        model: Recipient,
        as: 'recipient',
        attributes: ['name', 'rua', 'numero', 'complemento', 'estado', 'cidade', 'cep'],
      }]
    });

    return res.json(encomendas);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      entregador_id: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, product, recipient_id, entregador_id } = req.body;

    const encomenda = await Encomendas.findByPk(recipient_id);

    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda invalid.' });
    }

    if (encomenda.end_at) {
      return res.status(400).json({ error: 'Encomenda delivered.' });
    }

    await encomenda.update(req.body);

    return res.json({
      id,
      product,
      recipient_id,
      entregador_id,
    });
  }

  async delete(req, res) {
    const encomendas = await Encomendas.findByPk(req.params.id);

    if(!encomendas) {
      return res.status(400).json({ error: 'Entregador not exists.' });
    }

    await encomendas.update({ canceled_at: new Date() });

    const entregador = await Entregadores.findByPk(encomendas.entregador_id);

    await Mail.sendMail({
      to: `${entregador.name} <${entregador.email}>`,
      subject: 'Entrega cancelada.',
      template: 'cancelamento-encomenda',
      context: {
        entregador: entregador.name,
        produto: encomendas.product,
      }
    })

    return res.json(encomendas);
  }
}

export default new EncomendasController();
