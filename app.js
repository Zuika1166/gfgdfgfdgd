/* CSFAIL-inspired interactive front-end prototype. No real money, login, Steam or API integrations. */
(() => {
'use strict';
const LS_KEY='csfail_demo_v1';
const fmt = n => `${Math.round(Number(n)||0).toLocaleString('ru-RU')} ₽`;
const ico = {crash:'📈',double:'🎒',wheel:'🎡',jackpot:'💎',mines:'💣',crazy:'🌀',defuse:'🛡️',battles:'⚔️',chicken:'🐔'};
const games=[
  {id:'crash',name:'Crash',kind:'PVE',players:421,description:'Успей остановить множитель до взрыва.'},
  {id:'double',name:'Double',kind:'PVE',players:147,description:'Красный, чёрный или зелёный. Выбери свой цвет.'},
  {id:'wheel',name:'Wheel',kind:'PVE',players:82,description:'Вращай колесо и узнай свой множитель.'},
  {id:'jackpot',name:'Jackpot',kind:'PVP',players:25,description:'Соревнуйся с виртуальными соперниками.'},
  {id:'mines',name:'Mines',kind:'PVE',players:198,description:'Открывай клетки и обходи мины.'},
  {id:'crazy',name:'Crazy Wheel',kind:'PVE',players:59,description:'Больше секторов и множителей.'},
  {id:'defuse',name:'Defuse',kind:'PVE',players:43,description:'Перережь нужный провод.'},
  {id:'battles',name:'PVP Battle',kind:'PVP',players:16,description:'Битва с виртуальным оппонентом.'},
  {id:'chicken',name:'Chicken Road',kind:'PVE',players:78,description:'Проходи дорогу и повышай множитель.'}
];
const cases=[
 {id:'neon',name:'Neon Dream',price:99,color:'#aa64ef',tag:'HOT'},
 {id:'eco',name:'Эко раунд',price:49,color:'#5cbea9',tag:'ECO'},
 {id:'sakura',name:'Sakura',price:159,color:'#ff73ae',tag:'NEW'},
 {id:'mirage',name:'Mirage',price:199,color:'#7c8bfe',tag:''},
 {id:'chicken',name:'Чикен',price:249,color:'#efb75e',tag:'TOP'},
 {id:'boss',name:'CSFAIL Boss',price:499,color:'#ee817b',tag:'TOP'},
 {id:'storm',name:'Storm Rider',price:129,color:'#65c5db',tag:''},
 {id:'inferno',name:'Inferno',price:299,color:'#ff8d55',tag:'HOT'},
 {id:'galaxy',name:'Galaxy',price:399,color:'#a283ee',tag:''},
 {id:'glitch',name:'Glitch',price:79,color:'#6ab1ff',tag:'ECO'},
 {id:'gold',name:'Golden Era',price:699,color:'#ddbd64',tag:'RARE'},
 {id:'knife',name:'Knife Party',price:999,color:'#ff83b8',tag:'VIP'}
];
const SKIN_ASSET_BASE='https://raw.githubusercontent.com/steamdashboard/cs2-items-api/main/data/api/media/rendered/files/skins/';
const itemNames=[
 {name:"Glock-18 | Fade",asset:"4-38",min:55,klass:"common",rarity:"Армейское",emoji:"🔫"},
 {name:"USP-S | Cortex",asset:"61-705",min:88,klass:"common",rarity:"Армейское",emoji:"🔫"},
 {name:"AK-47 | Redline",asset:"7-282",min:115,klass:"rare",rarity:"Запрещённое",emoji:"🎯"},
 {name:"Glock-18 | Water Elemental",asset:"4-353",min:130,klass:"rare",rarity:"Запрещённое",emoji:"🔫"},
 {name:"Desert Eagle | Blaze",asset:"1-37",min:195,klass:"rare",rarity:"Засекреченное",emoji:"🦅"},
 {name:"USP-S | Kill Confirmed",asset:"61-504",min:255,klass:"rare",rarity:"Тайное",emoji:"🔫"},
 {name:"AK-47 | Neon Rider",asset:"7-707",min:320,klass:"legendary",rarity:"Тайное",emoji:"🎯"},
 {name:"M4A1-S | Printstream",asset:"60-984",min:395,klass:"legendary",rarity:"Тайное",emoji:"🔫"},
 {name:"AWP | Asiimov",asset:"9-279",min:515,klass:"legendary",rarity:"Тайное",emoji:"🎯"},
 {name:"AK-47 | Vulcan",asset:"7-302",min:650,klass:"legendary",rarity:"Тайное",emoji:"🎯"},
 {name:"Desert Eagle | Printstream",asset:"1-962",min:760,klass:"legendary",rarity:"Тайное",emoji:"🦅"},
 {name:"Karambit | Doppler",asset:"507-415",min:1400,klass:"legendary",rarity:"Нож",emoji:"🗡️"},
 {name:"Butterfly Knife | Fade",asset:"515-38",min:1750,klass:"legendary",rarity:"Нож",emoji:"🗡️"},
 {name:"Sport Gloves | Vice",asset:"5030-10048",min:2100,klass:"legendary",rarity:"Перчатки",emoji:"🧤"},
 {name:"AWP | Dragon Lore",asset:"9-344",min:3500,klass:"legendary",rarity:"Тайное",emoji:"🎯"},
 {name:"AK-47 | Fire Serpent",asset:"7-180",min:950,klass:"legendary",rarity:"Тайное",emoji:"🎯"},
 {name:"M4A4 | Desolate Space",asset:"16-588",min:210,klass:"rare",rarity:"Засекреченное",emoji:"🔫"},
 {name:"M4A1-S | Hot Rod",asset:"60-445",min:430,klass:"legendary",rarity:"Тайное",emoji:"🔫"},
 {name:"AWP | Wildfire",asset:"9-917",min:285,klass:"rare",rarity:"Тайное",emoji:"🎯"},
 {name:"M4A4 | Asiimov",asset:"16-255",min:180,klass:"rare",rarity:"Тайное",emoji:"🔫"},
 {name:"USP-S | Neo-Noir",asset:"61-653",min:185,klass:"rare",rarity:"Засекреченное",emoji:"🔫"},
 {name:"Desert Eagle | Code Red",asset:"1-711",min:205,klass:"rare",rarity:"Тайное",emoji:"🦅"},
 {name:"AK-47 | Bloodsport",asset:"7-639",min:380,klass:"legendary",rarity:"Тайное",emoji:"🎯"},
 {name:"AWP | Hyper Beast",asset:"9-475",min:260,klass:"rare",rarity:"Засекреченное",emoji:"🎯"},
 {name:"M4A1-S | Hyper Beast",asset:"60-430",min:165,klass:"rare",rarity:"Засекреченное",emoji:"🔫"},
 {name:"Karambit | Fade",asset:"507-38",min:1780,klass:"legendary",rarity:"Нож",emoji:"🗡️"},
 {name:"AWP | Containment Breach",asset:"9-887",min:355,klass:"legendary",rarity:"Тайное",emoji:"🎯"},
 {name:"AK-47 | Asiimov",asset:"7-801",min:190,klass:"rare",rarity:"Тайное",emoji:"🎯"},
 {name:"USP-S | Orion",asset:"61-313",min:250,klass:"rare",rarity:"Засекреченное",emoji:"🔫"},
 {name:"M4A4 | Temukau",asset:"16-1228",min:245,klass:"rare",rarity:"Засекреченное",emoji:"🔫"}
];
function skinVisual(item,className=''){
 const id=/^\d+-\d+$/.test(String(item?.asset||''))?item.asset:'';
 const image=id?SKIN_ASSET_BASE+id+'/light.png':'';
 return '<span class="skin-visual '+esc(className)+'">'+(image?'<img src="'+image+'" alt="'+esc(item.name)+'" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false">':'')+'<span class="skin-fallback" '+(image?'hidden':'')+'>'+esc(item.emoji||'✦')+'</span></span>';
}
const today=()=>new Date().toLocaleDateString('sv-SE');
const defaults={balance:2500,inventory:[],history:[],username:'Demo Player',loggedIn:false,dailyDate:'',promoUsed:false};
let state;
try {state={...defaults,...JSON.parse(localStorage.getItem(LS_KEY)||'{}')}; if(!Array.isArray(state.inventory))state.inventory=[];if(!Array.isArray(state.history))state.history=[];}catch(_){state={...defaults};}
let ui={modal:null,filter:'all',activeBet:100,color:'red',method:'card',amount:500,menu:false,spinning:false,wheelAngle:0,crash:null,mines:null,chicken:null,lastGameResult:'',latestNumbers:[],busy:false,caseRoll:null,doubleReel:null,lastMine:-1,defuseResult:null,crashBurst:false};
let crashTimer=null;
function save(){try{localStorage.setItem(LS_KEY,JSON.stringify(state));}catch(_){}}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function g(id){return games.find(x=>x.id===id);}
function c(id){return cases.find(x=>x.id===id);}
function currentPath(){return decodeURI(location.hash.replace(/^#/,''))||'/';}
function go(p){location.hash='#'+p;if(currentPath()===p)render();window.scrollTo({top:0,behavior:'instant'});}
function toast(message,type=''){const parent=document.getElementById('toast-area'); const el=document.createElement('div');el.className='toast '+type;el.textContent=message;parent.append(el);setTimeout(()=>el.remove(),3900);}
function record(title,value){state.history.unshift({title,value,date:Date.now()});state.history=state.history.slice(0,55);save();}
function spend(sum){if(!Number.isFinite(sum)||sum<=0){toast('Введите корректную сумму','error');return false;}if(state.balance<sum){toast('Не хватает демо-баланса. Откройте пополнение.','error');return false;}state.balance-=sum;save();return true;}
function win(sum){state.balance+=Math.round(sum);save();}
function svgCase(q,scale=1){const col=q.color;const id=q.id.replace(/[^a-z0-9]/g,'');return `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" aria-label="Иллюстрация кейса ${esc(q.name)}"><defs><linearGradient id="cb${id}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${col}"/><stop offset="1" stop-color="#344b8f"/></linearGradient><linearGradient id="lid${id}" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#c5d6ff"/><stop offset="1" stop-color="${col}"/></linearGradient></defs><ellipse cx="111" cy="145" rx="92" ry="12" fill="#050a22" opacity=".23"/><path d="M30 62L110 35L191 62L189 124L111 151L30 123Z" fill="url(#cb${id})" stroke="#d5e6ff" stroke-opacity=".32" stroke-width="3"/><path d="M30 62L110 86L191 62L110 35Z" fill="url(#lid${id})" stroke="#eaf0ff" stroke-opacity=".56" stroke-width="3"/><path d="M110 86V151M30 62V123M190 62V123" fill="none" stroke="#101939" stroke-opacity=".54" stroke-width="5"/><path d="M59 48L135 72L150 66L74 43Z" fill="#d6e5ff" opacity=".46"/><path d="M46 80L93 94V116L46 102Z" fill="#131e46" opacity=".42"/><path d="M129 97L173 84V110L129 124Z" fill="#c0d0ff" opacity=".22"/><circle cx="110" cy="111" r="17" fill="#17254e" stroke="${col}" stroke-width="3"/><path d="M110 98L114 107L124 108L117 115L119 125L110 120L101 125L103 115L96 108L106 107Z" fill="#f8f5ff"/></svg>`;}
function gameArt(id){let art='';
 const commonStart=`<svg viewBox="0 0 210 180" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e7f2ff"/><stop offset=".5" stop-color="#88b7ed"/><stop offset="1" stop-color="#6479d1"/></linearGradient><linearGradient id="b${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a5a9ff"/><stop offset="1" stop-color="#534dd6"/></linearGradient></defs><ellipse cx="107" cy="163" rx="83" ry="12" fill="#121a46" opacity=".35"/>`;
 if(id==='crash')art=`<g transform="translate(35,11) rotate(-18 87 84)"><path d="M79 12Q128 25 143 82L110 125L47 98Q47 42 79 12Z" fill="url(#a${id})" stroke="#c5ddff" stroke-width="5"/><circle cx="98" cy="69" r="23" fill="#4e6bc9" stroke="#e2f6ff" stroke-width="8"/><circle cx="98" cy="69" r="11" fill="#b6e8ff"/><path d="M46 88L15 106L50 121L66 101Z" fill="#6179db"/><path d="M122 118L132 154L155 122L135 100Z" fill="#6179db"/><path d="M73 119Q88 153 73 178Q54 154 63 123" fill="#fdcd9b"/><path d="M71 130Q80 152 70 164L64 135Z" fill="#ffa26c"/></g>`;
 else if(id==='double')art=`<g transform="rotate(-8 104 90)"><rect x="39" y="56" rx="26" width="91" height="104" fill="url(#a${id})" stroke="#b8ceff" stroke-width="5"/><rect x="116" y="37" rx="25" width="71" height="118" fill="url(#b${id})" stroke="#a8a7fa" stroke-width="5"/><path d="M67 54Q58 28 78 22Q97 19 103 47M116 42Q135 17 150 31Q156 37 156 44" stroke="#bde4ff" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M54 101L79 119L105 92" fill="none" stroke="#ffe2ba" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>`;
 else if(['wheel','crazy'].includes(id))art=`<g transform="rotate(-15 109 100)"><circle cx="115" cy="91" r="78" fill="#b0c5ff" stroke="#c5deff" stroke-width="6"/><path d="M115 91V15A76 76 0 0 1 168 37Z" fill="#7668e8"/><path d="M115 91L168 37A76 76 0 0 1 190 103Z" fill="#947be9"/><path d="M115 91L190 103A76 76 0 0 1 148 160Z" fill="#4d77c9"/><path d="M115 91L148 160A76 76 0 0 1 63 151Z" fill="#a67ae9"/><path d="M115 91L63 151A76 76 0 0 1 46 42Z" fill="#678bdc"/><path d="M115 91L46 42A76 76 0 0 1 115 15Z" fill="#b69df2"/><g fill="none" stroke="#dce5ff" stroke-width="4"><circle cx="115" cy="91" r="79"/><path d="M115 12V170M36 91H194M57 33L173 149M173 33L57 149"/></g><circle cx="115" cy="91" r="20" fill="#dceaff" stroke="#5363bc" stroke-width="6"/><path d="M109 3L126 3L117 24Z" fill="#ffe3a9"/></g>`;
 else if(id==='mines')art=`<g><path d="M119 40L128 22L149 26" stroke="#b9c9f9" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="145" cy="23" r="11" fill="#ffbf92"/><circle cx="105" cy="107" r="66" fill="url(#a${id})" stroke="#b6d0ff" stroke-width="5"/><path d="M105 58V77M105 137V156M55 107H72M138 107H156M74 75L84 85M126 127L139 139M76 140L88 127M132 80L144 67" stroke="#e4f5ff" stroke-width="7" stroke-linecap="round"/><circle cx="101" cy="101" r="26" fill="#709be1" opacity=".56"/><path d="M88 99L101 112L124 88" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
 else if(id==='defuse')art=`<g transform="rotate(10 110 90)"><rect x="51" y="33" width="119" height="124" rx="14" fill="#1d315e" stroke="#9db9e5" stroke-width="6"/><rect x="69" y="50" width="83" height="48" rx="6" fill="#50758e" stroke="#9cc4e8" stroke-width="3"/><text x="109" y="82" fill="#adffdb" font-size="22" font-weight="900" text-anchor="middle">00:12</text><rect x="68" y="110" width="20" height="20" rx="5" fill="#c5d9ff"/><rect x="96" y="110" width="20" height="20" rx="5" fill="#c5d9ff"/><rect x="124" y="110" width="20" height="20" rx="5" fill="#c5d9ff"/><path d="M65 39C45 -3 33 14 25 41" stroke="#ff769a" fill="none" stroke-width="6"/><path d="M91 34C91 -6 171 -2 185 32" stroke="#8dddff" fill="none" stroke-width="6"/><path d="M139 37C170 -10 200 17 199 48" stroke="#f9ce7a" fill="none" stroke-width="6"/></g>`;
 else if(id==='jackpot')art=`<g><path d="M103 16L156 38L190 98L139 161L62 143L36 76L59 30Z" fill="url(#a${id})" stroke="#d7efff" stroke-width="5"/><path d="M103 16L102 98L190 98L156 38Z" fill="#aaacff" opacity=".9"/><path d="M36 76L102 98L62 143Z" fill="#69cbe5"/><path d="M102 98L139 161L190 98Z" fill="#455de2"/><path d="M59 30L102 98L36 76Z" fill="#e9efff"/><circle cx="152" cy="35" r="8" fill="#fff8cf"/><path d="M152 18V53M134 35H171" stroke="#fff8cf" stroke-width="3"/></g>`;
 else if(id==='battles')art=`<g transform="rotate(-18 105 90)"><path d="M56 13L73 15L103 115L86 122Z" fill="url(#a${id})" stroke="#c8ddff" stroke-width="5"/><path d="M32 115L127 110L131 126L32 131Z" fill="#748ce5"/><rect x="88" y="130" width="16" height="45" rx="6" fill="#354c8c"/><path d="M164 9L144 19L113 121L132 129Z" fill="url(#b${id})" stroke="#becbff" stroke-width="5"/><path d="M94 109L178 130L173 143L89 122Z" fill="#8c9ff0"/><rect x="118" y="138" width="17" height="39" rx="7" fill="#354c8c"/></g>`;
 else if(id==='chicken')art=`<g><ellipse cx="119" cy="107" rx="58" ry="55" fill="url(#a${id})" stroke="#cde5ff" stroke-width="4"/><circle cx="120" cy="61" r="38" fill="#ecf4ff"/><path d="M100 29L112 9L123 28L138 9L145 32" fill="#ff6b85" stroke="#fca3a4" stroke-width="3"/><circle cx="106" cy="58" r="5" fill="#1c3260"/><circle cx="135" cy="58" r="5" fill="#1c3260"/><path d="M121 73L154 83L121 93Z" fill="#ffd38b"/><path d="M89 113L47 84L66 140Z" fill="#c9ddff"/><path d="M102 158L98 174M136 155L142 173" stroke="#ffae7c" stroke-width="8" stroke-linecap="round"/></g>`;
 else art=`<g><circle cx="111" cy="93" r="65" fill="url(#b${id})"/><text x="111" y="114" font-size="65" text-anchor="middle">🎮</text></g>`;
 return commonStart+art+'</svg>';
}
function brand(){return `<a class="logo" href="#/" aria-label="Главная CSFAIL DEMO"><span class="logo-mark">✦</span><b>CS</b><i>FAIL</i><em>DEMO</em></a>`;}
function navLink(p,symbol,name){return `<a class="nav-link ${currentPath()===p?'active':''}" href="#${p}" data-navigate="1"><span class="nav-icon">${symbol}</span>${name}</a>`;}
function header(){return `<header class="site-header"><div class="container header-row">${brand()}<nav class="nav ${ui.menu?'open':''}" id="menu">${navLink('/','⌂','Главная')}${navLink('/cases','▣','Кейсы')}${navLink('/bonuses','✦','Бонусы')}${navLink('/leaderboard','🏆','Топ')}${navLink('/fair','✓','Честная игра')}${navLink('/history','◷','История')}</nav><div class="header-actions"><div class="balance"><small>Демо-баланс</small><strong>${fmt(state.balance)}</strong></div><button class="btn btn-primary" data-action="payment">＋ Пополнить</button><button class="icon-btn profile-btn" title="Профиль" data-action="profile">👤</button><button class="icon-btn hamburger" aria-label="Меню" aria-expanded="${ui.menu}" data-action="menu">☰</button></div></div></header>`;}
function ticker(){const sample=itemNames.filter((_,i)=>i%2===0).slice(0,15);const set=[...sample,...sample];return '<div class="ticker-wrap"><div class="ticker"><span class="ticker-label"><span class="live-dot"></span> LIVE DROPS · DEMO</span>'+set.map((it,i)=>'<div class="ticker-item '+it.klass+'">'+skinVisual(it,'ticker-skin')+'<div><strong>'+esc(it.name)+'</strong><small>виртуальный дроп #'+(i%sample.length+1)+'</small></div><em>'+fmt(it.min*4)+'</em></div>').join('')+'</div></div>';}
function footer(){return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div>${brand()}<p>Демонстрационный проект по мотивам интерфейсов CS2. Виртуальные кредиты и предметы не имеют денежной стоимости, не выводятся и не обмениваются на игровые скины.</p></div><div class="footer-links"><strong>Навигация</strong><a href="#/">Главная</a><a href="#/cases">Каталог кейсов</a><a href="#/bonuses">Бонусы</a><a href="#/leaderboard">Рейтинг игроков</a></div><div class="footer-links"><strong>Информация</strong><a href="#/fair">Демо и ограничения</a><a href="#/inventory">Мой инвентарь</a><a href="#/history">История действий</a><a href="#/payment">Виртуальное пополнение</a></div></div><div class="foot-bottom"><span>© ${new Date().getFullYear()} CSFAIL DEMO • Независимый концепт • Не связан с Valve, Steam или CSFAIL</span><span>18+ оригинальная тематика • Без реальных денег</span></div></div></footer>`;}
function demoNote(){return `<div class="demo-banner">⚠️ Это независимый интерактивный <strong>демо-прототип</strong>: вместо реальных денег используются виртуальные кредиты. Steam, платежи, вывод скинов и сетевые игры не подключены.</div>`;}
function sectionTitle(name,subtitle='',url='',link='Смотреть все →'){return `<div class="section-header"><div><h2>${name}</h2>${subtitle?`<div class="subheading">${subtitle}</div>`:''}</div>${url?`<a class="text-link" href="#${url}">${link}</a>`:''}</div>`;}
function gameCard(o){return `<a href="#/games/${o.id}" class="game-card ${o.id}" aria-label="Играть в ${o.name}"><h3>${o.name}</h3><span class="players">◉ ${o.players} онлайн*</span><span class="mode-pill ${o.kind.toLowerCase()}">${o.kind}</span><span class="meta">★ Demo game</span><span class="game-illustration">${gameArt(o.id)}</span><span class="game-link">Играть →</span></a>`;}
function caseCard(o){const i=cases.findIndex(a=>a.id===o.id);const feature=itemNames[(i*3+6)%itemNames.length];return `<a class="case-card" href="#/cases/${o.id}" style="--case-accent:${o.color}">${o.tag?`<span class="case-badge ${['TOP','RARE','VIP'].includes(o.tag)?'gold':''}">${o.tag}</span>`:''}<div class="case-picture"><span class="case-orbit"></span><div class="case-product">${svgCase(o)}</div><div class="case-skin">${skinVisual(feature)}</div></div><div class="case-foot"><strong>${esc(o.name)}</strong><span class="case-price">${fmt(o.price)}</span></div></a>`;}
function heroArt(){return `<svg viewBox="0 0 350 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="heroWheel" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#efefff"/><stop offset="1" stop-color="#b5bafd"/></linearGradient></defs><g transform="rotate(19 210 167)"><circle cx="223" cy="149" r="113" fill="#9b6bff" stroke="#d5c8ff" stroke-width="12"/><path d="M223 149V36A113 113 0 0 1 336 149Z" fill="#6e54d2"/><path d="M223 149H336A113 113 0 0 1 223 262Z" fill="#ac79e6"/><path d="M223 149V262A113 113 0 0 1 110 149Z" fill="#594dc1"/><path d="M223 149H110A113 113 0 0 1 223 36Z" fill="#9a6fff"/><circle cx="223" cy="149" r="40" fill="url(#heroWheel)" stroke="#6750c8" stroke-width="13"/><path d="M223 38V261M110 149H335M144 70L301 228M303 70L144 228" stroke="#d8ceff" stroke-width="7"/><circle cx="223" cy="149" r="17" fill="#7752ca"/></g><g transform="translate(28 135) rotate(-17 60 60)"><rect x="0" y="48" width="117" height="90" rx="13" fill="#7b8ee6" stroke="#c6d3ff" stroke-width="5"/><rect x="0" y="42" width="117" height="32" rx="11" fill="#c4d6ff"/><path d="M58 43C19 19 34 -4 55 14L64 39M58 43C97 -1 119 28 76 45" fill="none" stroke="#fae8a8" stroke-width="13"/><rect x="46" y="46" width="26" height="90" fill="#8bb1e4"/><text x="58" y="101" text-anchor="middle" fill="white" font-weight="900" font-size="23">✦</text></g><path d="M287 17L295 36L318 38L301 52L305 72L287 60L268 72L273 52L257 38L279 36Z" fill="#ffe2ac"/></svg>`;}
function home(){return `${demoNote()}<div class="hero-grid"><div class="hero-main"><div class="hero-content"><span class="pill">✦ НОВАЯ ДЕМО-КОЛЛЕКЦИЯ</span><h1>Открывай кейсы.<br>Лови эмоции.</h1><p>Погружайся в мир игровых режимов и собирай виртуальные предметы в своём инвентаре.</p><a href="#/cases" class="btn hero-btn">Посмотреть кейсы →</a></div><div class="hero-art">${heroArt()}</div><div class="hero-dots"><span></span><span></span><span></span></div></div><div class="promo-box"><h3>Активируй<br>промокод</h3><p>Получи дополнительные демо-кредиты и попробуй свои любимые режимы.</p><form class="promo-form" data-form="promo"><input aria-label="Промокод" name="code" maxlength="24" placeholder="Введи промокод" required/><button type="submit">OK →</button></form><div class="promo-icon">🎁</div></div></div><div class="stats-strip"><div class="stat"><span class="stat-ico">🎮</span><div><strong>9</strong><span>игровых режимов</span></div></div><div class="stat"><span class="stat-ico">📦</span><div><strong>12</strong><span>виртуальных кейсов</span></div></div><div class="stat"><span class="stat-ico">🏆</span><div><strong>100%</strong><span>демо-режим</span></div></div><div class="stat"><span class="stat-ico">🎁</span><div><strong>DEMO2026</strong><span>бонусный промокод</span></div></div></div>${sectionTitle('🎮 Игровые режимы','Выбери игру, чтобы запустить демонстрационную механику.','/cases','К каталогу кейсов →')}<div class="game-grid">${games.map(gameCard).join('')}</div>${sectionTitle('📦 Популярные кейсы','Случайные виртуальные награды — без денежных ставок.','/cases')}<div class="case-grid">${cases.slice(0,6).map(caseCard).join('')}</div>${sectionTitle('🎁 Твои бонусы','Заглядывай каждый день за наградами.','/bonuses')}<div class="bonus-grid"><div class="bonus-card"><h3>Ежедневный бонус</h3><p>Виртуальные кредиты раз в день.</p><div class="bonus-emoji">🎁</div><button data-action="daily">Забрать →</button></div><div class="bonus-card"><h3>Бонусы и награды</h3><p>Активируй промокод, начни с дополнительного баланса.</p><div class="bonus-emoji">🎡</div><button data-action="promo-modal">Ввести код →</button></div><div class="bonus-card"><h3>Коллекция предметов</h3><p>Открывай кейсы и наполняй инвентарь.</p><div class="bonus-emoji">💎</div><button data-action="inventory">Открыть →</button></div></div>`;}
function caseCatalogue(){let filt=ui.filter;let arr=cases.filter(x=>filt==='all'||(filt==='cheap'&&x.price<=159)||(filt==='medium'&&x.price>159&&x.price<499)||(filt==='premium'&&x.price>=499));return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">КОЛЛЕКЦИЯ CS2</div><h1>Каталог кейсов</h1><div class="page-sub">Наборы виртуальных предметов. Выбирай и открывай.</div></div><span class="tag">${arr.length} кейсов</span></div><div class="filter-bar">${[['all','Все кейсы'],['cheap','До 159 ₽'],['medium','159–499 ₽'],['premium','От 499 ₽']].map(([id,txt])=>`<button data-filter="${id}" class="${filt===id?'active':''}">${txt}</button>`).join('')}</div><div class="case-grid">${arr.map(caseCard).join('')}</div>`;}
function lootForCase(cs){return itemNames.map((it,i)=>({...it,price:Math.round(it.min*(cs.price/120)*(.8+i*.09))}));}
function caseDetail(cs){const items=lootForCase(cs),rolling=ui.caseRoll?.id===cs.id;return `${demoNote()}<div class="page-heading"><div><div class="eyebrow"><a href="#/cases">← Все кейсы</a></div><h1>${esc(cs.name)}</h1><div class="page-sub">Кинематографичное открытие с демонстрационными скинами</div></div><span class="tag yellow">${cs.tag||'CASE'}</span></div><div class="panel case-hero"><div class="case-hero-image">${svgCase(cs)}</div><div><span class="eyebrow">CASE DROP / DEMO</span><h1>${esc(cs.name)}</h1><p>Запусти рулетку и наблюдай, как виртуальные предметы пролетают под указателем. Результат определяется один раз перед анимацией.</p><div class="price-lg">${fmt(cs.price)}</div><button class="btn btn-primary" data-case-open="${cs.id}" ${ui.busy?'disabled':''}>${rolling?'◌ Открывается…': '✦ Открыть кейс'}</button><p class="hint">Виртуальные предметы и баланс · без вывода в Steam</p></div></div>${rolling?`<div class="panel opening-panel"><div class="opening-top"><span class="eyebrow">ОТКРЫТИЕ КЕЙСА</span><span class="opening-live"><i></i> Рулетка вращается</span></div><div class="case-reel-viewport"><div class="case-reel-marker"></div><div class="case-reel-track" id="case-reel-track">${ui.caseRoll.reel.map((it,i)=>`<div class="case-reel-item ${it.klass}" data-slot="${i}">${skinVisual(it)}<span>${esc(it.name)}</span><b>${fmt(it.price)}</b></div>`).join('')}</div></div><div class="reel-progress"><span></span></div></div>`:''}${sectionTitle('Содержимое кейса','Настоящие изображения оружия CS2 · демонстрационная стоимость')}<div class="drops-grid">${items.map(o=>`<div class="drop-card ${o.klass}">${skinVisual(o,'drop-skin')}<strong>${esc(o.name)}</strong><small>${fmt(o.price)}</small><div class="rarity">${o.rarity}</div></div>`).join('')}</div>`;}
function profile(){return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">МОЙ АККАУНТ</div><h1>Профиль игрока</h1></div><button class="btn btn-soft" data-action="login">${state.loggedIn?'Аккаунт демо':'Войти в демо-аккаунт'}</button></div><div class="layout-2"><div class="panel"><div class="profile-head"><div class="profile-picture">👤</div><div><h2>${state.username}</h2><p>Виртуальный аккаунт • уровень 1 • #DEMO</p></div></div><div class="section-divider"></div><div class="small-cards"><div class="small-card"><b>${fmt(state.balance)}</b><span>баланс</span></div><div class="small-card"><b>${state.inventory.length}</b><span>предметы</span></div><div class="small-card"><b>${state.history.length}</b><span>действия</span></div></div><div class="stage-actions"><button data-action="inventory" class="btn btn-primary">Мой инвентарь</button><button data-action="payment" class="btn btn-soft">Пополнить баланс</button></div></div><div class="panel panel-highlight"><h2>🎯 Быстрый доступ</h2><div class="metric-row"><span>Промокод</span><strong>${state.promoUsed?'Активирован':'DEMO2026'}</strong></div><div class="metric-row"><span>Ежедневный бонус</span><strong>${state.dailyDate===today()?'Получен':'Доступен'}</strong></div><div class="metric-row"><span>Статус аккаунта</span><strong>Демо</strong></div><div class="section-divider"></div><button class="btn btn-green wide" data-action="daily">🎁 Получить дневной бонус</button></div></div>`;}
function inventory(){return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">КОЛЛЕКЦИЯ</div><h1>Мой инвентарь</h1><div class="page-sub">Скины виртуальные · прямой обмен и Steam-трейды не предусмотрены</div></div><div class="tags"><span class="tag">${state.inventory.length} шт.</span><span class="tag green">${fmt(state.inventory.reduce((a,x)=>a+x.price,0))}</span></div></div>${state.inventory.length?`<div class="inventory-grid">${state.inventory.map((it,i)=>`<div class="inventory-card ${it.klass||'common'}">${skinVisual(it,'inventory-skin')}<strong>${esc(it.name)}</strong><small>${fmt(it.price)}</small><button class="btn btn-green btn-small" data-sell="${i}">Продать за ${fmt(it.price)}</button></div>`).join('')}</div>`:`<div class="panel empty"><div class="empty-icon">📭</div><strong>Твой инвентарь пока пуст</strong><p>Открой первый кейс и получи случайный виртуальный предмет.</p><a href="#/cases" class="btn btn-primary">Выбрать кейс</a></div>`}`;}
function bonuses(){return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">БОНУСЫ</div><h1>Ежедневные награды</h1><div class="page-sub">Забирай виртуальные кредиты и изучай функции интерфейса.</div></div><span class="tag yellow">🎁 DEMO</span></div><div class="panel panel-highlight"><div class="section-header" style="margin-top:0"><div><h2>Серия ежедневных входов</h2><div class="subheading">Демонстрационная шкала бонусов</div></div><span class="tag">День 1 / 7</span></div><div class="daily-strip">${[1,2,3,4,5,6,7].map(i=>`<div class="daily-day ${i===1?'today':''}"><strong>${i} ДЕНЬ</strong><div class="day-icon">${i===7?'💎':i===5?'🎁':'📦'}</div><small>${i===1?'150 ₽':'Скоро'}</small></div>`).join('')}</div><div style="margin-top:16px"><button class="btn btn-green" data-action="daily" ${state.dailyDate===today()?'disabled':''}>${state.dailyDate===today()?'✓ Сегодня уже получено':'🎁 Получить 150 ₽'}</button></div></div>${sectionTitle('Другие бонусы','Демонстрация доступных разделов')}<div class="bonus-page-cards"><div class="bonus-tile"><div class="emoji">🏆</div><h3>VIP Club</h3><p>Раздел с уровнями и дополнительными преимуществами для игроков.</p><button class="btn btn-soft" data-action="info-vip">Подробнее</button></div><div class="bonus-tile"><div class="emoji">🎡</div><h3>Промокоды</h3><p>Введи DEMO2026 для единоразового начисления виртуальных кредитов.</p><button class="btn btn-primary" data-action="promo-modal">Активировать</button></div><div class="bonus-tile"><div class="emoji">🎯</div><h3>Мини-задания</h3><p>Открывай кейсы и пополняй свою коллекцию виртуальными скинами.</p><a href="#/cases" class="btn btn-soft">К кейсам</a></div></div>`;}
function payment(){const options=[100,250,500,1000];return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">КОШЕЛЁК / ДЕМО</div><h1>Пополнение баланса</h1><div class="page-sub">Без платежей, комиссий, ввода данных карты или подключения банков.</div></div><span class="tag green">Баланс: ${fmt(state.balance)}</span></div><div class="layout-2"><div class="panel"><h2>Выбери способ</h2><div class="method-grid">${[['card','💳','Банковская карта'],['skins','🎮','CS2 скины'],['crypto','◈','Криптовалюта']].map(([id,icon,name])=>`<button class="method ${ui.method===id?'active':''}" data-method="${id}"><span>${icon}</span><strong>${name}</strong><small>Демо</small></button>`).join('')}</div><div class="section-divider"></div><label for="amount" class="label">Сумма виртуального пополнения</label><div class="choice-row">${options.map(n=>`<button class="choice ${ui.amount===n?'active':''}" data-amount="${n}">${fmt(n)}</button>`).join('')}</div><input id="amount" class="field" type="number" min="10" max="100000" step="1" value="${ui.amount}" aria-label="Сумма пополнения"><div class="section-divider"></div><button class="btn btn-green wide" data-action="add-balance">＋ Начислить виртуальные кредиты</button><p class="hint">Кнопка мгновенно начисляет тестовый баланс в браузере. Деньги и реквизиты не используются.</p></div><div class="panel panel-highlight"><h2>💠 Информация</h2><div class="metric-row"><span>Тип операции</span><strong>Демо-пополнение</strong></div><div class="metric-row"><span>Выбранный метод</span><strong>${{card:'Карта',skins:'Скины',crypto:'Крипто'}[ui.method]}</strong></div><div class="metric-row"><span>К зачислению</span><strong>${fmt(ui.amount)}</strong></div><div class="metric-row"><span>Комиссия</span><strong>0 ₽</strong></div><div class="section-divider"></div><p>Это страница-прототип для проверки интерфейса. Реальные эквайринг, KYC, Steam OpenID и обработчики платежей в проекте не предусмотрены.</p><a class="btn btn-soft wide" href="#/inventory">Перейти в инвентарь →</a></div></div>`;}
function fair(){return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">ИНФОРМАЦИЯ</div><h1>Демо-режим и безопасность</h1></div></div><div class="layout-2"><div class="panel"><h2>Что реализовано</h2><p>Этот сайт — самостоятельный прототип интерфейса игровой платформы: переключение разделов, каталог кейсов, виртуальный баланс, инвентарь, история, бонусы и упрощённые мини-игры.</p><div class="metric-row"><span>Сохранение прогресса</span><strong>localStorage</strong></div><div class="metric-row"><span>Механики игр</span><strong>Демо-симуляция</strong></div><div class="metric-row"><span>Денежные операции</span><strong>Нет</strong></div><div class="metric-row"><span>Внешние аккаунты</span><strong>Нет</strong></div></div><div class="panel panel-highlight"><h2>Что нужно для production</h2><p>Для запуска реального сервиса потребуется отдельный сервер, защищённая регистрация, честная серверная генерация результатов с возможностью криптографической проверки (provably fair), аудит безопасности, лицензионная и юридическая проверка, проверка возраста пользователей, интеграции провайдеров и меры ответственной игры.</p><button class="btn btn-soft" data-action="reset">Сбросить демо-прогресс</button></div></div>`;}
function historyPage(){return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">СТАТИСТИКА</div><h1>История действий</h1></div><span class="tag">${state.history.length} записей</span></div><div class="panel">${state.history.length?state.history.map(it=>`<div class="history-row"><div><strong>${esc(it.title)}</strong><br><span>${new Date(it.date).toLocaleString('ru-RU')}</span></div><strong class="${it.value>0?'win':it.value<0?'lose':''}">${it.value>0?'+':''}${fmt(it.value)}</strong></div>`).join(''):`<div class="empty"><div class="empty-icon">🕘</div><strong>Пока ничего не произошло</strong><p>Открой кейс или запусти демонстрационную игру.</p><a href="#/cases" class="btn btn-primary">Начать</a></div>`}</div>`;}
function leaderboard(){const people=[['🏆','HyperNova','127 800 ₽'],['⚡','VoltPlayer','98 400 ₽'],['👑','SkyWalker','77 900 ₽'],['🎯','FastClick','68 700 ₽'],['💎','BlueDiamond','64 500 ₽'],['🛡️','Shield99','51 200 ₽'],['🔥','HotCase','37 600 ₽'],['🎮','DemoRunner','26 300 ₽']];return `${demoNote()}<div class="page-heading"><div><div class="eyebrow">ТАБЛИЦА ЛИДЕРОВ</div><h1>Топ игроков</h1><div class="page-sub">Вымышленные профили и значения для макета.</div></div></div><div class="panel"><table class="leader-table"><thead><tr><th>Место</th><th>Игрок</th><th>Демо-результат</th></tr></thead><tbody>${people.map(([em,n,v],i)=>`<tr><td>#${i+1}</td><td><span class="avatar">${em}</span><strong>${n}</strong></td><td>${v}</td></tr>`).join('')}</tbody></table></div>`;}
function betMarkup(){return `<label class="label" for="game-bet">Размер ставки (виртуальные кредиты)</label><input class="field" id="game-bet" inputmode="numeric" type="number" min="10" max="100000" step="10" value="${ui.activeBet}"/><div class="choice-row">${[50,100,250,500].map(n=>`<button type="button" data-bet="${n}" class="choice ${ui.activeBet===n?'active':''}">${fmt(n)}</button>`).join('')}</div>`;}
function wheelFactors(id){return id==='crazy'?[0,1.2,2,5,0,10,2,3,0,7,1.5,3]:[0,1,2,0,3,1.5,0,4,1.2,2,0,3];}
function rouletteSequence(){return ['red','black','red','black','red','black','green','black','red','black','red','black','red','black'];}
function gameStage(id){
 if(id==='crash')return '<div class="game-stage crash-stage '+(ui.crashBurst?'crash-exploded':'')+'"><div class="stage-label"><span class="live-dot"></span> CRASH / '+(ui.crash?.active?'В ПОЛЁТЕ':'ОЖИДАНИЕ')+'</div><canvas id="crash-canvas" width="860" height="410" aria-label="График растущего множителя"></canvas><div class="crash-overlay"><div class="crash-factor" id="crash-factor">'+(ui.crash?.active?ui.crash.factor.toFixed(2):'1.00')+'×</div><div class="crash-caption" id="crash-status">'+(ui.crash?.active?'Успей забрать награду до обвала':'Множитель начнёт расти после запуска')+'</div></div><div class="crash-horizon"><span>1.00×</span><span>2.00×</span><span>5.00×</span><span>10.00×</span></div><div class="crash-blast">✹<small>CRASHED</small></div></div>';
 if(id==='mines'){const m=ui.mines;return '<div class="game-stage mine-stage"><span class="stage-label">MINES / '+(m&&!m.ended?'РАУНД АКТИВЕН':'ОЖИДАНИЕ')+'</span><div class="mines-grid">'+Array.from({length:25},(_,i)=>{const safe=m?.opened.has(i),bomb=m?.mines.has(i)&&m.ended;return '<button aria-label="Клетка '+(i+1)+'" data-mine="'+i+'" class="mine-tile '+(safe?'revealed':'')+' '+(bomb?'exploded':'')+' '+(ui.lastMine===i?'mine-flip':'')+'" '+(!m||m.ended||safe?'disabled':'')+'><span class="mine-face">'+(safe?'💎':bomb?'💣':'✦')+'</span></button>'}).join('')+'</div><div class="mines-footnote">✦ Найди кристаллы · избегай мин</div></div><div class="metric-row"><span>Открыто клеток</span><strong>'+(m?.opened.size||0)+'/22</strong></div><div class="metric-row"><span>Текущий множитель</span><strong>'+mineMultiplier(m).toFixed(2)+'×</strong></div>';}
 if(id==='wheel'||id==='crazy'){const sectors=wheelFactors(id);return '<div class="game-stage spinner-stage '+id+'"><span class="stage-label"><span class="live-dot"></span> '+(id==='wheel'?'WHEEL':'CRAZY WHEEL')+' / DEMO</span><div class="wheel-assembly"><div class="wheel-arrow"></div><div class="wheel-rotator" id="main-wheel" style="transform:rotate('+ui.wheelAngle+'deg)">'+sectors.map((num,i)=>'<span class="wheel-sector-label" style="--sector:'+i+'">'+(num?num+'×':'0')+'</span>').join('')+'</div><div class="wheel-hub"><span>✦</span><small>SPIN</small></div></div><div class="spinner-note">Прокрути колесо — результат совпадёт с сектором под стрелкой</div></div>';}
 if(id==='double'){const seq=ui.doubleReel?.seq||Array.from({length:14},(_,i)=>rouletteSequence()[i]);return '<div class="game-stage double-stage"><span class="stage-label"><span class="live-dot"></span> DOUBLE / ЦВЕТОВАЯ РУЛЕТКА</span><div class="roulette-viewport"><div class="roulette-marker"></div><div class="roulette-track" id="double-track">'+seq.map((color,i)=>'<div class="roulette-cell '+color+'"><span>'+(color==='green'?'★':(i%14+1))+'</span></div>').join('')+'</div></div><div class="double-explainer">Красный ×2 · Чёрный ×2 · Зелёный ×14</div></div><div class="section-header" style="margin:15px 0 9px"><h2 style="font-size:13px">Выбери цвет</h2></div><div class="color-choices">'+[['red','Красный ×2'],['black','Чёрный ×2'],['green','Зелёный ×14']].map(([col,name])=>'<button data-color="'+col+'" class="btn '+col+' '+(ui.color===col?'active':'')+'" '+(ui.busy?'disabled':'')+'>'+name+'</button>').join('')+'</div>';}
 if(id==='defuse')return '<div class="game-stage defuse-stage '+(ui.defuseResult?.passed?'defuse-success':ui.defuseResult?'defuse-failed':'')+'"><span class="stage-label">DEFUSE / ВЫБЕРИ ОДИН ПРОВОД</span><div class="bomb-panel"><div class="bomb-display">'+(ui.defuseResult?(ui.defuseResult.passed?'SAFE':'ERROR'):'00:45')+'</div><span class="bomb-screw first"></span><span class="bomb-screw second"></span><div class="wire-row">'+['#ff5a73','#57baff','#55ebbd','#f4ca5e','#ae83ff'].map((col,i)=>'<button class="wire '+(ui.defuseResult?.wire===i?(ui.defuseResult.passed?'cut':'boom'):'')+'" data-wire="'+i+'" '+(!ui.defuseActive?'disabled':'')+' title="Провод '+(i+1)+'"><span style="background:'+col+'"></span></button>').join('')+'</div></div><span class="defuse-help">'+(ui.defuseActive?'Провода активны — выбери один':'Запусти раунд, чтобы активировать провода')+'</span></div>';
 if(id==='chicken')return '<div class="game-stage chicken-stage"><span class="stage-label">CHICKEN ROAD / '+(ui.chicken&&!ui.chicken.ended?'В ПУТИ':'ОЖИДАНИЕ')+'</span><div class="chicken-highway"><div class="road-stripe"></div><div class="chicken-track">'+Array.from({length:6},(_,i)=>'<div class="track-step '+(ui.chicken&&i<ui.chicken.step?'done':'')+' '+(ui.chicken&&i===ui.chicken.step&&!ui.chicken.ended?'active':'')+'">'+(ui.chicken&&i<ui.chicken.step?'✓':ui.chicken&&i===ui.chicken.step&&!ui.chicken.ended?'🐔':i===0?'🐔':'⚑')+'<small>×'+(1+i*.38+i*i*.09).toFixed(2)+'</small></div>').join('')+'</div></div><div class="stage-sub" style="text-align:center">'+(ui.chicken?'Пройдено: '+ui.chicken.step+' шагов':'6 полос · забирай награду в любой момент')+'</div></div>';
 return '<div class="game-stage battle-stage"><span class="stage-label"><span class="live-dot"></span> '+id.toUpperCase()+' / VIRTUAL MATCH</span><div class="battle-arena"><div class="fighter '+(ui.busy?'fighter-fight':'')+'"><span class="fighter-avatar">⚡</span><strong>YOU</strong><small>демо-игрок</small></div><div class="arena-center"><span>VS</span><small>'+(ui.busy?'РАУНД ИДЁТ':'НАЧНИ БИТВУ')+'</small></div><div class="fighter rival '+(ui.busy?'fighter-fight':'')+'"><span class="fighter-avatar">☄</span><strong>BOT</strong><small>виртуальный соперник</small></div></div></div>';
}
function mineMultiplier(m){if(!m)return 1;const n=m.opened.size;return 1+n*.26+n*n*.055;}
function gamePage(id){const x=g(id);if(!x)return notFound();const locked=ui.busy||(ui.crash?.active&&id==='crash');const activeMines=ui.mines&&!ui.mines.ended;const activeChicken=ui.chicken&&!ui.chicken.ended;return `${demoNote()}<div class="page-heading"><div><div class="eyebrow"><a href="#/">← Все режимы</a></div><h1>${ico[id]} ${x.name}</h1><div class="page-sub">${x.description}</div></div><span class="tag ${x.kind==='PVP'?'yellow':'green'}">${x.kind} • DEMO</span></div><div class="layout-2"><div class="panel">${gameStage(id)}${ui.lastGameResult?`<div class="demo-banner" style="margin:14px 0 0">${esc(ui.lastGameResult)}</div>`:''}<div class="section-header"><div><h2 style="font-size:15px">Последние результаты</h2></div><span class="tag">Локальная история</span></div><div class="recent-pills">${ui.latestNumbers.length?ui.latestNumbers.map(a=>`<span class="${a.success?'win':'lose'}">${esc(a.text)}</span>`).join(''):'<span>Пока нет сыгранных раундов</span>'}</div></div><div class="panel panel-highlight"><h2>Настройки игры</h2><p>${x.description} Используется только демонстрационная валюта.</p>${betMarkup()}${id==='crash'?`<div class="stage-actions"><button class="btn btn-primary" data-action="start-crash" ${locked?'disabled':''}>${ui.crash?.active?'Идёт раунд':'▶ Начать раунд'}</button><button class="btn btn-green" data-action="cash-crash" ${!ui.crash?.active?'disabled':''}>Забрать ×<span id="crash-btn-factor">${ui.crash?.factor.toFixed(2)||'1.00'}</span></button></div>`:''}${id==='mines'?`<div class="stage-actions"><button class="btn btn-primary" data-action="start-mines" ${activeMines?'disabled':''}>▶ Новая игра</button><button class="btn btn-green" data-action="cash-mines" ${!activeMines?'disabled':''}>Забрать ${fmt(ui.mines?ui.mines.bet*mineMultiplier(ui.mines):0)}</button></div>`:''}${id==='chicken'?`<div class="stage-actions"><button class="btn btn-primary" data-action="start-chicken" ${activeChicken?'disabled':''}>▶ Новая игра</button><button class="btn btn-green" data-action="step-chicken" ${!activeChicken?'disabled':''}>Шаг вперёд →</button><button class="btn btn-soft" data-action="cash-chicken" ${!activeChicken||!ui.chicken?.step?'disabled':''}>Забрать</button></div>`:''}${['wheel','crazy','double','jackpot','battles','defuse'].includes(id)?`<button class="btn btn-primary wide" style="margin-top:12px" data-action="play-game" data-game-id="${id}" ${ui.busy?'disabled':''}>${ui.busy?'Раунд идёт…':id==='defuse'?'▶ Запустить игру':'▶ Играть'}</button>`:''}<div class="section-divider"></div><div class="metric-row"><span>Виртуальный баланс</span><strong>${fmt(state.balance)}</strong></div><div class="metric-row"><span>Механика</span><strong>Упрощённая демо</strong></div><p class="hint">Результаты моделируются на клиенте через Math.random; они не являются provably fair. Этот прототип не подходит для ставок на реальные деньги.</p><button class="btn btn-soft wide" data-action="payment">＋ Пополнить демо-баланс</button></div></div>`;}
function notFound(){return `<div class="panel empty"><div class="empty-icon">🔎</div><strong>Раздел не найден</strong><p>Попробуй вернуться на главную.</p><a href="#/" class="btn btn-primary">На главную</a></div>`;}
function modal(){if(!ui.modal)return '';const m=ui.modal;let content='';
 if(m.type==='login')content=`<div class="modal-emoji">👤</div><h2>Демо-аккаунт</h2><p>Вход в этом прототипе не использует Steam, Google и другие сервисы. Никаких логинов или паролей вводить не нужно.</p><button class="btn btn-primary wide" data-action="demo-login">${state.loggedIn?'Продолжить':'Войти как Demo Player'}</button>`;
 else if(m.type==='promo')content=`<div class="modal-emoji">🎁</div><h2>Активация промокода</h2><p>Введи <strong>DEMO2026</strong>, чтобы однократно получить +300 виртуальных кредитов.</p><form data-form="promo"><label class="label">Промокод</label><div class="form-row"><input class="field" name="code" placeholder="DEMO2026" maxlength="24" required/><button class="btn btn-green" type="submit">OK →</button></div></form>`;
 else if(m.type==='drop')content=`<div class="drop-celebration ${m.item.klass||'rare'}">${skinVisual(m.item,'reward-skin')}<span class="reward-aura"></span></div><span class="eyebrow">НОВЫЙ ПРЕДМЕТ</span><h2>${esc(m.item.name)}</h2><p>Поздравляем! Предмет добавлен в виртуальный инвентарь. Оценочная демо-стоимость — <strong>${fmt(m.item.price)}</strong>.</p><div class="stage-actions"><button class="btn btn-soft" data-action="inventory">В инвентарь</button><button class="btn btn-primary" data-action="modal-close">Продолжить</button></div>`;
 else if(m.type==='reset')content=`<div class="modal-emoji">⚠️</div><h2>Сбросить прогресс?</h2><p>Виртуальный баланс, инвентарь и история будут возвращены к первоначальным значениям. Это действие необратимо для локальных данных.</p><div class="stage-actions"><button class="btn btn-soft" data-action="modal-close">Отмена</button><button class="btn btn-danger" data-action="reset-confirm">Сбросить</button></div>`;
 else content=`<div class="modal-emoji">ℹ️</div><h2>${esc(m.heading||'Информация')}</h2><p>${esc(m.text||'Эта функция будет доступна после подключения внешнего сервера.')}</p><button class="btn btn-primary wide" data-action="modal-close">Понятно</button>`;
 return `<div class="modal-backdrop" id="modal-backdrop"><div role="dialog" aria-modal="true" aria-label="${m.type==='drop'?'Получен предмет':'Диалоговое окно'}" class="modal"><button class="close" aria-label="Закрыть" data-action="modal-close">✕</button>${content}</div></div>`;}
function render(){let p=currentPath().split('?')[0];let body='';if(p==='/')body=home();else if(p==='/cases')body=caseCatalogue();else if(/^\/cases\/[^/]+$/.test(p))body=c(p.split('/')[2])?caseDetail(c(p.split('/')[2])):notFound();else if(/^\/games\/[^/]+$/.test(p))body=gamePage(p.split('/')[2]);else if(p==='/profile')body=profile();else if(p==='/bonuses')body=bonuses();else if(p==='/inventory')body=inventory();else if(p==='/payment')body=payment();else if(p==='/fair')body=fair();else if(p==='/history')body=historyPage();else if(p==='/leaderboard')body=leaderboard();else body=notFound();document.getElementById('app').innerHTML=`<div class="app-shell">${header()}${ticker()}<main class="main"><div class="container">${body}</div></main>${footer()}<button class="floating-help" title="Об этом демо" data-action="help">?</button></div>${modal()}`;document.title=(p==='/'?'Главная':p.split('/').pop().toUpperCase())+' — CSFAIL DEMO';}
function openModal(data){ui.modal=data;render();}
function closeModal(){ui.modal=null;render();}
function redeemPromo(code){const val=String(code||'').trim().toUpperCase();if(val!=='DEMO2026'){toast('Промокод не найден. Попробуйте DEMO2026.','error');return;}if(state.promoUsed){toast('Этот код уже использован.','error');return;}state.promoUsed=true;win(300);record('Промокод DEMO2026',300);ui.modal=null;render();toast('Промокод активирован: +300 ₽ демо!', 'success');}
function daily(){if(state.dailyDate===today()){toast('Сегодня бонус уже получен.','error');return;}state.dailyDate=today();win(150);record('Ежедневный бонус',150);render();toast('Начислено 150 ₽ виртуального баланса!','success');}
function prefersReducedMotion(){return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}
function animateTrack(el,winningIndex,duration,offset=0){
 if(!el||!el.firstElementChild)return;
 const gap=parseFloat(getComputedStyle(el).gap)||0;
 const stride=el.firstElementChild.getBoundingClientRect().width+gap;
 const viewport=el.parentElement.getBoundingClientRect().width;
 const target=Math.max(0,winningIndex*stride+stride/2-viewport/2+offset);
 if(el.animate)el.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d('+(-target)+'px,0,0)'}],{duration,easing:'cubic-bezier(.10,.68,.11,1)',fill:'forwards'});
 else el.style.transform='translate3d('+(-target)+'px,0,0)';
}
function openCase(id){
 if(ui.busy)return;
 const cs=c(id);if(!cs||!spend(cs.price))return;
 const items=lootForCase(cs);
 const weights=items.map(it=>it.klass==='common'?15:it.klass==='rare'?4.5:.65);let roll=Math.random()*weights.reduce((a,b)=>a+b,0),ind=0;for(;ind<items.length-1;ind++){roll-=weights[ind];if(roll<0)break;}
 const reward={...items[ind],uuid:Date.now().toString(36)+Math.random().toString(36).slice(2),caseName:cs.name};
 const winningIndex=49, duration=prefersReducedMotion()?350:5400;
 const reel=Array.from({length:58},()=>pick(items));reel[winningIndex]=reward;
 ui.caseRoll={id,reel,winningIndex};ui.busy=true;
 record('Открытие кейса: '+cs.name,-cs.price);render();
 requestAnimationFrame(()=>animateTrack(document.getElementById('case-reel-track'),winningIndex,duration));
 toast('Рулетка запущена · '+cs.name);
 setTimeout(()=>{
   if(ui.caseRoll?.id!==id)return;
   state.inventory.unshift(reward);save();record('Награда из кейса: '+reward.name,0);
   ui.caseRoll=null;ui.busy=false;ui.modal={type:'drop',item:reward};render();
   toast('Получен виртуальный скин: '+reward.name,'success');
 },duration+150);
}
function addBalance(){const input=document.getElementById('amount');const sum=Math.round(Number(input?.value||ui.amount));if(!Number.isFinite(sum)||sum<10||sum>100000){toast('Укажите сумму от 10 до 100 000','error');return;}ui.amount=sum;win(sum);record('Виртуальное пополнение',sum);render();toast(`Зачислено ${fmt(sum)} демо-баланса!`,'success');}
function getBet(){let v=Math.round(Number(document.getElementById('game-bet')?.value||ui.activeBet));if(v<10||v>100000||!Number.isFinite(v)){toast('Ставка от 10 до 100 000 виртуальных кредитов.','error');return null;}ui.activeBet=v;return v;}
function setLast(text,success){ui.lastGameResult=text;ui.latestNumbers.unshift({text,success});ui.latestNumbers=ui.latestNumbers.slice(0,8);}
function drawCrash(factor){
 const canvas=document.getElementById('crash-canvas');if(!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
 const pad=34;
 ctx.lineWidth=1;ctx.strokeStyle='rgba(140,168,230,.11)';
 for(let i=0;i<12;i++){const x=pad+(w-2*pad)*i/11;ctx.beginPath();ctx.moveTo(x,18);ctx.lineTo(x,h-20);ctx.stroke();}
 for(let i=0;i<6;i++){const y=25+(h-52)*i/5;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();}
 const progress=Math.min(.95,Math.log(Math.max(1,factor))/Math.log(12));
 const xe=pad+(w-2*pad)*Math.max(.04,progress),ye=h-48-(h-115)*Math.pow(progress,.52);
 ctx.beginPath();ctx.moveTo(pad,h-48);for(let t=.01;t<=progress;t+=.009){const x=pad+(w-2*pad)*t,y=h-48-(h-115)*Math.pow(t,.52);ctx.lineTo(x,y);}ctx.lineTo(xe,ye);
 const area=ctx.createLinearGradient(0,ye,0,h);area.addColorStop(0,'rgba(79,229,196,.29)');area.addColorStop(1,'rgba(79,229,196,0)');ctx.lineTo(xe,h-48);ctx.closePath();ctx.fillStyle=area;ctx.fill();
 ctx.beginPath();ctx.moveTo(pad,h-48);for(let t=.01;t<=progress;t+=.009){ctx.lineTo(pad+(w-2*pad)*t,h-48-(h-115)*Math.pow(t,.52));}ctx.lineTo(xe,ye);ctx.lineWidth=6;ctx.strokeStyle='rgba(60,241,201,.12)';ctx.shadowBlur=22;ctx.shadowColor='#44efd0';ctx.stroke();ctx.shadowBlur=0;ctx.lineWidth=3;ctx.strokeStyle='#5ef6cf';ctx.stroke();
 ctx.beginPath();ctx.arc(xe,ye,7,0,2*Math.PI);ctx.fillStyle='#bcfff1';ctx.shadowColor='#5afade';ctx.shadowBlur=26;ctx.fill();ctx.shadowBlur=0;
}
function startCrash(){
 if(ui.crash?.active||ui.busy)return;
 const bet=getBet();if(bet===null||!spend(bet))return;
 record('Crash: демо-ставка',-bet);
 const crashAt=Math.max(1.07,Math.min(12,Math.exp(Math.random()*1.78)));
 const cr={active:true,bet,factor:1,crashAt,start:performance.now(),raf:0};
 ui.crash=cr;ui.crashBurst=false;ui.lastGameResult='';render();
 const step=(now)=>{
   if(ui.crash!==cr||!cr.active)return;
   cr.factor=Math.max(1,Math.exp((now-cr.start)/1000*.23));
   const value=document.getElementById('crash-factor');if(value)value.textContent=cr.factor.toFixed(2)+'×';
   const btn=document.getElementById('crash-btn-factor');if(btn)btn.textContent=cr.factor.toFixed(2);
   drawCrash(cr.factor);
   if(cr.factor>=cr.crashAt){
     cr.active=false;ui.crash=null;ui.crashBurst=true;
     setLast('Crash: ×'+cr.factor.toFixed(2)+' — взрыв',false);record('Crash: проигрыш',0);render();
     toast('CRASH! Множитель обвалился','error');
     setTimeout(()=>{if(ui.crashBurst){ui.crashBurst=false;if(currentPath()==='/games/crash')render();}},1100);
   }else cr.raf=requestAnimationFrame(step);
 };
 cr.raf=requestAnimationFrame(step);
}
function cashCrash(){
 const cr=ui.crash;if(!cr?.active)return;
 cr.active=false;cancelAnimationFrame(cr.raf);
 const gain=Math.floor(cr.bet*cr.factor);win(gain);record('Crash: выигрыш',gain);
 setLast('Crash: забрано ×'+cr.factor.toFixed(2)+' (+'+fmt(gain)+')',true);
 ui.crash=null;ui.crashBurst=false;render();toast('Забрано +'+fmt(gain)+' виртуальных кредитов','success');
}
function startMines(){if(ui.mines&&!ui.mines.ended)return;const bet=getBet();if(bet===null||!spend(bet))return;const mines=new Set();while(mines.size<3)mines.add(rand(0,24));ui.mines={bet,mines,opened:new Set(),ended:false};ui.lastMine=-1;ui.lastGameResult='';record('Mines: демо-ставка',-bet);render();}
function clickMine(i){const m=ui.mines;if(!m||m.ended||m.opened.has(i)||i<0||i>24)return;ui.lastMine=i;if(m.mines.has(i)){m.ended=true;setLast('Mines: мина — раунд проигран',false);record('Mines: проигрыш',0);render();toast('Мина! Раунд завершён','error');return;}m.opened.add(i);if(m.opened.size>=22){cashMines();return;}render();}
function cashMines(){const m=ui.mines;if(!m||m.ended)return;m.ended=true;let gain=Math.floor(m.bet*mineMultiplier(m));win(gain);record('Mines: выигрыш',gain);setLast(`Mines: ${m.opened.size} клеток (+${fmt(gain)})`,true);render();toast(`Выигрыш +${fmt(gain)}`, 'success');}
function startChicken(){if(ui.chicken&&!ui.chicken.ended)return;const bet=getBet();if(bet===null||!spend(bet))return;record('Chicken Road: демо-ставка',-bet);ui.chicken={bet,step:0,ended:false};ui.lastGameResult='';render();}
function stepChicken(){const ch=ui.chicken;if(!ch||ch.ended)return;if(Math.random()<.22){ch.ended=true;setLast(`Chicken Road: ${ch.step} шагов — проигрыш`,false);record('Chicken Road: проигрыш',0);render();toast('Опасность на дороге!','error');return;}ch.step++;if(ch.step===6){cashChicken();return;}render();}
function cashChicken(){const ch=ui.chicken;if(!ch||ch.ended||ch.step<1)return;ch.ended=true;const gain=Math.floor(ch.bet*(1+ch.step*.38+ch.step*ch.step*.09));win(gain);record('Chicken Road: выигрыш',gain);setLast(`Chicken Road: ${ch.step} шагов (+${fmt(gain)})`,true);render();toast(`Забрано +${fmt(gain)}`,'success');}
function playGame(id){
 if(ui.busy||ui.crash?.active)return;
 if(id==='defuse'&&ui.defuseActive){toast('Сначала выбери активный провод','error');return;}
 const bet=getBet();if(bet===null||!spend(bet))return;
 const chosenColor=ui.color;
 ui.busy=true;ui.lastGameResult='';record(g(id).name+': демо-ставка',-bet);
 if(id==='defuse'){ui.defuseActive=true;ui.defuseBet=bet;ui.defuseResult=null;ui.busy=false;render();toast('Выбери один из пяти проводов');return;}
 let factor=0,result='',selectedIndex=0,targetRotation=0,duration=prefersReducedMotion()?350:4400;
 if(id==='wheel'||id==='crazy'){
   const factors=wheelFactors(id);selectedIndex=rand(0,factors.length-1);factor=factors[selectedIndex];
   const needed=((360-selectedIndex*360/factors.length-ui.wheelAngle%360)%360+360)%360;
   targetRotation=ui.wheelAngle+360*6+needed;
 }else if(id==='double'){
   result=pick(rouletteSequence());
   const seq=Array.from({length:60},()=>pick(rouletteSequence()));selectedIndex=51;seq[selectedIndex]=result;ui.doubleReel={seq,selectedIndex};
 }
 render();
 if(id==='wheel'||id==='crazy'){
   const disc=document.getElementById('main-wheel');
   if(disc){if(disc.animate)disc.animate([{transform:'rotate('+ui.wheelAngle+'deg)'},{transform:'rotate('+targetRotation+'deg)'}],{duration,easing:'cubic-bezier(.12,.62,.08,1)',fill:'forwards'});else disc.style.transform='rotate('+targetRotation+'deg)';}
   ui.wheelAngle=targetRotation;
 }else if(id==='double')requestAnimationFrame(()=>animateTrack(document.getElementById('double-track'),selectedIndex,duration));
 setTimeout(()=>{
   let gain=0,text='';
   if(id==='double'){gain=result===chosenColor?bet*(result==='green'?14:2):0;text='Double: '+({red:'Красный',black:'Чёрный',green:'Зелёный'}[result]);ui.doubleReel=null;}
   else if(id==='wheel'||id==='crazy'){gain=Math.floor(bet*factor);text=g(id).name+': ×'+factor;}
   else if(id==='jackpot'){gain=Math.random()<.36?Math.floor(bet*2.6):0;text='Jackpot: '+(gain?'победа над ботами':'победили боты');}
   else if(id==='battles'){gain=Math.random()<.46?bet*2:0;text='PVP Battle: '+(gain?'твой персонаж победил':'бот победил');}
   if(gain>0)win(gain);record(g(id).name+': '+(gain?'выигрыш':'проигрыш'),gain);
   setLast(text+' — '+(gain?'+'+fmt(gain):'без выигрыша'),gain>0);
   ui.busy=false;render();toast(gain?'Победа! +'+fmt(gain):'Раунд завершён',gain?'success':'error');
 },['wheel','crazy','double'].includes(id)?duration+180:prefersReducedMotion()?450:2800);
}
function cutWire(i){
 if(!ui.defuseActive||i<0||i>4)return;
 const bet=ui.defuseBet;ui.defuseActive=false;const pass=rand(0,4)===i;const gain=pass?bet*4:0;
 ui.defuseResult={wire:i,passed:pass};if(gain)win(gain);
 record('Defuse: '+(pass?'выигрыш':'проигрыш'),gain);
 setLast('Defuse: '+(pass?'успешно обезврежено! +'+fmt(gain):'бомба взорвалась'),pass);
 render();toast(pass?'Бомба обезврежена!':'Неверный провод!',pass?'success':'error');
}
function handleAction(action,el){
 if(action==='menu'){ui.menu=!ui.menu;render();}
 else if(action==='profile'){go('/profile');}
 else if(action==='payment'){ui.modal=null;go('/payment');}
 else if(action==='inventory'){ui.modal=null;go('/inventory');}
 else if(action==='login'){openModal({type:'login'});}
 else if(action==='demo-login'){state.loggedIn=true;save();closeModal();toast('Вы вошли в демо-аккаунт.','success');}
 else if(action==='promo-modal'){openModal({type:'promo'});}
 else if(action==='modal-close'){closeModal();}
 else if(action==='daily'){daily();}
 else if(action==='add-balance'){addBalance();}
 else if(action==='start-crash'){startCrash();}
 else if(action==='cash-crash'){cashCrash();}
 else if(action==='start-mines'){startMines();}
 else if(action==='cash-mines'){cashMines();}
 else if(action==='start-chicken'){startChicken();}
 else if(action==='step-chicken'){stepChicken();}
 else if(action==='cash-chicken'){cashChicken();}
 else if(action==='play-game'){playGame(el.dataset.gameId);}
 else if(action==='help'){openModal({type:'info',heading:'О демонстрационном проекте',text:'Это самостоятельный сайт-прототип без настоящих платежей, Steam-авторизации и игры на деньги. Его можно запускать локально и развивать дальше.'});}
 else if(action==='info-vip'){openModal({type:'info',heading:'VIP Club',text:'Карточка раздела VIP. Для production нужно разработать уровни, бонусы и серверную систему начисления.'});}
 else if(action==='reset'){openModal({type:'reset'});}
 else if(action==='reset-confirm'){state={...defaults,inventory:[],history:[]};if(ui.crash?.raf)cancelAnimationFrame(ui.crash.raf);ui={modal:null,filter:'all',activeBet:100,color:'red',method:'card',amount:500,menu:false,spinning:false,wheelAngle:0,crash:null,mines:null,chicken:null,lastGameResult:'',latestNumbers:[],busy:false,caseRoll:null,doubleReel:null,lastMine:-1,defuseResult:null,crashBurst:false};clearInterval(crashTimer);save();go('/');toast('Демо-прогресс сброшен.','success');}
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-action]');if(b){e.preventDefault();handleAction(b.dataset.action,b);return;}
 const f=e.target.closest('[data-filter]');if(f){ui.filter=f.dataset.filter;render();return;}
 const op=e.target.closest('[data-case-open]');if(op){openCase(op.dataset.caseOpen);return;}
 const sell=e.target.closest('[data-sell]');if(sell){const index=Number(sell.dataset.sell);const item=state.inventory[index];if(!item)return;state.inventory.splice(index,1);win(item.price);record('Продажа: '+item.name,item.price);render();toast('Предмет продан за '+fmt(item.price),'success');return;}
 const amount=e.target.closest('[data-amount]');if(amount){ui.amount=Number(amount.dataset.amount);render();return;}
 const method=e.target.closest('[data-method]');if(method){ui.method=method.dataset.method;render();return;}
 const bet=e.target.closest('[data-bet]');if(bet){ui.activeBet=Number(bet.dataset.bet);render();return;}
 const color=e.target.closest('[data-color]');if(color){ui.color=color.dataset.color;render();return;}
 const mine=e.target.closest('[data-mine]');if(mine){clickMine(Number(mine.dataset.mine));return;}
 const wire=e.target.closest('[data-wire]');if(wire){cutWire(Number(wire.dataset.wire));return;}
 if(e.target.id==='modal-backdrop'){closeModal();return;}
});
document.addEventListener('submit',e=>{const form=e.target.closest('[data-form="promo"]');if(form){e.preventDefault();redeemPromo(form.querySelector('[name="code"]')?.value);}});
document.addEventListener('change',e=>{if(e.target.id==='amount'){let x=Number(e.target.value);if(Number.isFinite(x)&&x>=10&&x<=100000){ui.amount=Math.round(x);render();}}if(e.target.id==='game-bet'){const x=Number(e.target.value);if(Number.isFinite(x)&&x>=10&&x<=100000)ui.activeBet=Math.round(x);}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.modal)closeModal();});
window.addEventListener('hashchange',()=>{ui.menu=false;ui.modal=null;ui.lastGameResult='';ui.latestNumbers=[];ui.mines=null;ui.chicken=null;ui.defuseActive=false;render();window.scrollTo(0,0);});
if(!location.hash)location.hash='#/';render();
})();
