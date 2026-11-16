import { html, render, Component } from './vendor/htm-preact.mjs';

/* ───────────── Dados (16 nov 2026) ───────────── */
const INF = 3.8, SCALE = 5.5;
const pct = (n, d = 2) => n.toFixed(d).replace('.', ',') + '%';
const eur = n => (n < 0 ? '−' : '') + '€' + String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const P = [
  { id:'tr', name:'Trade Republic', product:'Conta à ordem remunerada', kind:'Corretora', mono:'TR', best:4.00, rateText:'4,00% / 2,50%', cap:'€20.000 a 4% (novos clientes); 2,50% acima, sem limite', pay:'Diário, pago mensalmente', tax:'Retido na fonte (IBAN PT)', promo:true, tag:'Novos clientes', checked:'16 nov 2026',
    notes:['Novos clientes desde 12 nov 2026: 4% TANB (4,07% TAE) até €20.000, até 1 mar 2027.','Acima de €20.000 e para clientes existentes: 2,50% (taxa de depósito do BCE).','Quem tinha a promo anterior de 3% passa para 2,50% a 27 nov 2026.','Clientes atuais podem ter 4% durante 2 meses por cada amigo convidado (máx. 4).','Parte do saldo vai para fundos monetários, que não têm a garantia de depósitos.','IBAN português (PT50); juros diários, pagos mensalmente, 28% retido na fonte.'] },
  { id:'t212', name:'Trading 212', product:'Cash remunerado', kind:'Corretora', mono:'T2', best:4.20, rateText:'4,20% (4 meses) / 2,50%', cap:'Até €100.000 · contas abertas até 30 nov 2026', pay:'Diário', tax:'Não retido — declarar no Anexo J', promo:true, tag:'Até 30 nov', checked:'16 nov 2026 (confirmar na app)',
    notes:['Contas novas abertas até 30 nov 2026: 4,20% durante 4 meses, até €100.000.','É preciso fazer o depósito mínimo e ativar os juros nos 10 dias seguintes à abertura.','Depois, e para contas antigas: 2,50%.','Entidade não portuguesa: os juros NÃO são retidos na fonte e têm de ser declarados (Anexo J).','O dinheiro fica em fundos monetários, sem a garantia de depósitos.'] },
  { id:'xtb', name:'XTB', product:'Juros sobre saldo não investido', kind:'Corretora', mono:'XT', best:4.50, rateText:'4,50% (90 dias) / 1,10%', cap:'€20.000 · contas abertas até 31 dez 2026', pay:'Diário, pago mensalmente', tax:'Retido na fonte', promo:true, tag:'90 dias', checked:'16 nov 2026',
    notes:['Boas-vindas de 4,50% nos primeiros 90 dias, até €20.000.','Condição: comprar ou vender pelo menos 1 ação ou ETF inteiro em cada mês. Frações, CFD e planos de investimento não contam. Mês sem ordem rende 1,10%.','Depois desce para 1,10%, a taxa de quem já tem conta.','Válido para contas abertas entre 14 out e 31 dez 2026, sem conta XTB nos últimos 12 meses.'] },
  { id:'revolut', name:'Revolut', product:'Cofres remunerados', kind:'Neobanco', mono:'RV', best:2.25, rateText:'1,50%–2,25%', cap:'Até €100.000', pay:'Diário', tax:'Retido na fonte (IBAN PT)', checked:'16 nov 2026',
    notes:['Por plano: Standard/Plus 1,50%, Premium 1,75%, Metal 2,00%, Ultra 2,25%.','Alguns sites mostram até 2,75% no Ultra; confirma na app.','Os planos pagos têm mensalidade, que come parte dos juros.','Depósitos cobertos pelo fundo de garantia de depósitos lituano.'] },
  { id:'bankinter', name:'Bankinter', product:'Conta Mais Ordenado / Online', kind:'Banco', mono:'BK', best:5.00, rateText:'5,00% → 2,00% / 3,00%', cap:'€10.000 (Mais Ordenado) · €100.000 (Online)', pay:'Mensal', tax:'Retido na fonte', salary:true, promo:true, tag:'Com ordenado', checked:'16 nov 2026',
    notes:['Conta Mais Ordenado: 5% no 1.º ano e 2% no 2.º, só sobre os primeiros €10.000.','Exige ordenado ou pensão de pelo menos €750 em 2 de cada 3 meses, cartão de crédito com 5 compras por período e não ter crédito à habitação no banco.','Conta Online: 3% nos primeiros 3 meses para novos clientes, depois 3% com ordenado ou 2,5% sem, até €100.000.'] },
  { id:'ctt', name:'Banco CTT', product:'Conta Poupança Livre', kind:'Banco', mono:'CT', best:3.00, rateText:'3,00% / 0,50%', cap:'€5.000', pay:'Trimestral', tax:'Retido na fonte', salary:true, tag:'Com ordenado', checked:'16 nov 2026',
    notes:['3% exige domiciliação de ordenado (mín. €800/mês) ou 3 débitos diretos ativos; sem isso, 0,50%.','Acima de €5.000 não rende. Máximo de €150 brutos por ano.','Movimentação livre, sem prazo.'] },
  { id:'activo', name:'ActivoBank', product:'PoupeUp Premium', kind:'Banco', mono:'AB', best:2.50, rateText:'2,50%', cap:'Até €20.000', pay:'Mensal', tax:'Retido na fonte', checked:'16 nov 2026 (dados de 11 out)',
    notes:['PoupeUp com Plano AB Premium: 2,50% até €20.000 (antes indicávamos 2,25%).','Exige o Plano AB Premium ativo na app. Aberta também a clientes atuais.','A campanha de 5% na Conta PoupeUp terminou em outubro.','Conta do grupo Millennium bcp.'] },
  { id:'openbank', name:'Openbank', product:'Poupança Boas-vindas', kind:'Banco', mono:'OB', best:2.50, rateText:'2,50% → 2,00% / 1,00%', cap:'Até €500.000', tax:'Retido na fonte', promo:true, tag:'6 meses', checked:'16 nov 2026',
    notes:['Exclusiva para novos clientes, 2,50% nos primeiros 6 meses.','Depois: 2,00% com ordenado ou transferência mensal de €700+, senão 1,00%.','Também tem depósito a prazo de 6 meses a 2,50% para novos clientes.'] },
  { id:'klarna', name:'Klarna', product:'Poupança a prazo fixo', kind:'Banco', mono:'KL', best:3.24, rateText:'2,42% (6m) · 2,95% (12m) · 3,15% (24m) · 3,24% (48m)', cap:'Desde €1', tax:'Não retido — declarar no Anexo J', tag:'Prazo', term:true, checked:'16 nov 2026',
    notes:['Taxa fixa garantida pelo prazo escolhido; o dinheiro fica preso até ao fim.','6 meses 2,42% (subiu de 2,15%), 12 meses 2,95%, 24 meses 3,15%, 36 meses 3,19%, 48 meses 3,24%.','Também tem Conta Flex a 2,20%, sem prazo.','Banco sueco: não retém imposto, tens de declarar os juros no IRS.'] },
  { id:'novobanco', name:'Novobanco', product:'DP Novos Recursos 12 meses', kind:'Banco', mono:'NB', best:3.00, rateText:'3,00%', cap:'€100 a €5.000 de dinheiro novo', tax:'Retido na fonte', tag:'Prazo', term:true, promo:true, checked:'16 nov 2026',
    notes:['Depósito a prazo de 12 meses só para dinheiro novo no banco (transferido nos 30 dias anteriores).','Montante entre €100 e €5.000. Só no site ou na app.','Para novos clientes há também um DP de 6 meses a 3,25%, a partir de €10.000.'] },
  { id:'montepio', name:'Banco Montepio', product:'Poupança Super', kind:'Banco', mono:'MP', best:2.25, rateText:'1,75%–2,25%', cap:'Varia por escalão', tax:'Retido na fonte',
    notes:['Estruturada em até 6 semestres; a taxa sobe por escalão atingido.','Saldos de conta à ordem rendem 0,00%.','Taxas do preçário de 14 set 2026.'] },
  { id:'millennium', name:'Millennium bcp', product:"Poupança Aforro / Let's GO!", kind:'Banco', mono:'MB', best:1.75, rateText:'0,10%–0,20% / ≤1,75%', cap:'€25–€100.000', tax:'Retido na fonte',
    notes:['Entre as taxas mais baixas dos grandes bancos portugueses.',"\"Let's GO!\" exige que o saldo cresça um valor definido em cada período.",'Prazo mínimo de 6 meses na Conta Poupança Aforro.'] },
  { id:'big', name:'Banco BiG', product:'Conta BiG Aforro', kind:'Banco', mono:'BG', best:1.50, rateText:'1,00% / 1,50%', cap:'1 levantamento grátis/ano, até €100.000', pay:'Diário, pago trimestralmente', tax:'Retido na fonte',
    notes:['1,00% base; sobe para 1,50% após 3 meses seguidos de reforços de €150+.','Levantamentos extra perdem os juros desse mês.'] },
  { id:'bigsd', name:'Banco BiG', product:'Super Depósito', kind:'Banco', mono:'BS', best:4.00, rateText:'4,00% (3m) · 3,50% (6m)', cap:'€5.000 a €50.000 (3m) · €10.000 a €50.000 (6m)', pay:'No fim do prazo', tax:'Retido na fonte', promo:true, term:true, tag:'Novos clientes', checked:'16 nov 2026',
    notes:['Depósito a prazo para novos clientes, nos primeiros 3 meses como cliente, com dinheiro vindo de outro banco.','3 meses a 4,00% (€5.000 a €50.000) ou 6 meses a 3,50% (€10.000 a €50.000).','Um por morada. Levantar antes do fim custa a maior parte dos juros.','Coberto pelo Fundo de Garantia de Depósitos até €100.000.'] },
  { id:'haitong', name:'Haitong Bank', product:'Depósito HB Sem Mobilização', kind:'Banco', mono:'HB', best:3.30, rateText:'3,05% (3m) · 3,20% (6m) · 3,25% (12m) · 3,30% (24m)', cap:'Sem mínimo', pay:'No fim do prazo', tax:'Retido na fonte', term:true, tag:'Prazo', checked:'16 nov 2026',
    notes:['Depósito a prazo aberto a todos, não só a novos clientes, e sem montante mínimo.','Não mobilizável: o dinheiro fica preso até ao fim e não aceita reforços.','Só por canais digitais (site ou app).','Há uma versão mobilizável a 3,20% (12 meses).','Coberto pelo Fundo de Garantia de Depósitos até €100.000.'] },
  { id:'caf', name:'Certificados de Aforro', product:'Série F', kind:'Estado', mono:'CA', best:2.50, rateText:'2,500%', cap:'Mínimo €5', pay:'Capitalizam', tax:'Retido na fonte', state:true, tag:'Estado', checked:'16 nov 2026',
    notes:['Taxa variável, indexada mensalmente à Euribor a 3 meses, com teto de 2,5% (no teto pelo 3.º mês seguido em novembro).','Prémio de permanência de +0,25% do 2.º ao 5.º ano.','Resgatável após 3 meses; os juros capitalizam.','Vendidos nos CTT e no Banco BiG.'] },
  { id:'ctp', name:'Certificados do Tesouro', product:'Série 5', kind:'Estado', mono:'TS', best:3.35, rateText:'2,35% → 3,35%', cap:'Mínimo €1.000', pay:'Cupão anual', tax:'Retido na fonte', state:true, tag:'Estado',
    notes:['Taxa fixa que sobe todos os anos, prazo de 10 anos (média ≈2,71%).','Sem capitalização: juros pagos em cupão anual.','Lançado em jul 2026, substitui a série CTPV.'] },
];
const byId = Object.fromEntries(P.map(p => [p.id, p]));

