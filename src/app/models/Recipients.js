import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      rua: Sequelize.STRING,
      numero: Sequelize.INTEGER,
      complemento: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
      estado: Sequelize.STRING,
      cidade: Sequelize.STRING,
      cep: Sequelize.STRING,
    },
    {
      sequelize
    });
  }
}

export default User;
