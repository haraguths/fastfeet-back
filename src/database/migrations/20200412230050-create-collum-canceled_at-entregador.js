'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('entregadores', 'canceled_at', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('entregadores', 'canceled_at');
  }
};
