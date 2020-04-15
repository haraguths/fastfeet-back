import Sequelize, { Model } from 'sequelize';

class Encomendas extends Model {
  static init(sequelize) {
    super.init({
      product: Sequelize.STRING,
      canceled_at: Sequelize.DATE,
      start_at: Sequelize.DATE,
      end_at: Sequelize.DATE,
    },
    {
      sequelize
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipients, { foreignKey: 'recipient_id', as: 'recipient' });
    this.belongsTo(models.Entregadores, { foreignKey: 'entregador_id', as: 'entregador' });
    this.belongsTo(models.Signature, { foreignKey: 'signature_id', as: 'signature' });
  }
}

export default Encomendas;
