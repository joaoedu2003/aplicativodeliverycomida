const mongoose = require ('mongoose');

const usuarioSchema = new mongoose.Schema ({
    nome: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    telefone: {
        type: String, 
        required: true
    },

    enderecos: [{
        titulo_endereco: { type: String, required: true  },
        rua: { type: String, required: true },
        bairro: { type: String, required: true },
        numero: { type: Number, required: true }
    }]
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;