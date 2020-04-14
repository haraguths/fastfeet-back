import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipients from '../app/models/Recipients';
import Files from '../app/models/Files';
import Entregadores from '../app/models/Entregadores';
import Signature from '../app/models/Signature';

import databaseConfig from '../config/database';

const models = [User, Recipients, Files, Entregadores, Signature];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map( model => model.init(this.connection))
      .map( model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
