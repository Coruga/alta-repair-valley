const form = document.getElementById("recruitment-form");
const birthdate = document.getElementById("birthdate");
const ageResult = document.getElementById("age-result");
const toast = document.getElementById("success-toast");
const successMessage = document.getElementById("success-message");
const closeToast = document.getElementById("close-toast");
const submitButton = form.querySelector(".submit-button");
const submitLabel = submitButton.querySelector("span");

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const age = calculateAge(String(data.get("birthdate") || ""));
  const experience = String(data.get("experience") || "");
  const availability = String(data.get("availability") || "");
  const website = String(data.get("website") || "");

  if (age === null) {
    ageResult.textContent = "Informe uma data de nascimento válida.";
    birthdate.focus();
    return;
  }

  submitButton.disabled = true;
  submitLabel.textContent = "ENVIANDO...";
  toast.classList.remove("show");

  try {
    const response = await fetch("/.netlify/functions/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        age,
        experience,
        availability,
        consent: document.getElementById("confirm-data").checked,
        website
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Não foi possível enviar sua ficha. Tente novamente.");
    }

    successMessage.textContent = `Obrigado, ${name}! Sua ficha foi enviada para a liderança da Alta Repair. Fique atento ao Portal-Alta-Valley para saber a data das entrevistas.`;
    toast.classList.add("show");
    toast.scrollIntoView({ behavior: "smooth", block: "nearest" });
    form.reset();
    ageResult.textContent = "Sua idade aparecerá aqui.";
  } catch (error) {
    successMessage.textContent = error.message || "Erro ao enviar. Tente novamente mais tarde.";
    toast.classList.add("show");
    toast.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = "ENVIAR FORMULÁRIO";
  }
});

closeToast.addEventListener("click", () => toast.classList.remove("show"));
