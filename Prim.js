function showCreate() {
  let form = document.getElementById("createForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}
// --- Khởi tạo dữ liệu ---
// Prim.js (FULL) - includes add/remove node & edge + Prim algorithm + animation

// ----------------- initial data -----------------
let nodes = [
  { id: "a" },
  { id: "b" },
  { id: "c" },
  { id: "d" },
  { id: "e" },
  { id: "f" },
  { id: "g" },
  { id: "h" },
];

let links = [
  { source: "a", target: "b", weight: 42, id: "a-b" },
  { source: "a", target: "c", weight: 4, id: "a-c" },
  { source: "a", target: "d", weight: 10, id: "a-d" },
  { source: "b", target: "e", weight: 14, id: "b-e" },
  { source: "b", target: "f", weight: 3, id: "b-f" },
  { source: "c", target: "d", weight: 3, id: "c-d" },
  { source: "c", target: "g", weight: 15, id: "c-g" },
  { source: "d", target: "e", weight: 1, id: "d-e" },
  { source: "d", target: "g", weight: 15, id: "d-g" },
  { source: "d", target: "h", weight: 20, id: "d-h" },
  { source: "e", target: "f", weight: 11, id: "e-f" },
  { source: "g", target: "h", weight: 7, id: "g-h" },
  { source: "f", target: "h", weight: 9, id: "f-h" },
];

// ----------------- svg & simulation -----------------
const svg = d3.select("#graph");
const viewBox = svg.attr("viewBox").split(" ");
const width = +viewBox[2];
const height = +viewBox[3];

let simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3
      .forceLink()
      .id((d) => d.id)
      .distance(100)
  )
  .force("charge", d3.forceManyBody().strength(-400))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collide", d3.forceCollide().radius(40))
  .force("x", d3.forceX(width / 2).strength(0.05))
  .force("y", d3.forceY(height / 2).strength(0.05));

let linkGroup = svg.append("g").attr("class", "links");
let nodeGroup = svg.append("g").attr("class", "nodes");
let labelGroup = svg.append("g").attr("class", "labels");
let weightGroup = svg.append("g").attr("class", "weights");

// ----------------- prim animation state -----------------
let primSteps = []; // recorded actions for Prim animation
let primTimer = null;
let primIndex = 0;
let running = false;

// ----------------- helpers -----------------
function getEndpoints(link) {
  // returns { s: 'a', t: 'b' } independent of whether link.source is object or string
  const s = link.source && link.source.id ? link.source.id : link.source;
  const t = link.target && link.target.id ? link.target.id : link.target;
  return { s, t };
}

function ensureLinkIds() {
  links.forEach((l) => {
    const { s, t } = getEndpoints(l);
    if (!l.id) l.id = `${s}-${t}`;
  });
}

// ----------------- render / restart -----------------
function restart() {
  ensureLinkIds();

  // LINKS
  const link = linkGroup.selectAll("line").data(links, (d) => d.id);
  link.exit().remove();
  const linkEnter = link
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-width", 2)
    .attr("id", (d) => "edge-" + d.id)
    .style("cursor", "pointer");
  // merge not necessary for static styling here

  // add weight labels
  const wlabel = weightGroup.selectAll("text").data(links, (d) => d.id);
  wlabel.exit().remove();
  const wEnter = wlabel
    .enter()
    .append("text")
    .attr("class", "weight")
    .attr("fill", "#fff")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .text((d) => d.weight);
  wlabel.merge(wEnter).text((d) => d.weight);

  // NODES
  const node = nodeGroup.selectAll("circle").data(nodes, (d) => d.id);
  node.exit().remove();
  const nodeEnter = node
    .enter()
    .append("circle")
    .attr("r", 20)
    .attr("fill", "black")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("id", (d) => "node-" + d.id)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  // labels
  const label = labelGroup.selectAll("text").data(nodes, (d) => d.id);
  label.exit().remove();
  const labelEnter = label
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("fill", "white")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text((d) => d.id.toUpperCase());

  // update simulation
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();

  // on tick
  simulation.on("tick", () => {
    linkGroup
      .selectAll("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nodeGroup
      .selectAll("circle")
      .attr("cx", (d) => {
        d.x = Math.max(20, Math.min(width - 20, d.x)); // giữ trong khung
        return d.x;
      })
      .attr("cy", (d) => {
        d.y = Math.max(20, Math.min(height - 20, d.y));
        return d.y;
      });

    labelGroup
      .selectAll("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);

    weightGroup
      .selectAll("text")
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);
  });
}

// initial render
restart();

// ----------------- UI functions -----------------
function showCreate() {
  let form = document.getElementById("createForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// normalize IDs (case-insensitive handling)
function normId(raw) {
  return raw ? raw.trim().toLowerCase() : "";
}

// Add node
function addNode() {
  let idRaw = document.getElementById("nodeName").value;
  const id = normId(idRaw);
  if (!id) {
    alert("Nhập tên node");
    return;
  }
  if (nodes.find((n) => n.id === id)) {
    alert("Node đã tồn tại");
    return;
  }

  const newNode = {
    id: id,
    x: width / 2,
    y: height / 2,
  };
  nodes.push(newNode);
  restart();

  document.getElementById("nodeName").value = ""; // clear input
}

// Remove node (and incident edges)
function removeNode() {
  const id = normId(document.getElementById("nodeName").value);
  if (!id) {
    alert("Nhập tên node để xóa");
    return;
  }
  const idx = nodes.findIndex((n) => n.id === id);
  if (idx === -1) {
    alert("Node không tồn tại");
    return;
  }

  // remove node
  nodes.splice(idx, 1);
  // remove incident links (handle source/target as object or string)
  links = links.filter((l) => {
    const { s, t } = getEndpoints(l);
    return s !== id && t !== id;
  });
  restart();
  document.getElementById("nodeName").value = "";
}

// Add edge (source target weight) with validations described
function addEdge() {
  const srcRaw = document.getElementById("fromNode").value;
  const tgtRaw = document.getElementById("toNode").value;
  const wRaw = document.getElementById("edgeValue").value;

  const src = normId(srcRaw);
  const tgt = normId(tgtRaw);
  const wTrim = wRaw ? wRaw.trim() : "";

  if (!src || !tgt) {
    alert("Nhập source và target");
    return;
  }
  if (src === tgt) {
    alert("Không thể nối chính nó");
    return;
  }
  if (!nodes.find((n) => n.id === src) || !nodes.find((n) => n.id === tgt)) {
    alert("Source/Target phải tồn tại");
    return;
  }

  // find existing edge (either orientation)
  const existing = links.find((l) => {
    const { s, t } = getEndpoints(l);
    return (s === src && t === tgt) || (s === tgt && t === src);
  });

  // if existing
  if (existing) {
    // if user has typed a value, ensure it's numeric (digits only)
    if (wTrim !== "") {
      if (!/^[0-9]+$/.test(wTrim)) {
        alert("Nhập đúng giá trị là số (số nguyên dương)");
        return;
      }
      const newW = Number(wTrim);
      const ok = confirm(
        `Cạnh ${existing.id} đã tồn tại. Bạn muốn thay đổi trọng số từ ${existing.weight} → ${newW}?`
      );
      if (ok) {
        existing.weight = newW;
        restart();
      } else {
        alert("Cạnh giữ nguyên trọng số.");
      }
    } else {
      alert("Cạnh đã tồn tại (nếu muốn thay đổi trọng số, hãy nhập Value rồi Add).");
    }
    return;
  }

  // not existing -> add; validate weight if provided, else default 1
  let weight = 1;
  if (wTrim !== "") {
    if (!/^[0-9]+$/.test(wTrim)) {
      alert("Nhập đúng giá trị là số (số nguyên dương)");
      return;
    }
    weight = Number(wTrim);
  }

  const newId = `${src}-${tgt}`;
  links.push({ source: src, target: tgt, weight: weight, id: newId });
  restart();

  document.getElementById("fromNode").value = "";
  document.getElementById("toNode").value = "";
  document.getElementById("edgeValue").value = "";
}

// Remove edge (by from-to or to-from)
function removeEdge() {
  const srcRaw = document.getElementById("fromNode").value;
  const tgtRaw = document.getElementById("toNode").value;
  const src = normId(srcRaw);
  const tgt = normId(tgtRaw);

  if (!src || !tgt) {
    alert("Nhập source và target để xóa cạnh");
    return;
  }

  // find index by endpoints (either orientation)
  const idx = links.findIndex((l) => {
    const { s, t } = getEndpoints(l);
    return (s === src && t === tgt) || (s === tgt && t === src);
  });

  if (idx === -1) {
    alert("Edge không tồn tại");
    return;
  }

  links.splice(idx, 1);
  restart();

  document.getElementById("fromNode").value = "";
  document.getElementById("toNode").value = "";
}

// ----------------- graph controls -----------------
function resetGraph() {
  nodes = [
    { id: "a" },
    { id: "b" },
    { id: "c" },
    { id: "d" },
    { id: "e" },
    { id: "f" },
    { id: "g" },
    { id: "h" },
  ];
  links = [
    { source: "a", target: "b", weight: 42, id: "a-b" },
    { source: "a", target: "c", weight: 4, id: "a-c" },
    { source: "a", target: "d", weight: 10, id: "a-d" },
    { source: "b", target: "e", weight: 14, id: "b-e" },
    { source: "b", target: "f", weight: 3, id: "b-f" },
    { source: "c", target: "d", weight: 3, id: "c-d" },
    { source: "c", target: "g", weight: 15, id: "c-g" },
    { source: "d", target: "e", weight: 1, id: "d-e" },
    { source: "d", target: "g", weight: 15, id: "d-g" },
    { source: "d", target: "h", weight: 20, id: "d-h" },
    { source: "e", target: "f", weight: 11, id: "e-f" },
    { source: "g", target: "h", weight: 7, id: "g-h" },
    { source: "f", target: "h", weight: 9, id: "f-h" },
  ];
  stopPrim();
  restart();
  resetStyles();
}

function randomGraph() {
  stopPrim();
  const N = 8;
  const extraEdges = 6;
  const letters = "abcdefghijklmnopqrstuvwxyz";
  nodes = [];
  links = [];
  for (let i = 0; i < N; i++) {
    nodes.push({
      id: letters[i],
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
    });
  }
  let available = nodes.map((n) => n.id);
  let connected = [available.shift()];
  while (available.length) {
    const a = connected[Math.floor(Math.random() * connected.length)];
    const idx = Math.floor(Math.random() * available.length);
    const b = available.splice(idx, 1)[0];
    const w = Math.floor(Math.random() * 20) + 1;
    links.push({ source: a, target: b, weight: w, id: `${a}-${b}` });
    connected.push(b);
  }

  for (let k = 0; k < extraEdges; k++) {
    const i = Math.floor(Math.random() * N);
    let j = Math.floor(Math.random() * N);
    if (i === j) continue;
    const a = nodes[i].id,
      b = nodes[j].id;
    const id = `${a}-${b}`;
    if (links.find((l) => l.id === id || l.id === `${b}-${a}`)) continue;
    const w = Math.floor(Math.random() * 20) + 1;
    links.push({ source: a, target: b, weight: w, id: id });
  }

  restart();
  resetStyles();
  // small delay then run Prim so simulation can settle
  setTimeout(() => {
    runPrim();
  }, 500);
}

// ----------------- Prim implementation & animation -----------------

function buildAdj() {
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  links.forEach((l) => {
    const { s, t } = getEndpoints(l);
    adj[s].push({ to: t, weight: +l.weight, id: l.id });
    adj[t].push({ to: s, weight: +l.weight, id: l.id });
  });
  return adj;
}

function runPrim() {
  stopPrim();
  primSteps = [];
  primIndex = 0;

  if (nodes.length === 0) return;

  const adj = buildAdj();
  const start = nodes[0].id;
  const inMST = new Set([start]);
  let edgesHeap = [];
  adj[start].forEach((e) =>
    edgesHeap.push({ weight: e.weight, u: start, v: e.to, id: e.id })
  );
  primSteps.push({ type: "nodeAdd", node: start });

  function pushEdge(e) {
    primSteps.push({
      type: "considerEdge",
      edgeId: e.id,
      from: e.u,
      to: e.v,
      weight: e.weight,
    });
    edgesHeap.push(e);
  }

  while (edgesHeap.length > 0) {
    edgesHeap.sort((a, b) => a.weight - b.weight);
    const e = edgesHeap.shift();
    if (inMST.has(e.v) && inMST.has(e.u)) continue;
    const newNode = inMST.has(e.u) ? e.v : e.u;
    primSteps.push({
      type: "selectEdge",
      edgeId: e.id,
      from: e.u,
      to: e.v,
      weight: e.weight,
      newNode: newNode,
    });
    primSteps.push({ type: "nodeAdd", node: newNode });
    inMST.add(newNode);
    adj[newNode].forEach((x) => {
      if (!inMST.has(x.to)) {
        edgesHeap.push({ weight: x.weight, u: newNode, v: x.to, id: x.id });
        primSteps.push({
          type: "considerEdge",
          edgeId: x.id,
          from: newNode,
          to: x.to,
          weight: x.weight,
        });
      }
    });
  }

  playPrimSteps();
}

// reset styles on nodes/edges
function resetStyles() {
  nodeGroup.selectAll("circle").attr("r", 20).attr("fill", "black");
  linkGroup.selectAll("line").attr("stroke", "#999").attr("stroke-width", 2);
}

// play/pause/stop helpers
function playPrimSteps() {
  if (!primSteps || primSteps.length === 0) return;
  running = true;
  primIndex = 0;
  resetStyles();
  stepPrim();
}

function stepPrim() {
  if (!running) return;
  if (primIndex >= primSteps.length) {
    running = false;
    return;
  }
  const speedVal = +document.getElementById("speed")?.value || 3;
  const base = 700;
  const duration = Math.max(120, Math.round(base / speedVal));

  const act = primSteps[primIndex++];

  if (act.type === "considerEdge") {
    linkGroup
      .selectAll("line")
      .filter((d) => d.id === act.edgeId)
      .transition()
      .duration(duration / 2)
      .attr("stroke", "#ff8c00")
      .attr("stroke-width", 3);

    primTimer = setTimeout(() => {
      linkGroup
        .selectAll("line")
        .filter((d) => d.id === act.edgeId)
        .transition()
        .duration(200)
        .attr("stroke", function (d) {
          const cur = d3.select(this).attr("stroke");
          return cur === "#2e7d32" ? "#2e7d32" : "#999";
        })
        .attr("stroke-width", 2);
      stepPrim();
    }, duration);
    return;
  } else if (act.type === "selectEdge") {
    linkGroup
      .selectAll("line")
      .filter((d) => d.id === act.edgeId)
      .transition()
      .duration(duration / 2)
      .attr("stroke", "#2e7d32")
      .attr("stroke-width", 4);

    nodeGroup
      .selectAll("circle")
      .filter((d) => d.id === act.from || d.id === act.to)
      .transition()
      .duration(duration / 2)
      .attr("r", function (d) {
        const cur = +d3.select(this).attr("r") || 20;
        return Math.max(cur, 30);
      })
      .attr("fill", function (d) {
        return d3.select(this).attr("fill") || "black";
      });

    primTimer = setTimeout(() => {
      stepPrim();
    }, duration);
    return;
  } else if (act.type === "nodeAdd") {
    const nid = act.node;
    const circle = nodeGroup.selectAll("circle").filter((d) => d.id === nid);
    circle
      .transition()
      .duration(duration / 2)
      .attr("r", 36)
      .attr("fill", "red")
      .transition()
      .duration(duration / 2)
      .attr("r", function () {
        const nodeId = d3.select(this).attr("id").replace("node-", "");
        const connectedSelected = links.some((l) => {
          if (!l.id) return false;
          const { s, t } = getEndpoints(l);
          if (s === nodeId || t === nodeId) {
            const stroke = linkGroup.selectAll("line").filter((d) => d.id === l.id).attr("stroke");
            return stroke === "#2e7d32";
          }
          return false;
        });
        return connectedSelected ? 30 : 20;
      })
      .attr("fill", function () {
        const nodeId = d3.select(this).attr("id").replace("node-", "");
        const connectedSelected = links.some((l) => {
          if (!l.id) return false;
          const { s, t } = getEndpoints(l);
          if (s === nodeId || t === nodeId) {
            const stroke = linkGroup.selectAll("line").filter((d) => d.id === l.id).attr("stroke");
            return stroke === "#2e7d32";
          }
          return false;
        });
        return connectedSelected ? "black" : "black";
      })
      .on("end", () => {
        stepPrim();
      });
    return;
  }

  primTimer = setTimeout(stepPrim, duration);
}

function stopPrim() {
  running = false;
  if (primTimer) {
    clearTimeout(primTimer);
    primTimer = null;
  }
  primSteps = [];
  primIndex = 0;
}

// play/pause API used by buttons
function play() {
  if (running) return;
  if (!primSteps || primSteps.length === 0) {
    runPrim();
    return;
  }
  running = true;
  stepPrim();
}

function pause() {
  running = false;
  if (primTimer) {
    clearTimeout(primTimer);
    primTimer = null;
  }
}

// navigation placeholders
function prevStep() {
  pause();
  alert("Prev step: feature not implemented (use pause/play).");
}
function nextStep() {
  if (!running && primSteps && primSteps.length > 0 && primIndex < primSteps.length) {
    running = true;
    stepPrim();
    running = false;
  } else {
    alert("Next step: press play to run or randomGraph to generate + run.");
  }
}

// ----------------- drag handlers -----------------
function dragstarted(event, d) {
  if (d._fixed) return;
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  if (d._fixed) return;
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (d._fixed) return;
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// ----------------- expose functions globally -----------------
window.addNode = addNode;
window.removeNode = removeNode;
window.addEdge = addEdge;
window.removeEdge = removeEdge;
window.resetGraph = resetGraph;
window.randomGraph = randomGraph;
window.play = play;
window.pause = pause;
window.prevStep = prevStep;
window.nextStep = nextStep;
window.runPrim = runPrim;
