import Sequelize, { Model } from 'sequelize';

class Deliveryproblem extends Model {
  static init(sequelize) {
    super.init({
      description: Sequelize.STRING,
    },
    {
      sequelize
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Encomendas, { foreignKey: 'delivery_id', as: 'encomenda' });
  }
}

export default Deliveryproblem;
