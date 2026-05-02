const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema ({
    cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    restaurante_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },

    status_producao: {
        type: String,
        required: true,
        default: 'Aguardando'
    },

    itens_comprados: [{
        nome_prato: { type: String, required: true },
        preco_congelado: { type: Number, required:true },
        quantidade: { type: Number, required: true, default: 1 }

    }],

    valor_total: {
        type: Number,
        required: true
    },

    data_pedido: {
        type: Date,
        default: Date.now
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;