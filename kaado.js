require('./src/util/Extensions');

const KaadoClient = require('./src/struct/KaadoClient');

const config = require('./config.json');
const client = new KaadoClient(config);

client.start();
