const API = "http://localhost:3000";

let restaurantesData = [];
let pedidosData = [];
let carrinhoAtual = {};
let restAtual = null;

const tabs = ["home", "pedidos", "perfil"];

const statusClasses = {
  "em preparo": "em-preparo",
  "entregue": "entregue",
  "a caminho": "a-caminho",
  "cancelado": "cancelado",
  "pronto": "entregue"
};

function showTab(name) {
  tabs.forEach(t => {
    document.getElementById("tab-" + t).classList.toggle("active", t === name);
  });
  document.querySelectorAll(".tab").forEach((el, i) => {
    el.classList.toggle("active", tabs[i] === name);
  });
  if (name === "pedidos") renderPedidos();
}

async function carregar() {
  try {
    const [restaurantes, pedidos] = await Promise.all([
      fetch(`${API}/restaurantes`).then(r => r.json()),
      fetch(`${API}/pedidos`).then(r => r.json())
    ]);
    restaurantesData = restaurantes;
    pedidosData = pedidos;
  } catch (e) {
    console.warn("API indisponível, usando dados locais.");
    restaurantesData = [
      {
        id: "1", nome: "Sabor Mineiro", categoria: "Brasileira",
        cardapio: [
          { nome: "Feijão Tropeiro", preco: 32 },
          { nome: "Frango com Quiabo", preco: 30 },
          { nome: "Feijoada", preco: 36 }
        ]
      },
      {
        id: "2", nome: "Pizza Express", categoria: "Pizzaria",
        cardapio: [
          { nome: "Pizza Calabresa", preco: 40 },
          { nome: "Pizza Marguerita", preco: 38 },
          { nome: "Pizza à moda", preco: 49 }
        ]
      },
      {
        id: "3", nome: "Sushi House", categoria: "Japonesa",
        cardapio: [
          { nome: "Combo Sushi 20 peças", preco: 50 },
          { nome: "Temaki Salmão", preco: 27 },
          { nome: "Combo Sushi 37 peças", preco: 67 }
        ]
      }
    ];
    pedidosData = [
      { id: "RE-1", restaurante_id: "1", total: 84, status: "em preparo" },
      { id: "R7-2", restaurante_id: "2", total: 23, status: "em preparo" },
      { id: "E2-3", restaurante_id: "2", total: 99, status: "entregue" }
    ];
  }

  renderRestaurantes();
  renderDash();
  renderPedidos();
}

function renderRestaurantes() {
  const container = document.getElementById("restaurantes");
  container.innerHTML = "";

  restaurantesData.forEach(r => {
    const total = pedidosData.filter(p => p.restaurante_id == r.id).length;
    const div = document.createElement("div");
    div.className = "card-rest";

    const pratos = (r.cardapio || []).map(p => `
      <div class="prato-item">
        <span>${p.nome}</span>
        <strong>R$ ${p.preco.toFixed(2)}</strong>
      </div>
    `).join("");

    div.innerHTML = `
      <div class="card-rest-header">
        <div>
          <h3>${r.nome}</h3>
          <small>${r.categoria}</small>
        </div>
        <span class="badge">${total} pedidos</span>
      </div>
      <div class="cardapio">${pratos}</div>
      <button class="btn-pedido">Realizar Pedido</button>
    `;

    div.querySelector(".btn-pedido").addEventListener("click", () => abrirModal(r));
    container.appendChild(div);
  });
}

function renderDash() {
  const contagem = {};
  pedidosData.forEach(p => {
    contagem[p.restaurante_id] = (contagem[p.restaurante_id] || 0) + 1;
  });

  const topId = Object.keys(contagem).sort((a, b) => contagem[b] - contagem[a])[0];
  const top = restaurantesData.find(r => r.id == topId);

  document.getElementById("topNome").textContent = top ? top.nome : "-";
  document.getElementById("topInfo").textContent = `${contagem[topId] || 0} pedidos realizados`;

  const totalP = restaurantesData.reduce((acc, r) => acc + (r.cardapio ? r.cardapio.length : 0), 0);
  document.getElementById("totalPratos").textContent = `${totalP} pratos`;
  document.getElementById("totalInfo").textContent = `Em ${restaurantesData.length} restaurantes`;
}

