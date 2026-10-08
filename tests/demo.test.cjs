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

function mount(){
  const timers=[],frames=[],app={innerHTML:''};
  const toast={append(){}};
  let persisted=null;
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
  const script=source.replace(suffix,"if(!location.hash)location.hash='#/';render();\nwindow.__probe={state,ui,render,openCase,playGame,startCrash,cashCrash,startMines,clickMine,cashMines,startChicken,gameStage,lootForCase,wheelFactors,cutWire};\n})();");
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
  return {api:window.__probe,app,location,settle,frames};
}

test('entrypoint loads both style layers and application script',()=>{
 assert.match(html,/styles\.css/);
 assert.match(html,/experience\.css/);
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
