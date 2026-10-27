// Netlify Function: recebe a candidatura e envia para o Discord.
// Configure DISCORD_WEBHOOK_URL como variável de ambiente no painel da Netlify.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { "Allow": "POST" }, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Dados inválidos." }) };
  }

  // Campo-isca anti-spam: candidaturas reais deixam este campo vazio.
  if (body.website) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const age = Number(body.age);
  const experience = String(body.experience || "");
  const availability = String(body.availability || "");
  const consent = body.consent === true;

  if (!name || !Number.isInteger(age) || age < 0 || age > 120 ||
      !["Sim", "Não"].includes(experience) ||
      !["Manhã", "Tarde", "Noite"].includes(availability) || !consent) {
    return { statusCode: 400, body: JSON.stringify({ error: "Confira os campos obrigatórios." }) };
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("A variável DISCORD_WEBHOOK_URL não foi configurada.");
    return { statusCode: 500, body: JSON.stringify({ error: "O envio ainda não está configurado. Avise a liderança." }) };
  }

  const payload = {
    username: "Recrutamento | Alta Repair",
    allowed_mentions: { parse: [] },
    embeds: [{
      title: "🛠️ Nova ficha de recrutamento",
      color: 0x00D9FF,
      fields: [
        { name: "Nome no jogo (In-Game)", value: name, inline: false },
        { name: "Idade", value: String(age), inline: true },
        { name: "Experiência como mecânico no RP", value: experience, inline: true },
        { name: "Disponibilidade para entrevista", value: availability, inline: true }
      ],
      footer: { text: "Alta Repair Valley • GTA Roleplay" },
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.error("Discord webhook retornou status:", response.status);
      return { statusCode: 502, body: JSON.stringify({ error: "O Discord não aceitou o envio. Tente novamente mais tarde." }) };
    }
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error("Falha ao enviar candidatura para o Discord:", error);
    return { statusCode: 502, body: JSON.stringify({ error: "Não foi possível conectar ao Discord. Tente novamente." }) };
  }
};
