// Grafo como lista de adjacência: planeta -> { vizinho: custo de combustível }
const grafo = {
  Mercurio: { Venus: 3, Terra: 2 },
  Venus:    { Mercurio: 3, Terra: 1, Marte: 6, Jupiter: 9 },
  Terra:    { Mercurio: 2, Venus: 1, Marte: 3, Saturno: 10 },
  Marte:    { Venus: 6, Terra: 3, Jupiter: 4, Saturno: 5 },
  Jupiter:  { Venus: 9, Marte: 4, Saturno: 2, Urano: 5 },
  Saturno:  { Terra: 10, Marte: 5, Jupiter: 2, Netuno: 7 },
  Urano:    { Jupiter: 5, Netuno: 2 },
  Netuno:   { Saturno: 7, Urano: 2 }
};

// Posição de cada planeta na tela
const posicao = {
  Mercurio: [60, 200], Venus: [190, 90], Terra: [190, 310], Marte: [340, 200],
  Jupiter: [470, 80], Saturno: [470, 320], Urano: [610, 100], Netuno: [630, 300]
};

const INICIO = "Mercurio", DESTINO = "Netuno";
let atual, combustivel, viagens, caminho, fim;

function reiniciar() {
  atual = INICIO;
  combustivel = 0;
  viagens = 0;
  caminho = [INICIO];
  fim = false;
  document.getElementById("mensagem").innerHTML = "";
  desenhar();
}

function viajar(planeta) {
  if (fim || !(planeta in grafo[atual])) return; // só pode ir para vizinhos
  combustivel += grafo[atual][planeta];
  viagens++;
  atual = planeta;
  caminho.push(planeta);
  if (atual === DESTINO) vitoria();
  desenhar();
}

// Dijkstra: menor custo de "inicio" até "destino"
function dijkstra(inicio, destino) {
  const dist = {}, anterior = {}, visitados = [];
  for (const p in grafo) dist[p] = Infinity;
  dist[inicio] = 0;

  while (visitados.length < Object.keys(grafo).length) {
    // pega o planeta não visitado com a menor distância
    let u = null;
    for (const p in grafo)
      if (!visitados.includes(p) && (u === null || dist[p] < dist[u])) u = p;
    visitados.push(u);

    // tenta melhorar a distância dos vizinhos
    for (const v in grafo[u]) {
      if (dist[u] + grafo[u][v] < dist[v]) {
        dist[v] = dist[u] + grafo[u][v];
        anterior[v] = u;
      }
    }
  }

  // reconstrói o caminho voltando do destino
  const rota = [];
  for (let p = destino; p; p = anterior[p]) rota.unshift(p);
  return { custo: dist[destino], rota: rota };
}

function vitoria() {
  fim = true;
  const melhor = dijkstra(INICIO, DESTINO);
  let texto = "🎉 Você chegou em " + DESTINO + "!<br>" +
    "Seu caminho: " + caminho.join(" → ") + " (custo " + combustivel + ")<br>" +
    "Menor caminho (Dijkstra): " + melhor.rota.join(" → ") + " (custo " + melhor.custo + ")<br>";
  if (combustivel === melhor.custo) texto += "<b>Perfeito! Você achou o menor caminho.</b>";
  else texto += "<b>Você gastou " + (combustivel - melhor.custo) + " a mais que o ideal.</b>";
  document.getElementById("mensagem").innerHTML = texto;
}

function desenhar() {
  let svg = "";

  // arestas (cada uma é desenhada uma vez só)
  for (const a in grafo) {
    for (const b in grafo[a]) {
      if (a > b) continue;
      const [x1, y1] = posicao[a], [x2, y2] = posicao[b];
      const classe = !fim && (a === atual || b === atual) ? "disponivel" : "";
      svg += `<line class="${classe}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      svg += `<text class="custo" x="${(x1 + x2) / 2 + 12}" y="${(y1 + y2) / 2 - 6}">${grafo[a][b]}</text>`;
    }
  }

  // vértices
  for (const p in grafo) {
    const [x, y] = posicao[p];
    let classe = "";
    if (p === DESTINO) classe = "destino";
    if (!fim && p in grafo[atual]) classe = "vizinho";
    if (p === atual) classe = "atual";
    svg += `<circle class="${classe}" cx="${x}" cy="${y}" r="24" onclick="viajar('${p}')"/>`;
    svg += `<text x="${x}" y="${y + 42}">${p}</text>`;
  }

  document.getElementById("mapa").innerHTML = svg;
  document.getElementById("atual").textContent = atual;
  document.getElementById("destino").textContent = DESTINO;
  document.getElementById("combustivel").textContent = combustivel;
  document.getElementById("viagens").textContent = viagens;
}

reiniciar();
