const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports.connect = async () => {
    const mongoServer =  await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}

module.exports.clearMensagensNaSala = async () => {
    const collections = mongoose.connection.collections;
    if (collections.salas) { 
        await collections.transacaos.deleteMany({});
    }
};