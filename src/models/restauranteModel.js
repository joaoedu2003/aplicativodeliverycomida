const mongoose = require('mongoose');

const restauranteSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },

    cnpj: {
        type: String,
        required: true,
        unique: true
    },

    categoria: {
        type: String,
        required: true
    },

    total_pedidos: {
        type: Number,
        default: 0
    },

    dono_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    cardapio: [{
        nome_prato: { type: String, required: true },
        preco: { type: Number, required: true },
        descricao: { type: String }
    }]
});

const Restaurante = mongoose.model('Restaurante', restauranteSchema);

module.exports = Restaurante;