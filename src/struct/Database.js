const Sequelize = require('sequelize');
const path = require('path');
const util = require('util');
const fs = require('fs');

const readdir = util.promisify(fs.readdir);

const db = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: path.join(__dirname, '..', '..', 'database.sqlite')
});

class Database {
    static get db() {
        return db;
    }

    static async authenticate() {
        await db.authenticate();
        await this.loadModels(path.join(__dirname, '..', 'models'));
    }

    static async loadModels(filepath) {
        const files = await readdir(filepath);
        for (const file of files) {
            if (!/.js$/.test(file)) continue;
            await require(path.join(filepath, file)).sync(); // eslint-disable-line no-await-in-loop
        }
    }
}

module.exports = Database;
