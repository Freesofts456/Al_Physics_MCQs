var $=function(i){return document.getElementById(i)};
var sel={},count=10,pool=[],idx=0,answers=[],done=false;
function show(id){["start","quiz","paper","res"].forEach(function(s){$(s).classList.toggle("hide",s!==id)});window.scrollTo(0,0)}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function buildStart(){
  T.forEach(function(n,i){sel[i]=true;var b=document.createElement("button");b.className="chip";b.textContent=n;b.setAttribute("aria-pressed","true");
    b.onclick=function(){sel[i]=!sel[i];b.setAttribute("aria-pressed",sel[i]);upd()};$("topics").appendChild(b)});
  [5,10,20].forEach(function(c){var b=document.createElement("button");b.className="chip";b.textContent=c+" ප්‍රශ්න";b.setAttribute("aria-pressed",c===10);
    b.onclick=function(){count=c;[].forEach.call($("counts").children,function(x){x.setAttribute("aria-pressed",x===b)});upd()};$("counts").appendChild(b)});
  upd();
}
function avail(){return Q.filter(function(q){return sel[q.t]})}
function upd(){var n=avail().length;$("go").disabled=n===0;$("avail").textContent=n?"තෝරාගත් පාඩම්වල ප්‍රශ්න "+n+"ක් තිබේ.":"අවම වශයෙන් එක් පාඩමක් තෝරන්න."}
function start(list){pool=shuffle(list).slice(0,count);idx=0;answers=[];show("quiz");render()}
function render(){
  var q=pool[idx];done=false;
  $("pos").textContent="ප්‍රශ්නය "+(idx+1)+" / "+pool.length;$("tp").textContent=T[q.t];
  $("prog").style.width=(idx/pool.length*100)+"%";$("qt").textContent=q.q;$("exp").innerHTML="";
  $("next").disabled=true;$("next").textContent=idx===pool.length-1?"ප්‍රතිඵල බලන්න":"ඊළඟ ප්‍රශ්නය";
  var box=$("opts");box.innerHTML="";
  q.o.forEach(function(t,i){var b=document.createElement("button");b.className="opt";
    b.innerHTML='<span class="n">'+(i+1)+'</span><span></span>';b.lastChild.textContent=t;
    b.onclick=function(){pick(i)};box.appendChild(b)});
}
function pick(i){
  if(done)return;done=true;var q=pool[idx];answers.push(i);
  [].forEach.call($("opts").children,function(b,k){b.disabled=true;if(k===q.a)b.classList.add("ok");else if(k===i)b.classList.add("bad")});
  var ok=i===q.a;$("exp").innerHTML='<div class="exp'+(ok?'':' bad')+'"><strong></strong> <span></span></div>';
  $("exp").querySelector("strong").textContent=ok?"නිවැරදියි!":"වැරදියි. නිවැරදි පිළිතුර: "+(q.a+1)+".";
  $("exp").querySelector("span").textContent=q.e;$("next").disabled=false;$("next").focus();
}
$("next").onclick=function(){if(idx<pool.length-1){idx++;render()}else finish()};
function finish(){
  var right=0,per={};
  pool.forEach(function(q,i){per[q.t]=per[q.t]||[0,0];per[q.t][1]++;if(answers[i]===q.a){right++;per[q.t][0]++}});
  $("sc").textContent=right+" / "+pool.length;
  var p=Math.round(right/pool.length*100);
  $("pc").textContent=p+"% | "+(p>=75?"ඉතා හොඳයි!":p>=50?"හොඳයි, තව පුහුණු වන්න.":"තව පුහුණුවක් අවශ්‍යයි, පහත පැහැදිලි කිරීම් කියවන්න.");
  $("tb").innerHTML="";
  Object.keys(per).forEach(function(k){var r=document.createElement("div");r.className="row";
    r.innerHTML='<div><div class="meta"><span></span><span></span></div><div class="bar"><i></i></div></div><span></span>';
    r.querySelector(".meta span").textContent=T[k];r.querySelector(".meta span:last-child").textContent=per[k][0]+" / "+per[k][1];
    r.querySelector(".bar i").style.width=(per[k][0]/per[k][1]*100)+"%";$("tb").appendChild(r)});
  var w=$("wrong");w.innerHTML="";var wl=[];
  pool.forEach(function(q,i){if(answers[i]!==q.a){wl.push(q);var d=document.createElement("div");d.className="rev";
    d.innerHTML='<p><strong></strong></p><p></p><p></p>';
    d.children[0].firstChild.textContent=q.q;d.children[1].textContent="ඔබේ පිළිතුර: "+(answers[i]===undefined?"පිළිතුරක් නැත":(answers[i]+1)+". "+q.o[answers[i]]);
    d.children[2].textContent="නිවැරදි පිළිතුර: "+(q.a+1)+". "+q.o[q.a]+" | "+q.e;w.appendChild(d)}});
  $("wrongCard").classList.toggle("hide",!wl.length);$("wrongOnly").classList.toggle("hide",!wl.length);
  $("wrongOnly").onclick=function(){count=wl.length;start(wl)};
  $("prog").style.width="100%";show("res");
}
$("go").onclick=function(){start(avail())};
$("again").onclick=function(){show("start")};
$("theme").onclick=function(){var r=document.documentElement,dark=r.getAttribute("data-theme")==="dark"||(!r.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme:dark)").matches);r.setAttribute("data-theme",dark?"light":"dark")};
buildStart();
