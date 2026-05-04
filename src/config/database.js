const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = 'mongodb+srv://admin:senhaDelivery123@cluster0.wrlbawm.mongodb.net/delivery_db?appName=Cluster0'

        await mongoose.connect(uri);
        console.log('Banco de dados conectado!')
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;