# ClaraInveste

Web app (PT) que compara taxas de poupança em Portugal, brutas e líquidas.
Funciona no navegador e pode ser instalada no telemóvel.

**Abrir:** https://mariaclaraes11.github.io/Investments-App/

## Pôr online (GitHub Pages)
Settings › Pages › Source: *Deploy from a branch* › `main` / `(root)` › Save.

## Instalar no telemóvel
- iPhone (Safari): Partilhar › Adicionar ao ecrã principal
- Android (Chrome): ⋮ › Instalar app

## Ficheiros
- `index.html`, `app.js`, `styles.css`: a app
- `manifest.webmanifest`, `sw.js`, `icons/`: instalação e uso sem rede
- `vendor/`: Preact + htm e ícones Phosphor (sem dependências externas)
- `design/`: o design original do Claude Design

Ao atualizar a app, sobe a versão em `sw.js` (`clarainveste-v1` → `v2`).
