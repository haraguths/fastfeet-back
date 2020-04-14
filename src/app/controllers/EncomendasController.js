import * as Yup from 'yup';
import Entregadores from '../models/Entregadores';
import Recipient from '../models/Recipients';
import Encomendas from '../models/Encomendas';

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

    const recipient = await Recipient.findByPk(recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient invalid.' });
    }

    const entregador = await Entregadores.findByPk(recipient_id);
    if (!entregador) {
      return res.status(400).json({ error: 'Entregador invalid.' });
    }

    // enviar email

    const {
      product,
      recipient_id,
      entregador_id,
    } = await Encomendas.create(req.body)

    return res.json({
      product,
      recipient_id,
      entregador_id,
    });
  }

}

export default new EncomendasController();
