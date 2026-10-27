const form = document.getElementById("recruitment-form");
const birthdate = document.getElementById("birthdate");
const ageResult = document.getElementById("age-result");
const toast = document.getElementById("success-toast");
const successMessage = document.getElementById("success-message");
const closeToast = document.getElementById("close-toast");

// Impede datas futuras e define uma data mínima razoável.
const today = new Date();
const todayLocal = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
birthdate.max = todayLocal;

function calculateAge(dateString) {
  if (!dateString) return null;
  const birth = new Date(`${dateString}T12:00:00`);
  const now = new Date();
  if (Number.isNaN(birth.getTime()) || birth > now) return null;
  let age = now.getFullYear() - birth.getFullYear();
  const birthdayHasPassed = now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!birthdayHasPassed) age--;
  return age >= 0 ? age : null;
}

birthdate.addEventListener("input", () => {
  if (!birthdate.value) {
    ageResult.textContent = "Sua idade aparecerá aqui.";
    return;
  }
  const age = calculateAge(birthdate.value);
  ageResult.textContent = age === null
    ? "Confira a data informada."
    : `Você tem ${age} ${age === 1 ? "ano" : "anos"}.`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const age = calculateAge(String(data.get("birthdate") || ""));
  if (age === null) {
    ageResult.textContent = "Informe uma data de nascimento válida.";
    birthdate.focus();
    return;
  }

  // Este modelo funciona localmente: não transmite os dados para um servidor.
  successMessage.textContent = `Obrigado, ${name}! Sua ficha foi preenchida. Fique atento no Portal-Alta-Valley pra saber data das entrevistas.`;
  toast.classList.add("show");
  toast.scrollIntoView({ behavior: "smooth", block: "nearest" });
  form.reset();
  ageResult.textContent = "Sua idade aparecerá aqui.";
});

closeToast.addEventListener("click", () => toast.classList.remove("show"));
