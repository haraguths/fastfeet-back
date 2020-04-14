'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('encomendas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        references: { model: 'recipients', key: 'id'},
        allowNull: false,
      },
      entregador_id: {
        type: Sequelize.INTEGER,
        references: { model: 'entregadores', key: 'id'},
        allowNull: false,
      },
      signature_id: {
        type: Sequelize.INTEGER,
        references: { model: 'signature', key: 'id'},
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('encomendas');
  }
};
