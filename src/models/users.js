const Sequelize = require('sequelize');
const Database = require('../struct/Database');

const User = Database.db.define('users', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    profile: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
    }
});

module.exports = User;
