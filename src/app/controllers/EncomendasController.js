import * as Yup from 'yup';
import Entregadores from '../models/Entregadores';
import Recipient from '../models/Recipients';
import Encomendas from '../models/Encomendas';

import Mail from '../../lib/Mail';

class EncomendasController {

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      entregador_id: Yup.number().required(),
    })

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

}

export default new EncomendasController();
