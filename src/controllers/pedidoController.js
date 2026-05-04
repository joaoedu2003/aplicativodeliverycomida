const Pedido = require('../models/pedidoModel');
const Restaurante = require('../models/restauranteModel');

exports.criarPedido = async (req, res) => {
    try {
        const novoPedido = new Pedido(req.body);
        await novoPedido.save();

        await Restaurante.findByIdAndUpdate(req.body.restaurante_id, {
            $inc: { total_pedidos: 1 }
        });

        res.status(201).json(novoPedido);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

exports.listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate('cliente_id', 'nome')
            .populate('restaurante_id', 'nome');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.atualizarStatus = async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { status_producao: req.body.status_producao },
            { new: true }
        );
        res.status(200).json(pedido);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};
