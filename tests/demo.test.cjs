'use strict';
/* Zero-dependency integration checks for the browser-only virtual demo. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname,'..');
const source = fs.readFileSync(path.join(root,'app.js'),'utf8');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const css = fs.readFileSync(path.join(root,'experience.css'),'utf8');
const studio = fs.readFileSync(path.join(root,'studio.css'),'utf8');

function mount(previousStorage=null){
  const timers=[],frames=[],app={innerHTML:''};
  const toast={append(){}};
  let persisted=previousStorage;
  const location={hash:'#/'};
  const window={matchMedia(){return {matches:true}},addEventListener(){},scrollTo(){}};
  const document={
    addEventListener(){},
    getElementById(id){if(id==='app')return app;if(id==='toast-area')return toast;return null;},
    createElement(){return {remove(){},className:'',textContent:''};}
  };
  const probe={};
  const suffix="if(!location.hash)location.hash='#/';render();\n})();";
  assert.ok(source.includes(suffix),'test harness insertion point');
  const script=source.replace(suffix,"if(!location.hash)location.hash='#/';render();\nwindow.__probe={state,ui,render,openCase,playGame,startCrash,cashCrash,startMines,clickMine,cashMines,startChicken,gameStage,lootForCase,wheelFactors,cutWire,caseChances,pickWeightedIndex,selectedUpgrade,upgradeChance,runUpgrade,upgradePage,runFairSimulation,spend,caseCatalogue,arena,games,finishCase};\n})();");
  const sandbox={
    window,document,location,localStorage:{
      getItem(){return persisted},
      setItem(k,v){persisted=v}
    },
    performance:{now(){return 0}},
    requestAnimationFrame(fn){frames.push(fn);return frames.length;},
    cancelAnimationFrame(){},
    setTimeout(fn,ms){timers.push({fn,ms});return timers.length;},
    setInterval(){return 1;},clearInterval(){},
    getComputedStyle(){return {gap:'12px'}},
    console
  };
  vm.runInNewContext(script,sandbox,{filename:'app.js',timeout:3500});
  const settle=()=>{
    const pending=timers.splice(0);
    for(const task of pending){if(task.ms>=300)task.fn();}
  };
  return {api:window.__probe,app,location,settle,frames,storage:()=>persisted};
}

test('entrypoint loads both style layers and application script',()=>{
 assert.match(html,/styles\.css/);
 assert.match(html,/experience\.css/);
 assert.match(html,/studio\.css/);
 assert.match(studio,/\.launch-hero/);
 assert.match(studio,/\.upgrade-workshop/);
 assert.match(html,/app\.js/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/\.case-reel-viewport/);
 assert.match(css,/\.wheel-rotator/);
 assert.match(css,/\.crash-stage/);
});
test('initial UI renders case illustrations and real skin asset URLs',()=>{
 const {app,api}=mount();
 assert.match(app.innerHTML,/skin-visual/);
 assert.match(app.innerHTML,/raw\.githubusercontent\.com/);
 assert.equal(api.wheelFactors('wheel').length,12);
 assert.equal(api.wheelFactors('crazy').length,12);
});
test('case debits once, locks during roll, then adds exactly one collectible',()=>{
 const {api,settle}=mount();
 const before=api.state.balance;
 api.openCase('eco');
 assert.equal(api.ui.busy,true);
 assert.equal(api.state.balance,before-49);
 assert.equal(api.ui.caseRoll.reel.length,58);
 assert.ok(api.ui.caseRoll.reel[49].asset);
 api.openCase('eco');
 assert.equal(api.state.balance,before-49);
 settle();
 assert.equal(api.state.inventory.length,1);
 assert.equal(api.ui.busy,false);
 assert.ok(api.state.inventory[0].uuid);
});
test('wheel and double use reel, settle outcomes and release busy flag',()=>{
 const {api,settle}=mount();
 api.playGame('wheel');
 assert.equal(api.ui.busy,true);
 assert.ok(api.ui.wheelAngle>=2160);
 settle();
 assert.equal(api.ui.busy,false);
 assert.ok(api.ui.latestNumbers[0].text.includes('Wheel'));
 api.playGame('double');
 assert.equal(api.ui.doubleReel.seq.length,60);
 assert.equal(api.ui.busy,true);
 settle();
 assert.equal(api.ui.doubleReel,null);
 assert.equal(api.ui.busy,false);
});
test('crash allows one active round and cashout',()=>{
 const {api}=mount();
 api.startCrash();
 assert.equal(api.ui.crash.active,true);
 const debit=api.state.balance;
 api.startCrash();
 assert.equal(api.state.balance,debit);
 api.cashCrash();
 assert.equal(api.ui.crash,null);
 assert.match(api.ui.lastGameResult,/забрано/);
});
test('mines reveal safe cell and cash out demo credits',()=>{
 const {api}=mount();
 api.startMines();
 assert.ok(api.ui.mines);
 const cell=Array.from({length:25},(_,i)=>i).find(i=>!api.ui.mines.mines.has(i));
 api.clickMine(cell);
 assert.equal(api.ui.mines.opened.size,1);
 api.cashMines();
 assert.equal(api.ui.mines.ended,true);
 assert.match(api.ui.lastGameResult,/Mines/);
});
test('every animated stage has expected semantic structural element',()=>{
 const {api}=mount();
 const expectations={
  crash:'crash-canvas',mines:'mines-grid',wheel:'wheel-rotator',
  crazy:'wheel-rotator',double:'roulette-viewport',chicken:'chicken-track',
  defuse:'bomb-panel',battles:'battle-arena',jackpot:'battle-arena'
 };
 for(const [id,expected] of Object.entries(expectations))
  assert.ok(api.gameStage(id).includes(expected),id+' stage missing '+expected);
});


test('NOVADROP uses honest routes, new brand and ten fully declared modes',()=>{
 const {api,app,location}=mount();
 assert.match(app.innerHTML,/NOVADROP/);
 assert.match(app.innerHTML,/SEASON ZERO/);
 assert.doesNotMatch(app.innerHTML,/онлайн\*/);
 assert.equal(api.games.length,10);
 location.hash='#/arena';api.render();
 assert.match(app.innerHTML,/Upgrade Lab/);
 assert.match(app.innerHTML,/Игровая арена/);
});
test('case rarity weights sum to 100% and the corresponding catalogue exposes odds',()=>{
 const {api,location,app}=mount();
 const items=api.lootForCase({id:'eco',price:49,name:'Эко раунд'});
 const odds=api.caseChances(items);
 assert.equal(items.length,30);
 assert.ok(Math.abs(odds.reduce((a,b)=>a+b,0)-100)<1e-8);
 assert.ok(Math.max(...odds)>Math.min(...odds));
 location.hash='#/cases/eco';api.render();
 assert.match(app.innerHTML,/Шанс \d+\.\d+%/);
 api.openCase('eco');
 assert.match(app.innerHTML,/Пропустить анимацию/);
});
test('favorite cases and query/filter controls are working client-side',()=>{
 const {api,location}=mount();
 location.hash='#/cases';
 assert.match(api.caseCatalogue(),/case-search/);
 api.state.favorites.push('eco');
 api.ui.favoritesOnly=true;
 const doc=api.caseCatalogue();
 assert.match(doc,/Эко раунд/);
 assert.doesNotMatch(doc,/Knife Party/);
 api.ui.favoritesOnly=false;
 api.ui.caseQuery='sakura';
 assert.match(api.caseCatalogue(),/Sakura/);
 assert.doesNotMatch(api.caseCatalogue(),/Knife Party/);
});
test('skipping a case animation awards a single prize and timer cannot duplicate it',()=>{
 const {api,settle}=mount();
 api.openCase('eco');
 assert.equal(api.ui.caseRoll.reward.asset.length>0,true);
 api.finishCase();
 assert.equal(api.state.inventory.length,1);
 settle();
 assert.equal(api.state.inventory.length,1);
 assert.equal(api.ui.busy,false);
});
test('Upgrade Lab selects and settles an inventory transformation',()=>{
 const {api,settle,location,app}=mount();
 api.openCase('eco');settle();
 assert.equal(api.state.inventory.length,1);
 const options=api.selectedUpgrade();
 assert.ok(options.item&&options.target);
 assert.ok(api.upgradeChance(options.item,options.target)>=1);
 location.hash='#/games/upgrade';api.render();
 assert.match(app.innerHTML,/ВЕРОЯТНОСТЬ/);
 api.runUpgrade();
 assert.equal(api.ui.busy,true);
 assert.ok(api.ui.upgradeRoll);
 settle();
 assert.equal(api.ui.busy,false);
 assert.ok(api.ui.modal&&api.ui.modal.type==='upgrade');
 assert.ok(api.state.inventory.length===0||api.state.inventory.length===1);
});
test('transparent fairness simulation counts 10000 outcomes',()=>{
 const {api}=mount();
 api.runFairSimulation();
 assert.equal(api.ui.fairSim.total,10000);
 assert.equal(api.ui.fairSim.common+api.ui.fairSim.rare+api.ui.fairSim.legendary,10000);
});
test('voluntary virtual daily limit prevents further spending',()=>{
 const {api}=mount();
 api.state.dailyLimit=100;
 const before=api.state.balance;
 assert.equal(api.spend(80),true);
 assert.equal(api.spend(30),false);
 assert.equal(api.state.balance,before-80);
});


test('case pending transaction survives reload and awards exactly once',()=>{
 const first=mount();
 first.api.openCase('eco');
 const winner=first.api.ui.caseRoll.reward;
 assert.ok(first.api.state.pendingCase&&winner.uuid);
 const recovered=mount(first.storage());
 assert.equal(recovered.api.state.pendingCase,null);
 assert.equal(recovered.api.state.inventory.length,1);
 assert.equal(recovered.api.state.inventory[0].uuid,winner.uuid);
 const recoveredAgain=mount(recovered.storage());
 assert.equal(recoveredAgain.api.state.inventory.length,1);
});
