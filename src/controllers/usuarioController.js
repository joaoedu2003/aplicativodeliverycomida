const Usuario = require('../models/usuarioModel');

exports.criarUsuario = async (req, res) => {
    try {
        const novoUsuario = new Usuario(req.body);
        await novoUsuario.save();
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.buscarUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};
