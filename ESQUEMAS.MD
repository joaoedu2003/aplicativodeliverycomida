# 🗄️ Modelagem do Banco de Dados (Esquemas)

Este documento detalha o rascunho lógico das coleções que serão implementadas no MongoDB para o sistema de Delivery.

## 1. Coleção: RESTAURANTES

* **nome:** String
* **cnpj:** String
* **categoria:** String
* **total_pedidos:** Number
* **dono_id:** ObjectId (Referência a Usuários)
* **cardapio:** Array de Objetos (Documento Aninhado)
  * `nome_prato`: String
  * `preco`: Number
  * `descricao`: String

## 2. Coleção: USUÁRIOS

* **nome:** String
* **email:** String
* **telefone:** String
* **enderecos:** Array de Objetos (Documento Aninhado)
  * `titulo_endereco`: String
  * `rua`: String
  * `bairro`: String
  * `numero`: Number

---

## 3. Coleção: PEDIDOS

* **cliente_id:** ObjectId (Referência a Usuários)
* **restaurante_id:** ObjectId (Referência a Restaurantes)
* **status_producao:** String
* **itens_comprados:** Array de Objetos (Documento Aninhado)
  * `nome_prato`: String
  * `preco_congelado`: Number
  * `quantidade`: Number
* **valor_total:** Number
* **data_pedido:** Date