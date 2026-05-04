const connectDB = require('./config/database');
const Usuario = require('./models/usuarioModel');
const Restaurante = require('./models/restauranteModel');
const Pedido = require('./models/pedidoModel');

const popularBanco = async () => {
    await connectDB();

    console.log('[Setup] Limpando coleções existentes.');
    await Usuario.deleteMany();
    await Restaurante.deleteMany();
    await Pedido.deleteMany();

    console.log('[Seed] Inserindo usuários...');
    const usuarios = await Usuario.insertMany([
        { nome: "Ana Souza", email: "ana.souza@email.com", telefone: "31995990001", enderecos: [{ titulo_endereco: "Casa", rua: "Avenida Bernardo Monteiro", bairro: "Savassi", numero: 1154 }] },
        { nome: "Carlos Lima", email: "carlos.lima@email.com", telefone: "319994990002", enderecos: [{ titulo_endereco: "Trabalho", rua: "Avenida Afonso Pena", bairro: "Centro", numero: 655 }] },
        { nome: "Juliana Alves", email: "juliana.alves@email.com", telefone: "31999990003", enderecos: [{ titulo_endereco: "Casa", rua: "Rua do Uruguai", bairro: "Sion", numero: 678 }] },
        { nome: "Marcos Ferreira", email: "marcos.ferreira@email.com", telefone: "31999990004", enderecos: [{ titulo_endereco: "Casa", rua: "Rua Bueno Brandão", bairro: "Santa Tereza", numero: 30 }] },
        { nome: "Fernanda Rocha", email: "fernanda.rocha@email.com", telefone: "31999990005", enderecos: [{ titulo_endereco: "Casa", rua: "Rua Ernani Agricola", bairro: "Buritis", numero: 1111 }] }
    ]);

    console.log('[Seed] Inserindo restaurantes...');
    const restaurantes = await Restaurante.insertMany([
        { nome: "Sabor Mineiro", cnpj: "00.000.000/0001-01", categoria: "Comida Brasileira", dono_id: usuarios[0]._id, cardapio: [{ nome_prato: "Feijão Tropeiro", preco: 32.0 }, { nome_prato: "Frango com Quiabo", preco: 30.0 }, { nome_prato: "Feijoada", preco: 36.0 }] },
        { nome: "Pizza Express", cnpj: "00.000.000/0001-02", categoria: "Pizzaria", dono_id: usuarios[1]._id, cardapio: [{ nome_prato: "Pizza Calabresa", preco: 40.0 }, { nome_prato: "Pizza Marguerita", preco: 38.0 }, { nome_prato: "Pizza A moda", preco: 49.0 }] },
        { nome: "Sushi House", cnpj: "00.000.000/0001-03", categoria: "Japonesa", dono_id: usuarios[2]._id, cardapio: [{ nome_prato: "Combo Sushi 20 peças", preco: 50.0 }, { nome_prato: "Temaki Salmão", preco: 27.0 }, { nome_prato: "Combo Sushi 37 peças", preco: 67.0 }] }
    ]);

    console.log('[Seed] Inserindo pedidos...');
    await Pedido.insertMany([
        { cliente_id: usuarios[0]._id, restaurante_id: restaurantes[1]._id, status_producao: "Entregue", valor_total: 40.0, itens_comprados: [{ nome_prato: "Pizza Calabresa", quantidade: 1, preco_congelado: 40.0 }] },
        { cliente_id: usuarios[2]._id, restaurante_id: restaurantes[0]._id, status_producao: "Em preparo", valor_total: 68.0, itens_comprados: [{ nome_prato: "Feijão Tropeiro", quantidade: 1, preco_congelado: 32.0 }, { nome_prato: "Feijoada", quantidade: 1, preco_congelado: 36.0 }] },
        { cliente_id: usuarios[1]._id, restaurante_id: restaurantes[2]._id, status_producao: "Entregue", valor_total: 121.0, itens_comprados: [{ nome_prato: "Temaki Salmão", quantidade: 2, preco_congelado: 27.0 }, { nome_prato: "Combo Sushi 37 peças", quantidade: 1, preco_congelado: 67.0 }] },
        { cliente_id: usuarios[4]._id, restaurante_id: restaurantes[0]._id, status_producao: "Cancelado", valor_total: 30.0, itens_comprados: [{ nome_prato: "Frango com Quiabo", quantidade: 1, preco_congelado: 30.0 }] },
        { cliente_id: usuarios[3]._id, restaurante_id: restaurantes[1]._id, status_producao: "Entregue", valor_total: 76.0, itens_comprados: [{ nome_prato: "Pizza Marguerita", quantidade: 2, preco_congelado: 38.0 }] }
    ]);

    console.log('[Finalizado] Carga de dados concluída.');
    process.exit();
};

popularBanco();