document.addEventListener("DOMContentLoaded", function(){

const STORAGE_KEY = "gearup_activities_v1";
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxLdf3DA9wwvcIZFht7hNUAna75AojSkFWE3UI0o-TSrkYy3zjJWqWKCB0vzV2uWCx8Nw/exec";

const form = document.getElementById("form");
const tabela = document.getElementById("tabela-body");

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* =========================
   GERAR ID
========================= */
function uid(){
  return Date.now().toString();
}

/* =========================
   SALVAR LOCAL
========================= */
function salvarLocal(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* =========================
   ENVIAR PARA PLANILHA
========================= */
function enviarParaPlanilha(dados){
  fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })
  .then(res => res.json())
  .then(r => console.log("Enviado:", r))
  .catch(err => console.error("Erro:", err));
}

/* =========================
   RENDER TABELA
========================= */
function render(){
  tabela.innerHTML = "";

  data.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.data}</td>
      <td>${item.equipe}</td>
      <td>${item.equipamento}</td>
      <td>${item.status}</td>
    `;

    tabela.appendChild(tr);
  });
}

/* =========================
   SUBMIT
========================= */
form.addEventListener("submit", function(e){
  e.preventDefault();

  const nova = {
    id: uid(),
    data: document.getElementById("f_data").value,
    equipe: document.getElementById("f_equipe").value,
    equipamento: document.getElementById("f_equipamento").value,
    status: document.getElementById("f_status").value
  };

  if(!nova.equipe){
    alert("Informe a equipe");
    return;
  }

  data.unshift(nova);

  salvarLocal();
  enviarParaPlanilha(nova);
  render();

  form.reset();
  alert("Atividade inserida com sucesso!");
});

/* =========================
   INICIALIZA
========================= */
render();

});