function gross(id, A, m, sal) {
  const y = m / 12, f = x => Math.min(m, x) / 12, r = x => Math.max(0, m - x) / 12;
  switch (id) {
    case 'tr': { const p = Math.min(m, 3.5) / 12; return Math.min(A, 20000) * (.04 * p + .025 * (y - p)) + Math.max(0, A - 20000) * .025 * y; }
    case 't212': return Math.min(A, 100000) * (.042 * f(4) + .025 * r(4));
    case 'xtb': return Math.min(A, 20000) * (.045 * f(3) + .011 * r(3)) + Math.max(0, A - 20000) * .011 * y;
    case 'openbank': return Math.min(A, 500000) * (.025 * f(6) + (sal ? .02 : .01) * r(6));
    case 'klarna': return A * (m < 12 ? .0242 : m < 24 ? .0295 : m < 36 ? .0315 : m < 48 ? .0319 : .0324) * y;
    case 'novobanco': return Math.min(A, 5000) * .03 * f(12);
    case 'revolut': return Math.min(A, 100000) * .015 * y;
    case 'bankinter': return sal ? Math.min(A, 10000) * (.05 * f(12) + .02 * (Math.min(m, 24) - Math.min(m, 12)) / 12) : Math.min(A, 100000) * (.03 * f(3) + .025 * r(3));
    case 'ctt': return Math.min(A, 5000) * (sal ? .03 : .005) * y;
    case 'activo': return Math.min(A, 20000) * .025 * y;
    case 'montepio': return A * .0175 * y;
    case 'millennium': return A * .002 * y;
    case 'big': return A * (.01 * f(3) + .015 * r(3));
    case 'bigsd': return A < 5000 ? 0 : m >= 6 && A >= 10000 ? Math.min(A, 50000) * .035 * .5 : Math.min(A, 50000) * .04 * f(3);
    case 'haitong': return A * (m < 6 ? .0305 : m < 12 ? .032 : m < 24 ? .0325 : .033) * y;
    case 'caf': return A * .025 * y;
    case 'ctp': return A * .0235 * y;
  }
  return 0;
}

