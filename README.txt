# Alta Repair Valley — formulário conectado ao Discord (Netlify)

## O que foi preparado
- Mantém o visual e os campos existentes do formulário.
- Envia a candidatura para uma Netlify Function, que encaminha os dados ao canal configurado no webhook do Discord.
- O navegador envia apenas a idade calculada; a data de nascimento real não é enviada ao Discord.
- Inclui validação básica e um campo-isca simples contra spam.

## Passo 1 — Configurar o segredo do Discord na Netlify
1. Entre no painel da Netlify e abra o site publicado.
2. Acesse **Site configuration** (ou **Project configuration**) → **Environment variables**.
3. Crie uma variável:
   - **Key / Nome:** `DISCORD_WEBHOOK_URL`
   - **Value / Valor:** cole a URL do webhook do Discord.
4. Salve. **Não** coloque essa URL no `index.html`, no `script.js`, no GitHub público nem neste ZIP.

Se a URL do webhook já foi compartilhada em algum lugar público, apague esse webhook no Discord e crie outro.

## Passo 2 — Publicar a versão atualizada
1. Extraia o ZIP no computador.
2. Na Netlify, abra o site e vá para a área de deploy manual (geralmente **Deploys**).
3. Arraste a pasta `alta_repair_formulario` extraída para a área de deploy manual, se o painel oferecer essa opção. Se a Netlify pedir uma pasta de publicação, envie o conteúdo da pasta `alta_repair_formulario` — incluindo `index.html`, `style.css`, `script.js`, `netlify.toml` e a pasta `netlify`.
4. Depois do deploy, abra o endereço `https://seu-site.netlify.app` e teste o formulário.

**Importante:** a pasta `netlify/functions/submit.js` e o arquivo `netlify.toml` precisam fazer parte do deploy. Se o método de deploy manual que você estiver usando não processar funções, conecte um repositório Git à Netlify ou use a CLI da Netlify para publicar o projeto. Sem a função ativa, o formulário não conseguirá enviar os dados.

## Passo 3 — Testar
Preencha o formulário com dados de teste e envie. A mensagem deve aparecer no canal associado ao webhook. Se houver erro, confira os logs da função em **Functions** na Netlify e confirme que a variável `DISCORD_WEBHOOK_URL` foi salva para o contexto de deploy correto. Após alterar variáveis de ambiente, faça um novo deploy.

## Dados encaminhados ao Discord
- Nome no jogo
- Idade calculada
- Experiência como mecânico no RP
- Período disponível para entrevista

A data de nascimento real não é enviada ao Discord. Limite o acesso ao canal de recrutamento apenas à liderança responsável e evite pedir informações pessoais desnecessárias.
