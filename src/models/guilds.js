const Sequelize = require('sequelize');
const Database = require('../struct/Database');

const Guild = Database.db.define('guilds', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    settings: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
    }
});

module.exports = Guild;