const ALERTS = [
  { id:'a20261116a', icon:'ph-sparkle', title:'Novo: Banco BiG a 4%', body:'Super Depósito de 3 meses para novos clientes, de €5.000 a €50.000. Há também 6 meses a 3,50%.', when:'hoje', pid:'bigsd' },
  { id:'a20261116b', icon:'ph-sparkle', title:'Novo: Haitong Bank até 3,30%', body:'Depósito a prazo sem mínimo e aberto a todos: 3,25% a 12 meses, 3,30% a 24. O dinheiro fica preso.', when:'hoje', pid:'haitong' },
  { id:'a20261116c', icon:'ph-gift', title:'Trading 212: promo até 30 nov', body:'Corrigimos: os 4,20% durante 4 meses ainda valem para contas novas abertas até 30 nov, até €100.000.', when:'hoje', pid:'t212' },
  { id:'a20261116d', icon:'ph-trend-up', title:'Klarna sobe o prazo de 6 meses', body:'De 2,15% para 2,42%. O prazo de 48 meses paga 3,24%.', when:'hoje', pid:'klarna' },
  { id:'a20261116e', icon:'ph-warning-circle', title:'Bankinter: 5% só até €10.000', body:'A Conta Mais Ordenado só paga 5% sobre os primeiros €10.000. Acertámos as contas.', when:'hoje', pid:'bankinter' },
  { id:'a1', icon:'ph-rocket-launch', title:'Trade Republic sobe para 4%', body:'Novos clientes: 4% até €20.000, até 1 mar 2027. Acima disso e para clientes atuais, 2,50%.', when:'12 nov', pid:'tr' },
];
const PROMOS = [
  { pid:'bankinter', title:'Conta Mais Ordenado', rate:'5,00%', dur:'1.º ano, até €10.000, com ordenado', m:12, sal:true },
  { pid:'xtb', title:'Boas-vindas', rate:'4,50%', dur:'90 dias, até €20.000 · 1 ordem por mês · abrir até 31 dez', m:3 },
  { pid:'t212', title:'Cash remunerado', rate:'4,20%', dur:'4 meses, até €100.000 · abrir até 30 nov', m:4 },
  { pid:'bigsd', title:'Super Depósito', rate:'4,00%', dur:'Prazo de 3 meses, €5.000–€50.000', m:3 },
  { pid:'tr', title:'Conta remunerada', rate:'4,00%', dur:'Até €20.000, até 1 mar 2027', m:3.5 },
  { pid:'novobanco', title:'DP Novos Recursos', rate:'3,00%', dur:'Prazo de 12 meses, até €5.000', m:12 },
  { pid:'openbank', title:'Poupança Boas-vindas', rate:'2,50%', dur:'Primeiros 6 meses', m:6 },
  { pid:'activo', title:'Conta PoupeUp', rate:'5,00%', dur:'Campanha terminou em outubro', ended:true },
];
const PERKS = [
  { id:'irs', cat:'Impostos', icon:'ph-receipt', title:'IRS Jovem', sub:'Até 35 anos · 10 anos de benefício', chart:true,
    body:'Isenção parcial do IRS sobre rendimentos do trabalho nos primeiros 10 anos de atividade: 100% no 1.º ano, 75% do 2.º ao 4.º, 50% do 5.º ao 7.º e 25% do 8.º ao 10.º. Limite anual de 55 × IAS.' },
  { id:'gar', cat:'Casa', icon:'ph-house-line', title:'Garantia pública na 1.ª casa', sub:'18–35 anos · até 100% financiado',
    body:'O Estado garante até 15% do valor do imóvel, para que o banco possa financiar até 100%. Para habitação própria permanente até €450.000.' },
  { id:'imt', cat:'Casa', icon:'ph-stamp', title:'Isenção de IMT e Imposto do Selo', sub:'Até 35 anos · 1.ª habitação',
    body:'Na compra da primeira habitação própria permanente, isenção total de IMT e Imposto do Selo até ao 4.º escalão do IMT, e parcial acima disso.' },
  { id:'p65', cat:'Casa', icon:'ph-key', title:'Porta 65 Jovem', sub:'Apoio ao arrendamento',
    body:'Comparticipação mensal na renda para jovens até 35 anos. Candidaturas no Portal da Habitação.' },
  { id:'ppr', cat:'Poupança', icon:'ph-piggy-bank', title:'Dedução PPR', sub:'Até €400/ano no IRS',
    body:'Com menos de 35 anos, 20% do valor aplicado num PPR é deduzido à coleta, até €400 por ano. Há PPR de perfil conservador, com risco baixo.' },
  { id:'caf', cat:'Poupança', icon:'ph-shield-check', title:'Certificados de Aforro', sub:'A partir de €5',
    body:'Dívida pública vendida diretamente a aforradores. Série F a 2,50%, sem risco de banco.', link:'certs', linkLabel:'Ver certificados' },
];
const GLOSS = [
  ['TANB','Taxa Anual Nominal Bruta: o juro anual antes de impostos.'],
  ['Taxa líquida','A TANB depois da retenção de 28% (19,6% nos Açores e Madeira).'],
  ['Retenção na fonte','O banco desconta o imposto automaticamente antes de pagar os juros.'],
  ['Anexo J','Parte da declaração de IRS para rendimentos obtidos no estrangeiro, como juros de corretoras não portuguesas.'],
  ['Domiciliação de ordenado','Receber o salário nessa conta. Muitos bancos exigem-na para dar a melhor taxa.'],
  ['Taxa real','Taxa líquida menos inflação. Se for negativa, o dinheiro perde poder de compra.'],
  ['Fundo de Garantia de Depósitos','Protege depósitos até €100.000 por pessoa e por banco.'],
  ['Euribor','Taxa a que os bancos da zona euro emprestam entre si. Indexa os Certificados de Aforro.'],
  ['Capitalização','Os juros somam-se ao capital e passam também a render juros.'],
  ['Taxa de depósito do BCE','A taxa que o Banco Central Europeu paga aos bancos. Influencia as taxas das contas.'],
];
const LADDER = [
  ['Conta remunerada','liquidez total',12],['Depósito a prazo','dinheiro preso',22],['Certificados de Aforro','garantia do Estado',30],
  ['Certificados do Tesouro','Estado · 10 anos',40],['Obrigações do Tesouro','preço varia se vendes antes',55],['Fundos monetários','sem garantia de capital',68],['PPR conservador','regras de resgate',80],
];
const TABS = [['home','Início','ph-house'],['rates','Taxas','ph-chart-bar-horizontal'],['calc','Calcular','ph-calculator'],['jovem','Jovem','ph-student'],['learn','Aprender','ph-book-open']];
const TITLES = { alerts:'Alertas', promos:'Promoções', certs:'Certificados', detail:'Detalhe' };