function renderPedidos() {
  const tbody = document.getElementById("pedidos-tbody");
  tbody.innerHTML = "";

  pedidosData.forEach(p => {
    const rest = restaurantesData.find(r => r.id == p.restaurante_id);
    const nomeRest = rest ? rest.nome : "Desconhecido";
    const classe = statusClasses[p.status] || "cancelado";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="status ${classe}">${p.status}</span></td>
      <td>R$ ${Number(p.total).toFixed(2)}</td>
      <td>${nomeRest}</td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirModal(r) {
  restAtual = r;
  carrinhoAtual = {};

  document.getElementById("modal-titulo").textContent = r.nome;
  document.getElementById("modal-sub").textContent = r.categoria + " · Selecione os itens";

  const container = document.getElementById("modal-itens");
  container.innerHTML = "";

  (r.cardapio || []).forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div class="item-info">
        <div class="item-nome">${p.nome}</div>
        <div class="item-preco">R$ ${p.preco.toFixed(2)}</div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="altQty(${i}, -1, ${p.preco})">−</button>
        <span class="qty-num" id="qty-${i}">0</span>
        <button class="qty-btn" onclick="altQty(${i}, 1, ${p.preco})">+</button>
      </div>
    `;
    container.appendChild(row);
  });

  atualizarTotal();
  document.getElementById("modal").classList.add("open");
}

function fecharModal() {
  document.getElementById("modal").classList.remove("open");
}

function altQty(idx, delta, preco) {
  const atual = carrinhoAtual[idx] || 0;
  const novo = Math.max(0, atual + delta);
  carrinhoAtual[idx] = novo;
  document.getElementById(`qty-${idx}`).textContent = novo;
  atualizarTotal();
}

function atualizarTotal() {
  let total = 0;
  if (restAtual) {
    (restAtual.cardapio || []).forEach((p, i) => {
      total += (carrinhoAtual[i] || 0) * p.preco;
    });
  }
  document.getElementById("modal-total").textContent = `R$ ${total.toFixed(2)}`;
}

async function confirmarPedido() {
  if (!restAtual) return;

  const total = (restAtual.cardapio || []).reduce((acc, p, i) => {
    return acc + (carrinhoAtual[i] || 0) * p.preco;
  }, 0);

  if (total === 0) {
    alert("Selecione ao menos um item!");
    return;
  }

  const novoPedido = {
    restaurante_id: restAtual.id,
    total: Math.round(total),
    status: "em preparo"
  };

  try {
    const res = await fetch(`${API}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPedido)
    });
    const salvo = await res.json();
    pedidosData.push(salvo);
  } catch (e) {
    pedidosData.push({ ...novoPedido, id: "local-" + Date.now() });
  }

  fecharModal();
  renderRestaurantes();
  renderDash();
  renderPedidos();
  alert(`Pedido no ${restAtual.nome} realizado com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
}

function salvarPerfil() {
  const perfil = {
    nome: document.getElementById("pf-nome").value,
    email: document.getElementById("pf-email").value,
    telefone: document.getElementById("pf-tel").value,
    endereco: {
      cep: document.getElementById("pf-cep").value,
      numero: document.getElementById("pf-num").value,
      rua: document.getElementById("pf-rua").value,
      bairro: document.getElementById("pf-bairro").value,
      cidade: document.getElementById("pf-cidade").value
    }
  };

  localStorage.setItem("delivery_perfil", JSON.stringify(perfil));

  const alerta = document.getElementById("alert-ok");
  alerta.style.display = "block";
  setTimeout(() => alerta.style.display = "none", 3000);
}

function carregarPerfil() {
  try {
    const p = JSON.parse(localStorage.getItem("delivery_perfil") || "{}");
    if (p.nome)  document.getElementById("pf-nome").value  = p.nome;
    if (p.email) document.getElementById("pf-email").value = p.email;
    if (p.telefone) document.getElementById("pf-tel").value = p.telefone;
    if (p.endereco) {
      const e = p.endereco;
      if (e.cep)    document.getElementById("pf-cep").value    = e.cep;
      if (e.numero) document.getElementById("pf-num").value    = e.numero;
      if (e.rua)    document.getElementById("pf-rua").value    = e.rua;
      if (e.bairro) document.getElementById("pf-bairro").value = e.bairro;
      if (e.cidade) document.getElementById("pf-cidade").value = e.cidade;
    }
  } catch (e) {
    console.warn("Erro ao carregar perfil salvo.");
  }
}

carregar();
carregarPerfil();