const express = require('express');
const router = express.Router();
const userCtrl = require('./controllers/usuarioController');
const restCtrl = require('./controllers/restauranteController');
const pedCtrl = require('./controllers/pedidoController');

// Rotas Usuário
router.post('/usuarios', userCtrl.criarUsuario);
router.get('/usuarios', userCtrl.listarUsuarios);

// Rotas Restaurante
router.post('/restaurantes', restCtrl.criarRestaurante);
router.get('/restaurantes', restCtrl.listarRestaurantes);
router.patch('/restaurantes/:id/cardapio', restCtrl.adicionarItemCardapio);

// Rotas Pedido
router.post('/pedidos', pedCtrl.criarPedido);
router.get('/pedidos', pedCtrl.listarPedidos);
router.patch('/pedidos/:id/status', pedCtrl.atualizarStatus);

module.exports = router;