/* Guarda preferências no telemóvel (se o navegador deixar). */
const SAVE_KEYS = ['watch','notify','read','salary','islands','amount','months'];
const load = () => { try { return JSON.parse(localStorage.getItem('clara-state') || '{}'); } catch { return {}; } };
const save = s => { try { localStorage.setItem('clara-state', JSON.stringify(Object.fromEntries(SAVE_KEYS.map(k => [k, s[k]])))); } catch {} };

/* ───────────── Pequenos componentes ───────────── */
const chipStyle = on => `border-color:${on ? '#000' : 'var(--color-divider)'};color:${on ? '#fff' : '#000'};background:${on ? '#000' : 'transparent'}`;
const Chip = ({ on, label, onClick }) => html`<button class="btn chip" aria-pressed=${on} style=${chipStyle(on)} onClick=${onClick}>${label}</button>`;
const Switch = ({ on }) => html`
  <span class="switch" style="background:${on ? '#000' : 'var(--color-neutral-900)'};border-color:${on ? '#000' : 'var(--color-neutral-700)'}">
    <span style="background:${on ? '#fff' : 'var(--color-neutral-500)'};transform:translateX(${on ? '16px' : '0px'})"></span>
  </span>`;
const Mono = ({ text, size = 34 }) => html`
  <div style="width:${size}px;height:${size}px;flex:none;border-radius:9px;background:var(--color-neutral-800);display:grid;place-items:center;font-size:12px;font-weight:600">${text}</div>`;
const IconTile = ({ icon, size = 34 }) => html`
  <div aria-hidden="true" style="width:${size}px;height:${size}px;flex:none;border-radius:10px;background:var(--color-accent-900);display:grid;place-items:center"><i class="ph ${icon}" style="font-size:${size / 2}px"></i></div>`;

/* ───────────── App ───────────── */
class App extends Component {
  constructor() {
    super();
    this.state = { tab:'home', view:null, detail:null, from:null, watch:['tr','bankinter','caf'], filter:'all', amount:10000, months:12, salary:true, islands:false, calcId:'tr',
      read:{}, notify:{ rates:true, promos:true, ending:true, weekly:true }, perkCat:'Todos', perkOpen:'irs', glossOpen:'TANB', ...load() };
    this.scrollEl = null;
  }
  componentDidUpdate(pp, ps) {
    const s = this.state;
    if (ps.tab !== s.tab || ps.view !== s.view || ps.detail !== s.detail) { if (this.scrollEl) this.scrollEl.scrollTop = 0; }
    save(s);
  }
  go = tab => this.setState({ tab, view:null });
  open = view => this.setState(s => ({ view, from: s.view }));
  openDetail = id => this.setState(s => ({ view:'detail', detail:id, from: s.view === 'detail' ? s.from : s.view }));
  net = g => g * (1 - (this.state.islands ? 0.196 : 0.28));

  render(_, s) {
    const screen = s.view || s.tab;
    const unread = ALERTS.filter((a, i) => i < 3 && !s.read[a.id]).length;
    const body = {
      home: this.home, rates: this.rates, calc: this.calc, jovem: this.jovem, learn: this.learn,
      alerts: this.alerts, promos: this.promos, certs: this.certs, detail: this.detailScreen,
    }[screen].call(this, s);

    return html`
      <div class="app">
        <div class="scroll" ref=${el => (this.scrollEl = el)}>
          ${!s.view ? html`
            <header style="display:flex;align-items:center;justify-content:space-between;padding:10px 18px 4px">
              <div style="display:flex;align-items:center;gap:8px">
                <div aria-hidden="true" style="width:28px;height:28px;border-radius:9px;background:#000;color:#fff;display:grid;place-items:center;font-size:15px;font-weight:600">C</div>
                <span style="font-size:17px;font-weight:600;letter-spacing:-0.02em">ClaraInveste</span>
              </div>
              <button onClick=${() => this.open('alerts')} class="btn btn-icon btn-secondary" style="position:relative;border-radius:50%" aria-label="Alertas${unread ? `, ${unread} novos` : ''}">
                <i class="ph ph-bell" style="font-size:19px"></i>
                ${unread > 0 && html`<span style="position:absolute;top:-2px;right:-2px;min-width:17px;height:17px;border-radius:9px;background:#000;color:#fff;font-size:10px;font-weight:600;display:grid;place-items:center">${unread}</span>`}
              </button>
            </header>` : html`
            <header style="display:flex;align-items:center;gap:6px;padding:10px 10px 4px">
              <button onClick=${() => this.setState(st => ({ view: st.from || null, from: null }))} class="btn btn-icon" aria-label="Voltar"><i class="ph ph-caret-left" style="font-size:20px"></i></button>
              <span style="font-size:15px;font-weight:500">${TITLES[s.view]}</span>
            </header>`}
          ${body}
        </div>
        <nav class="tabbar">
          ${TABS.map(([id, label, icon]) => { const on = !s.view && s.tab === id; return html`
            <button onClick=${() => this.go(id)} aria-current=${on ? 'page' : undefined} style="color:${on ? '#000' : 'var(--color-neutral-500)'};font-weight:${on ? 600 : 400}">
              <i class="${on ? 'ph-fill' : 'ph'} ${icon}" style="font-size:22px" aria-hidden="true"></i>${label}
            </button>`; })}
        </nav>
      </div>`;
  }

