const Restaurante = require('../models/restauranteModel');

exports.criarRestaurante = async (req, res) => {
    try {
        const restaurante = new Restaurante(req.body);
        await restaurante.save();
        res.status(201).json(restaurante);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

exports.listarRestaurantes = async (req, res) => {
    try {
        const restaurantes = await Restaurante.find().populate('dono_id', 'nome email');
        res.status(200).json(restaurantes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.adicionarItemCardapio = async (req, res) => {
    try {
        const restaurante = await Restaurante.findByIdAndUpdate(
            req.params.id,
            { $push: { cardapio: req.body } },
            { new: true }
        );
        res.status(200).json(restaurante);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};
