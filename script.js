const STORAGE_KEY = "gearup_activities_v1";
const STORAGE_OBS = "gearup_observacoes_v1";

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxLdf3DA9wwvcIZFht7hNUAna75AojSkFWE3UI0o-TSrkYy3zjJWqWKCB0vzV2uWCx8Nw/exec";

const statusLabel = {
  pendente: "Pendente",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

function uid(){
  return String(Date.now()) + "_" + Math.random().toString(16).slice(2);
}

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    const parsed = JSON.parse(raw);
    if(!Array.isArray(parsed)) return [];
    return parsed;
  }catch{
    return [];
  }
}

function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadObs(){
  return localStorage.getItem(STORAGE_OBS) || "";
}
function saveObs(text){
  localStorage.setItem(STORAGE_OBS, text || "");
}

let data = loadData();

/* ===============================
   ENVIO PARA GOOGLE SHEETS
================================= */
function enviarParaPlanilha(dados){

  fetch(WEBAPP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  })
  .then(res => res.json())
  .then(resp => {
    console.log("✅ Enviado para planilha:", resp);
  })
  .catch(err => {
    console.error("❌ Erro ao enviar:", err);
  });

}

/* ===============================
   FORMULÁRIO
================================= */

const elForm = document.getElementById("form");

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

function onSubmit(e){
  e.preventDefault();

  const payload = {
    id: editingId || uid(),
    data: f.data.value || "",
    equipe: (f.equipe.value || "").trim(),
    integrantes: (f.integrantes.value || "").trim(),
    subestacao: (f.subestacao.value || "").trim(),
    alimentador: (f.alimentador.value || "").trim(),
    equipamento: (f.equipamento.value || "").trim(),
    atividadeProgramada: (f.atividadeProgramada.value || "").trim(),
    horarioPrevisto: (f.horarioPrevisto.value || "").trim(),
    observacao: (f.observacao.value || "").trim(),
    status: f.status.value || "pendente",
  };

  if(!payload.equipe){
    alert("Informe a equipe.");
    return;
  }

  if(editingId){
    data = data.map(d => d.id === editingId ? payload : d);
  }else{
    data = [payload, ...data];
  }

  // Salva local
  saveData(data);

  // Envia para planilha online
  enviarParaPlanilha(payload);

  alert("Atividade salva com sucesso!");

  elForm.reset();
}

elForm.addEventListener("submit", onSubmit);

/* ===============================
   OBSERVAÇÕES
================================= */

const elObs = document.getElementById("observacoes");
if(elObs){
  elObs.value = loadObs();
  elObs.addEventListener("input", () => saveObs(elObs.value));
}