  /* Início */
  home(s) {
    const net = this.net;
    const netDots = P.map(p => { const n = net(p.best); return { name: p.name, left: Math.min(n / 4 * 100, 100), on: n > INF }; });
    const watchRows = s.watch.map(id => byId[id]).filter(Boolean);
    return html`
      <div class="screen" style="gap:22px">
        <div>
          <div class="small" style="font-size:12px">Semana 47 · 16–22 nov</div>
          <h2 style="margin-top:2px">O teu resumo</h2>
        </div>
        <button class="tap" onClick=${() => this.openDetail('tr')} style="padding:18px;border-radius:var(--radius-lg);background:var(--color-accent-900);box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:6px">
          <span class="card-kicker">Melhor taxa sem condições</span>
          <span style="display:flex;align-items:baseline;gap:10px">
            <span class="big" style="font-size:52px">4,00%</span>
            <span style="font-size:14px">2,88% líquido</span>
          </span>
          <span style="display:flex;justify-content:space-between;align-items:center;font-size:13px">
            <span>Trade Republic · novos clientes até €20.000</span><i class="ph ph-arrow-right" aria-hidden="true"></i>
          </span>
        </button>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="card elev-sm" style="gap:2px;padding:12px"><span class="small">Taxa de depósito BCE</span><span style="font-size:22px;font-weight:600">2,50%</span><span class="small">desde 16 set</span></div>
          <div class="card elev-sm" style="gap:2px;padding:12px"><span class="small">Inflação Portugal</span><span style="font-size:22px;font-weight:600">3,8%</span><span class="small">out 2026</span></div>
        </div>

        <section style="display:flex;flex-direction:column;gap:10px">
          <h6>Bate a inflação depois de impostos?</h6>
          <div class="card elev-sm" style="padding:16px 14px 12px;gap:12px">
            <div style="position:relative;height:44px" role="img" aria-label="Taxas líquidas das contas comparadas com a inflação de 3,8%">
              <div style="position:absolute;left:0;right:0;top:20px;height:4px;border-radius:2px;background:var(--color-neutral-800)"></div>
              <div style="position:absolute;left:95%;top:0;bottom:0;width:1px;background:#000"></div>
              <div style="position:absolute;left:95%;top:-2px;transform:translateX(-92%);font-size:10px;white-space:nowrap;background:#fff;padding:0 3px">inflação 3,8%</div>
              ${netDots.map(d => html`<div title=${d.name} style="position:absolute;top:16px;left:${d.left}%;width:12px;height:12px;margin-left:-6px;border-radius:50%;border:2px solid #fff;background:${d.on ? '#000' : 'var(--color-neutral-600)'}"></div>`)}
            </div>
            <div class="small" style="display:flex;justify-content:space-between;font-size:10px"><span>0%</span><span>1%</span><span>2%</span><span>3%</span><span>4%</span></div>
            <p style="font-size:13px">Nenhuma das ${P.length} contas que seguimos bate a inflação de 3,8% depois de impostos. A mais perto é a <b style="font-weight:600">Bankinter com ordenado</b> (3,60% líquido).</p>
          </div>
        </section>

        <section style="display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;justify-content:space-between;align-items:baseline"><h6>Ganha dinheiro a abrir conta</h6><button class="btn btn-ghost" onClick=${() => this.open('promos')} style="font-size:12px">Ver todas</button></div>
          <div class="hscroll">
            ${this.promoCards().map(p => html`
              <button class="tap" onClick=${p.open} style="flex:none;width:168px;padding:14px;border-radius:var(--radius-md);background:#fff;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:6px;opacity:${p.opacity}">
                <span style="font-size:12px;color:var(--color-neutral-300)">${p.name}</span>
                <span class="big" style="font-size:26px">${p.rate}</span>
                <span class="small" style="min-height:30px">${p.dur}</span>
                <span style="font-size:13px;font-weight:600">${p.estShort}</span>
              </button>`)}
          </div>
        </section>

        <section style="display:flex;flex-direction:column;gap:6px">
          <h6 style="margin-bottom:4px">O que mudou</h6>
          ${ALERTS.slice(0, 4).map(c => html`
            <div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0">
              <${IconTile} icon=${c.icon} />
              <div style="display:flex;flex-direction:column;gap:1px"><span style="font-size:14px;font-weight:500">${c.title}</span><span style="font-size:13px;color:var(--color-neutral-300);text-wrap:pretty">${c.body}</span></div>
            </div>`)}
        </section>

        <section style="display:flex;flex-direction:column;gap:6px">
          <h6 style="margin-bottom:4px">A seguir</h6>
          ${watchRows.map(p => html`
            <button class="tap" onClick=${() => this.openDetail(p.id)} style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--radius-md);background:#fff;box-shadow:var(--shadow-sm)">
              <${Mono} text=${p.mono} />
              <span style="flex:1;min-width:0;display:flex;flex-direction:column"><span style="font-size:14px">${p.name}</span><span class="small">${p.product}</span></span>
              <span style="text-align:right;display:flex;flex-direction:column"><span style="font-size:15px;font-weight:600">${pct(p.best)}</span><span class="small">${pct(net(p.best))} líq.</span></span>
            </button>`)}
          ${!watchRows.length && html`<p class="muted" style="font-size:13px">Ainda não segues nenhuma instituição. Abre uma em Taxas e toca em Seguir.</p>`}
        </section>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          <button onClick=${() => this.open('certs')} class="btn btn-secondary" style="flex-direction:column;gap:6px;padding:14px 6px;font-size:12px"><i class="ph ph-shield-check" style="font-size:22px" aria-hidden="true"></i>Certificados</button>
          <button onClick=${() => this.go('jovem')} class="btn btn-secondary" style="flex-direction:column;gap:6px;padding:14px 6px;font-size:12px"><i class="ph ph-student" style="font-size:22px" aria-hidden="true"></i>Menos de 35</button>
          <button onClick=${() => this.go('calc')} class="btn btn-secondary" style="flex-direction:column;gap:6px;padding:14px 6px;font-size:12px"><i class="ph ph-calculator" style="font-size:22px" aria-hidden="true"></i>Simular</button>
        </div>
        <p class="small">Dados atualizados a 16 nov 2026. Informativo, não é aconselhamento financeiro. Confirma sempre com a instituição.</p>
      </div>`;
  }

  promoCards() {
    return PROMOS.map(pr => {
      const p = byId[pr.pid]; const est = pr.ended ? null : this.net(gross(pr.pid, 10000, pr.m, pr.sal));
      return { name: p.name, title: pr.title, rate: pr.rate, dur: pr.dur, opacity: pr.ended ? .55 : 1, estShort: pr.ended ? 'Terminou' : '+' + eur(est) + ' líq.', open: () => this.openDetail(pr.pid) };
    });
  }

  /* Taxas */
  rates(s) {
    const net = this.net;
    const fl = { all: () => true, nocond: p => !p.salary, promo: p => p.promo, term: p => p.term, state: p => p.state }[s.filter];
    const rows = [...P].sort((a, b) => b.best - a.best).filter(fl);
    return html`
      <div class="screen" style="gap:14px">
        <h2>Taxas</h2>
        <div class="hscroll" style="gap:6px;padding-bottom:0">
          ${[['all','Todas'],['nocond','Sem domiciliação'],['promo','Promos'],['term','A prazo'],['state','Estado']].map(([id, label]) =>
            html`<${Chip} on=${s.filter === id} label=${label} onClick=${() => this.setState({ filter:id })} />`)}
        </div>
        <div style="display:flex;gap:14px;font-size:11px;color:var(--color-neutral-300)">
          <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:6px;border-radius:2px;background:#000"></span>Líquido</span>
          <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:6px;border-radius:2px;background:var(--color-accent-700)"></span>Imposto</span>
          <span style="display:flex;align-items:center;gap:5px"><span style="width:1px;height:10px;background:#000"></span>Inflação</span>
          <span style="display:flex;align-items:center;gap:5px"><span style="width:1px;height:10px;border-left:1px dashed var(--color-neutral-500)"></span>BCE</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${rows.map(p => { const n = net(p.best); return html`
            <button class="tap" onClick=${() => this.openDetail(p.id)} style="padding:12px;border-radius:var(--radius-md);background:#fff;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:9px;opacity:${p.ended ? .7 : 1}">
              <span style="display:flex;align-items:center;gap:10px;width:100%">
                <${Mono} text=${p.mono} />
                <span style="flex:1;min-width:0;display:flex;flex-direction:column">
                  <span style="font-size:14px;display:flex;gap:6px;align-items:center">${p.name}${p.tag && html`<span class="tag tag-accent" style="font-size:10px;padding:1px 6px">${p.tag}</span>`}</span>
                  <span class="small" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.product}</span>
                </span>
                <span style="display:grid;grid-template-columns:auto auto;gap:0 10px;text-align:right">
                  <span class="small" style="font-size:10px">bruto</span><span class="small" style="font-size:10px">líquido</span>
                  <span style="font-size:15px;font-weight:600">${pct(p.best)}</span><span style="font-size:15px">${pct(n)}</span>
                </span>
              </span>
              <span style="position:relative;height:6px;border-radius:3px;background:var(--color-neutral-900);display:block;width:100%">
                <span style="position:absolute;left:0;top:0;bottom:0;width:${p.best / SCALE * 100}%;border-radius:3px;background:var(--color-accent-700)"></span>
                <span style="position:absolute;left:0;top:0;bottom:0;width:${n / SCALE * 100}%;border-radius:3px;background:#000"></span>
                <span style="position:absolute;left:69.09%;top:-3px;bottom:-3px;width:1px;background:#000"></span>
                <span style="position:absolute;left:45.45%;top:-3px;bottom:-3px;border-left:1px dashed var(--color-neutral-500)"></span>
              </span>
            </button>`; })}
        </div>
        <p class="small">Taxa mais alta disponível. Líquido com retenção de ${s.islands ? '19,6%' : '28%'}. Escala 0–5,5%.</p>
      </div>`;
  }

  /* Calcular */
  calc(s) {
    const net = this.net;
    const cp = byId[s.calcId], g = gross(cp.id, s.amount, s.months, s.salary), n = net(g), infl = s.amount * INF / 100 * s.months / 12;
    const cmp = P.map(p => ({ p, v: net(gross(p.id, s.amount, s.months, s.salary)) })).sort((a, b) => b.v - a.v).slice(0, 7);
    const maxV = cmp[0].v || 1;
    const sorted = [...P].sort((a, b) => b.best - a.best);
    const note = n >= infl ? 'Ganhas à inflação neste período.' : `A inflação de 3,8% custa ${eur(infl)} no mesmo período, por isso perdes ${eur(infl - n)} de poder de compra.`;
    return html`
      <div class="screen" style="gap:18px">
        <h2>Simular ganhos</h2>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label for="amount" style="display:flex;justify-content:space-between;align-items:baseline"><span class="muted" style="font-size:12px">Quanto queres pôr</span><span style="font-size:24px;font-weight:600">${eur(s.amount)}</span></label>
          <input id="amount" type="range" min="500" max="60000" step="500" value=${s.amount} onInput=${e => this.setState({ amount: +e.target.value })} />
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <span class="muted" style="font-size:12px">Durante</span>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--color-divider);border-radius:var(--radius-md);overflow:hidden">
            ${[3, 6, 12, 24].map(m => { const on = s.months === m; return html`
              <button aria-pressed=${on} onClick=${() => this.setState({ months: m })} style="font:inherit;font-size:13px;padding:8px 0;border:0;cursor:pointer;color:${on ? '#fff' : '#000'};background:${on ? '#000' : 'transparent'}">${m} meses</button>`; })}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <span class="muted" style="font-size:12px">Onde</span>
          <div class="hscroll" style="gap:6px;padding-bottom:0">
            ${sorted.map(p => html`<${Chip} on=${p.id === s.calcId} label=${p.name} onClick=${() => this.setState({ calcId: p.id })} />`)}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:2px">
          ${[['salary','Tenho ordenado domiciliado'],['islands','Resido nos Açores ou Madeira (19,6%)']].map(([k, label]) => html`
            <button class="tap" role="switch" aria-checked=${s[k]} onClick=${() => this.setState(st => ({ [k]: !st[k] }))} style="display:flex;align-items:center;justify-content:space-between;padding:8px 0">
              <span style="font-size:14px">${label}</span><${Switch} on=${s[k]} />
            </button>`)}
        </div>

        <div style="padding:18px;border-radius:var(--radius-lg);background:var(--color-accent-900);box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:12px">
          <div class="card-kicker">${cp.name} · ${s.months} meses</div>
          <div style="display:flex;align-items:baseline;gap:8px"><span class="big" style="font-size:46px">${eur(n)}</span><span style="font-size:13px">líquidos</span></div>
          <div style="display:flex;height:10px;border-radius:5px;overflow:hidden;background:var(--color-neutral-800)">
            <div style="width:${g ? n / g * 100 : 0}%;background:#000"></div>
            <div style="flex:1;background:var(--color-accent-700)"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:11px" class="muted">
            <div style="display:flex;flex-direction:column"><span>Bruto</span><span style="font-size:15px;color:#000">${eur(g)}</span></div>
            <div style="display:flex;flex-direction:column"><span>Imposto</span><span style="font-size:15px;color:#000">${eur(g - n)}</span></div>
            <div style="display:flex;flex-direction:column"><span>vs inflação</span><span style="font-size:15px;color:#000">${eur(n - infl)}</span></div>
          </div>
          <p style="font-size:12px;color:var(--color-neutral-300);text-wrap:pretty">${note}</p>
        </div>

        <section style="display:flex;flex-direction:column;gap:8px">
          <h6>Com ${eur(s.amount)}, onde rende mais</h6>
          ${cmp.map(({ p, v }) => { const on = p.id === s.calcId; return html`
            <button class="tap" onClick=${() => this.setState({ calcId: p.id })} style="display:flex;align-items:center;gap:10px">
              <span style="width:96px;flex:none;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:${on ? 600 : 400}">${p.name}</span>
              <span style="flex:1;height:18px;border-radius:4px;background:var(--color-neutral-900);overflow:hidden;display:block"><span style="display:block;height:100%;width:${v / maxV * 100}%;border-radius:4px;background:${on ? '#000' : 'var(--color-accent-700)'}"></span></span>
              <span style="width:58px;text-align:right;font-size:12px">${eur(v)}</span>
            </button>`; })}
        </section>
        <p class="small">Estimativa com juros simples, limites e durações de promo de cada conta. Sem domiciliação, a Bankinter usa a Conta Digital. Depósitos a prazo assumem o prazo mais próximo.</p>
      </div>`;
  }

  /* Menos de 35 */
  jovem(s) {
    const perks = PERKS.filter(p => s.perkCat === 'Todos' || p.cat === s.perkCat);
    const irsBars = [100,75,75,75,50,50,50,25,25,25];
    return html`
      <div class="screen" style="gap:14px">
        <div>
          <h2>Menos de 35</h2>
          <p style="margin-top:4px;font-size:13px;color:var(--color-neutral-300)">Benefícios do Estado para jovens em Portugal.</p>
        </div>
        <div class="hscroll" style="gap:6px;padding-bottom:0">
          ${['Todos','Impostos','Casa','Poupança'].map(c => html`<${Chip} on=${s.perkCat === c} label=${c} onClick=${() => this.setState({ perkCat: c })} />`)}
        </div>
        ${perks.map(p => { const open = s.perkOpen === p.id; return html`
          <div style="border-radius:var(--radius-md);background:#fff;box-shadow:${open ? 'var(--shadow-md)' : 'var(--shadow-sm)'};overflow:hidden">
            <button class="tap" aria-expanded=${open} onClick=${() => this.setState({ perkOpen: open ? null : p.id })} style="display:flex;gap:12px;align-items:center;padding:14px">
              <${IconTile} icon=${p.icon} size=${40} />
              <span style="flex:1;display:flex;flex-direction:column"><span style="font-size:15px;font-weight:500">${p.title}</span><span class="small" style="font-size:12px">${p.sub}</span></span>
              <i class="ph ${open ? 'ph-caret-up' : 'ph-caret-down'}" aria-hidden="true"></i>
            </button>
            ${open && html`
              <div style="padding:0 14px 14px;display:flex;flex-direction:column;gap:12px">
                ${p.chart && html`
                  <div style="display:flex;flex-direction:column;gap:4px" role="img" aria-label="Isenção do IRS Jovem por ano: 100%, depois 75%, 50% e 25%">
                    <div style="display:flex;align-items:flex-end;gap:4px;height:70px">
                      ${irsBars.map((v, i) => html`<div style="flex:1;height:${v * .7}px;border-radius:3px 3px 0 0;background:${i === 0 ? '#000' : 'var(--color-neutral-600)'}"></div>`)}
                    </div>
                    <div class="small" style="display:flex;justify-content:space-between;font-size:10px"><span>Ano 1 · 100%</span><span>2–4 · 75%</span><span>5–7 · 50%</span><span>8–10 · 25%</span></div>
                  </div>`}
                <p style="font-size:13px;line-height:1.5;color:var(--color-neutral-200);text-wrap:pretty">${p.body}</p>
                ${p.link && html`<button onClick=${() => this.open(p.link)} class="btn btn-primary" style="align-self:flex-start">${p.linkLabel}</button>`}
              </div>`}
          </div>`; })}
        <p class="small">Regras resumidas. Confirma limites e prazos em vigor no Portal das Finanças e no Portal da Habitação.</p>
      </div>`;
  }

  /* Aprender */
  learn(s) {
    return html`
      <div class="screen" style="gap:20px">
        <h2>Aprender</h2>
        <section style="display:flex;flex-direction:column;gap:10px">
          <h6>Escada de risco baixo</h6>
          ${LADDER.map(([name, note, w], i) => html`
            <div style="display:flex;gap:12px;align-items:center">
              <span class="small" style="width:18px;font-size:12px">${i + 1}</span>
              <div style="flex:1;display:flex;flex-direction:column;gap:4px">
                <div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:14px">${name}</span><span class="small" style="text-align:right">${note}</span></div>
                <div style="height:4px;border-radius:2px;background:var(--color-neutral-900)"><div style="height:100%;width:${w}%;border-radius:2px;background:#000"></div></div>
              </div>
            </div>`)}
          <span class="small">A barra mostra o risco relativo e a menor liquidez.</span>
        </section>
        <section style="display:flex;flex-direction:column;gap:6px">
          <h6 style="margin-bottom:6px">Glossário</h6>
          ${GLOSS.map(([term, def]) => { const open = s.glossOpen === term; return html`
            <button class="tap" aria-expanded=${open} onClick=${() => this.setState({ glossOpen: open ? null : term })} style="padding:12px 14px;border-radius:var(--radius-md);background:#fff;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:6px">
              <span style="display:flex;justify-content:space-between;align-items:center;width:100%"><span style="font-size:14px;font-weight:500">${term}</span><i class="ph ${open ? 'ph-minus' : 'ph-plus'}" aria-hidden="true"></i></span>
              ${open && html`<span style="font-size:13px;color:var(--color-neutral-300);text-wrap:pretty">${def}</span>`}
            </button>`; })}
        </section>
      </div>`;
  }

  /* Alertas */
  alerts(s) {
    return html`
      <div class="screen" style="gap:18px;padding-top:4px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><h2>Alertas</h2><button onClick=${() => this.setState({ read: Object.fromEntries(ALERTS.map(a => [a.id, true])) })} class="btn btn-ghost" style="font-size:12px;white-space:nowrap">Marcar como lidos</button></div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${ALERTS.map((a, i) => { const un = i < 3 && !s.read[a.id]; return html`
            <button class="tap" onClick=${() => { this.setState(st => ({ read: { ...st.read, [a.id]: true } })); this.openDetail(a.pid); }} style="display:flex;gap:12px;padding:12px;border-radius:var(--radius-md);background:${un ? '#fff' : 'transparent'};box-shadow:${un ? 'var(--shadow-sm)' : 'none'}">
              <${IconTile} icon=${a.icon} />
              <span style="flex:1;display:flex;flex-direction:column;gap:2px">
                <span style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:14px;font-weight:${un ? 600 : 500}">${a.title}</span><span class="small" style="white-space:nowrap">${a.when}</span></span>
                <span style="font-size:13px;color:var(--color-neutral-300);text-wrap:pretty">${a.body}</span>
              </span>
              ${un && html`<span aria-label="novo" style="width:7px;height:7px;flex:none;margin-top:6px;border-radius:50%;background:#000"></span>`}
            </button>`; })}
        </div>
        <section style="display:flex;flex-direction:column;gap:2px">
          <h6 style="margin-bottom:6px">Avisar-me quando</h6>
          ${[['rates','Muda a taxa de quem sigo','Trade Republic, Bankinter e outros'],['promos','Há uma promo nova','Para novos clientes'],['ending','Uma promo está a acabar','7 dias antes'],['weekly','Resumo semanal','À segunda de manhã']].map(([k, label, sub]) => html`
            <button class="tap" role="switch" aria-checked=${s.notify[k]} onClick=${() => this.setState(st => ({ notify: { ...st.notify, [k]: !st.notify[k] } }))} style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;gap:12px">
              <span style="display:flex;flex-direction:column"><span style="font-size:14px">${label}</span><span class="small">${sub}</span></span>
              <${Switch} on=${s.notify[k]} />
            </button>`)}
        </section>
      </div>`;
  }

  /* Promoções */
  promos() {
    return html`
      <div class="screen" style="gap:14px;padding-top:4px">
        <div>
          <h2>Ganhar a abrir conta</h2>
          <p style="margin-top:4px;font-size:13px;color:var(--color-neutral-300)">Taxas promocionais para novos clientes. Estimativa líquida com €10.000.</p>
        </div>
        ${this.promoCards().map(p => html`
          <button class="tap" onClick=${p.open} style="padding:16px;border-radius:var(--radius-md);background:#fff;box-shadow:var(--shadow-sm);display:flex;gap:14px;align-items:center;opacity:${p.opacity}">
            <span style="flex:1;display:flex;flex-direction:column;gap:3px">
              <span class="small" style="font-size:12px">${p.name}</span>
              <span style="font-size:15px;font-weight:500">${p.title}</span>
              <span style="font-size:12px;color:var(--color-neutral-300)">${p.dur}</span>
            </span>
            <span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <span class="big" style="font-size:24px">${p.rate}</span>
              <span class="tag tag-accent">${p.estShort}</span>
            </span>
          </button>`)}
        <p class="small">Promos têm limites de saldo e prazo. Confirma no site da instituição antes de abrir conta.</p>
      </div>`;
  }

  /* Certificados */
  certs() {
    return html`
      <div class="screen" style="gap:16px;padding-top:4px">
        <div>
          <h2>Poupança do Estado</h2>
          <p style="margin-top:4px;font-size:13px;color:var(--color-neutral-300)">Dívida pública vendida diretamente a aforradores pelo IGCP. Sem risco de banco.</p>
        </div>
        <button class="tap" onClick=${() => this.openDetail('caf')} style="padding:18px;border-radius:var(--radius-lg);background:#fff;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:12px">
          <span style="display:flex;justify-content:space-between;align-items:center;width:100%"><span class="card-kicker">Certificados de Aforro · Série F</span><span class="tag tag-neutral">desde €5</span></span>
          <span style="display:flex;align-items:baseline;gap:10px"><span class="big" style="font-size:44px">2,50%</span><span style="font-size:13px">1,80% líquido</span></span>
          <span style="display:block;height:8px;border-radius:4px;background:#000;position:relative;width:100%"><span class="small" style="position:absolute;right:0;top:12px;font-size:10px">teto 2,5%</span></span>
          <span style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:11px;margin-top:8px;width:100%" class="muted">
            <span style="display:flex;flex-direction:column"><span>Indexado a</span><span style="font-size:13px;color:#000">Euribor 3M</span></span>
            <span style="display:flex;flex-direction:column"><span>Resgate</span><span style="font-size:13px;color:#000">após 3 meses</span></span>
            <span style="display:flex;flex-direction:column"><span>Onde</span><span style="font-size:13px;color:#000">CTT, BiG</span></span>
          </span>
        </button>
        <button class="tap" onClick=${() => this.openDetail('ctp')} style="padding:18px;border-radius:var(--radius-lg);background:#fff;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:12px">
          <span style="display:flex;justify-content:space-between;align-items:center;width:100%"><span class="card-kicker">Certificados do Tesouro · Série 5</span><span class="tag tag-neutral">desde €1.000</span></span>
          <span style="display:flex;align-items:baseline;gap:10px"><span class="big" style="font-size:44px">2,35%</span><i class="ph ph-arrow-right" aria-hidden="true"></i><span class="big" style="font-size:44px">3,35%</span></span>
          <span style="display:block;position:relative;height:40px;width:100%">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%"><path d="M0 40 L0 26 L100 4 L100 40 Z" fill="#ececec"></path><path d="M0 26 L100 4" stroke="#000" stroke-width="1.5" vector-effect="non-scaling-stroke" fill="none"></path></svg>
          </span>
          <span class="small" style="display:flex;justify-content:space-between;font-size:10px;width:100%"><span>Ano 1</span><span>média ≈2,71%</span><span>Ano 10</span></span>
          <span style="font-size:12px;color:var(--color-neutral-300)">Taxa fixa que sobe todos os anos. Cupão anual, sem capitalização. Lançado em jul 2026.</span>
        </button>
        <button onClick=${() => this.setState({ calcId: 'caf', tab: 'calc', view: null })} class="btn btn-primary btn-block" style="padding:12px">Simular Certificados de Aforro</button>
      </div>`;
  }

  /* Ficha de cada instituição */
  detailScreen(s) {
    const net = this.net, p = byId[s.detail], following = s.watch.includes(p.id);
    const facts = [['Taxas', p.rateText], ['Limite', p.cap], p.pay && ['Juros', p.pay], ['Impostos', p.tax], ['Taxa real', pct(net(p.best) - INF) + ' vs inflação'], p.term && ['Liquidez', 'Dinheiro preso até ao fim do prazo']].filter(Boolean);
    return html`
      <div class="screen" style="gap:18px;padding-top:4px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:52px;height:52px;flex:none;border-radius:14px;background:var(--color-neutral-800);display:grid;place-items:center;font-size:17px;font-weight:600">${p.mono}</div>
          <div style="flex:1;display:flex;flex-direction:column"><span style="font-size:22px;font-weight:600;line-height:1.15;letter-spacing:-0.02em">${p.name}</span><span class="small" style="font-size:12px">${p.kind} · ${p.product}</span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="padding:14px;border-radius:var(--radius-md);background:var(--color-accent-900);box-shadow:var(--shadow-sm);display:flex;flex-direction:column"><span class="muted" style="font-size:11px">Bruto (TANB)</span><span class="big" style="font-size:32px">${pct(p.best)}</span></div>
          <div style="padding:14px;border-radius:var(--radius-md);background:#fff;box-shadow:var(--shadow-sm);display:flex;flex-direction:column"><span class="muted" style="font-size:11px">Líquido</span><span class="big" style="font-size:32px">${pct(net(p.best))}</span></div>
        </div>
        <div style="display:flex;gap:8px">
          <button onClick=${() => this.setState(st => ({ watch: following ? st.watch.filter(x => x !== p.id) : [...st.watch, p.id] }))} aria-pressed=${following} class="btn btn-primary" style="flex:1;padding:10px"><i class="${following ? 'ph-fill' : 'ph'} ph-star" aria-hidden="true"></i>${following ? 'A seguir' : 'Seguir'}</button>
          <button onClick=${() => this.setState({ calcId: p.id, tab: 'calc', view: null })} class="btn btn-secondary" style="flex:1;padding:10px"><i class="ph ph-calculator" aria-hidden="true"></i>Simular</button>
        </div>
        <dl style="display:flex;flex-direction:column;margin:0">
          ${facts.map(([k, v]) => html`<div style="display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid var(--color-neutral-900)"><dt class="muted" style="font-size:13px;flex:none">${k}</dt><dd style="font-size:13px;text-align:right;margin:0">${v}</dd></div>`)}
        </dl>
        <section style="display:flex;flex-direction:column;gap:8px">
          <h6>Condições</h6>
          ${p.notes.map(n => html`<div style="display:flex;gap:10px;font-size:13px;line-height:1.5"><i class="ph ph-dot-outline" style="margin-top:3px" aria-hidden="true"></i><span style="text-wrap:pretty">${n}</span></div>`)}
        </section>
        <p class="small">Verificado a ${p.checked || '21 set 2026'}. Confirma termos atuais no site da instituição.</p>
      </div>`;
  }
}

render(html`<${App} />`, document.getElementById('app'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
