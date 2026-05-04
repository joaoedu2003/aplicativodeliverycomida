const connectDB = require('./config/database');
const Restaurante = require('./models/restauranteModel');
const Pedido = require('./models/pedidoModel');

const executarOperacoes = async () => {
    await connectDB();

    console.log('\n[Operação 1] Atualizando com $inc');
    const restAtualizado = await Restaurante.findOneAndUpdate(
        { nome: "Pé de Serra" },
        { $inc: { total_pedidos: 1 } },
        { new: true }
    );
    console.log(`Total de pedidos do ${restAtualizado.nome} atualizado para: ${restAtualizado.total_pedidos}`);

    console.log('\n[Operação 2] Inserindo em Array com $push');
    await Restaurante.updateOne(
        { nome: "Pé de Serra" },
        { $push: { cardapio: { nome_prato: "Refrigerante 2L", preco: 12.00, descricao: "Coca-Cola gelada" } } }
    );
    console.log('Novo item adicionado ao cardápio com sucesso.');

    console.log('\n[Relatório 1] Agregação com $lookup e $unwind');
    const relatorioJuncao = await Pedido.aggregate([
        { 
            $lookup: {
                from: "restaurantes",
                localField: "restaurante_id",
                foreignField: "_id",
                as: "dados_restaurante"
            }
        },
        { $unwind: "$dados_restaurante" },
        { 
            $project: {
                _id: 0,
                valor_total: 1,
                status_producao: 1,
                "Restaurante": "$dados_restaurante.nome"
            }
        }
    ]);
    console.log(relatorioJuncao);

    console.log('\n[Relatório 2] Análise Multifacetada com $facet');
    const relatorioFacet = await Restaurante.aggregate([
        {
            $facet: {
                "restaurantes_mais_pedidos": [
                    { $sort: { total_pedidos: -1 } },
                    { $limit: 1 },
                    { $project: { _id: 0, nome: 1, total_pedidos: 1 } }
                ],
                "total_pratos_oferecidos": [
                    { $unwind: "$cardapio" },
                    { $count: "quantidade_total_pratos" }
                ]
            }
        }
    ]);
    console.dir(relatorioFacet, { depth: null });

    console.log('\nProcesso finalizado.');
    process.exit();
};

executarOperacoes();