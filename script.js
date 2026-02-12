const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxh6ZfELVdsuxmKZeiKphjSEyzQC3sW-wBG06d8aAFo/dev";

const statusLabel = {
  pendente: "Pendente",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

function uid(){
  return String(Date.now()) + "_" + Math.random().toString(16).slice(2);
}

let data = [];

const elTbody = document.getElementById("tbody");
const elBtnAdd = document.getElementById("btnAdd");
const elModal = document.getElementById("modal");
const elForm = document.getElementById("form");
const elModalTitle = document.getElementById("modalTitle");

const f = {
  data: document.getElementById("f_data"),
  equipe: document.getElementById("f_equipe"),
  integrantes: document.getElementById("f_integrantes"),
  subestacao: document.getElementById("f_subestacao"),
  alimentador: document.getElementById("f_alimentador"),
  equipamento: document.getElementById("f_equipamento"),
  atividadeProgramada: document.getElementById("f_atividadeProgramada"),
  horarioPrevisto: document.getElementById("f_horarioPrevisto"),
  observacao: document.getElementById("f_observacao"),
  status: document.getElementById("f_status"),
};

let editingId = null;

function badge(status){
  return `<span class="badge ${status}">${statusLabel[status] || status}</span>`;
}

function renderTable(){
  elTbody.innerHTML = data.map(entry => `
    <tr>
      <td>${entry.data}</td>
      <td><b>${entry.equipe}</b></td>
      <td>${entry.integrantes}</td>
      <td>${entry.subestacao}</td>
      <td>${entry.alimentador}</td>
      <td>${entry.equipamento}</td>
      <td>${entry.atividadeProgramada}</td>
      <td>${entry.horarioPrevisto}</td>
      <td>${entry.observacao}</td>
      <td>${badge(entry.status)}</td>
    </tr>
  `).join("");
}

function openModal(){
  elModal.classList.remove("hidden");
}

function closeModal(){
  elModal.classList.add("hidden");
  editingId = null;
  elForm.reset();
}

function openNew(){
  editingId = null;
  elModalTitle.textContent = "Nova Atividade";
  openModal();
}

function onSubmit(e){
  e.preventDefault();

  const payload = {
    id: editingId || uid(),
    data: f.data.value,
    equipe: f.equipe.value,
    integrantes: f.integrantes.value,
    subestacao: f.subestacao.value,
    alimentador: f.alimentador.value,
    equipamento: f.equipamento.value,
    atividadeProgramada: f.atividadeProgramada.value,
    horarioPrevisto: f.horarioPrevisto.value,
    observacao: f.observacao.value,
    status: f.status.value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(() => {
    alert("Salvo na planilha com sucesso!");
    data.unshift(payload);
    renderTable();
    closeModal();
  })
  .catch(err => {
    alert("Erro ao salvar!");
    console.error(err);
  });
}

/* Eventos */
elBtnAdd.addEventListener("click", openNew);
elForm.addEventListener("submit", onSubmit);

elModal.addEventListener("click", (e) => {
  if(e.target.getAttribute("data-close")){
    closeModal();
  }
});
