var $=function(i){return document.getElementById(i)};
var sel={},count=10,pool=[],idx=0,answers=[],done=false,mode="practice",ex={};
function show(id){["start","quiz","res","exam"].forEach(function(s){$(s).classList.toggle("hide",s!==id)});window.scrollTo(0,0)}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function buildStart(){
  T.forEach(function(n,i){sel[i]=true;var b=document.createElement("button");b.className="chip";b.textContent=n;b.setAttribute("aria-pressed","true");
    b.onclick=function(){sel[i]=!sel[i];b.setAttribute("aria-pressed",sel[i]);upd()};$("topics").appendChild(b)});
  [5,10,20].forEach(function(c){var b=document.createElement("button");b.className="chip";b.textContent=c+" ප්‍රශ්න";b.setAttribute("aria-pressed",c===10);
    b.onclick=function(){count=c;[].forEach.call($("counts").children,function(x){x.setAttribute("aria-pressed",x===b)});upd()};$("counts").appendChild(b)});
  ["පුහුණු ක්‍රමය","විභාග ක්‍රමය"].forEach(function(n,k){var b=document.createElement("button");b.className="chip";b.textContent=n;
    b.setAttribute("aria-pressed",k===0);
    b.onclick=function(){mode=k?"exam":"practice";upd();[].forEach.call($("modes").children,function(x){x.setAttribute("aria-pressed",x===b)})};
    $("modes").appendChild(b)});
  upd();
}
function avail(){return Q.filter(function(q){return sel[q.t]})}
function upd(){var n=avail().length,m=Math.min(count,n);$("go").disabled=n===0;
  $("go").textContent=mode==="exam"?"විභාගය ආරම්භ කරන්න":"පුහුණුව ආරම්භ කරන්න";
  $("avail").textContent=n?"තෝරාගත් පාඩම්වල ප්‍රශ්න "+n+"ක් තිබේ.":"අවම වශයෙන් එක් පාඩමක් තෝරන්න.";
  $("sumline").textContent=(mode==="exam"?"විභාග ක්‍රමය · කාලය විනාඩි "+Math.round(m*2.4):"පුහුණු ක්‍රමය")+" · ප්‍රශ්න "+m;
  $("modeinfo").textContent=mode==="exam"?"කාල ගණකය සහ ප්‍රශ්න පුවරුව සහිතයි. පිළිතුරු සහ විස්තර පෙනෙන්නේ පත්‍රය බාරදුන් පසුවය.":"එක් එක් පිළිතුරෙන් පසු විස්තරය පෙනේ."}
var pst=[];
function buildPPal(){pst=pool.map(function(){return ""});var p=$("ppal");p.innerHTML="";
  pool.forEach(function(_,k){var s=document.createElement("span");s.className="pq";s.textContent=k+1;p.appendChild(s)})}
function updPPal(){[].forEach.call($("ppal").children,function(s,k){
  s.className="pq"+(pst[k]?" "+pst[k]:"")+(k===idx?" c":"");
  s.setAttribute("aria-label","ප්‍රශ්නය "+(k+1)+(pst[k]==="ok"?": නිවැරදි":pst[k]==="bad"?": වැරදි":""))})}
function start(list){pool=shuffle(list).slice(0,count);idx=0;answers=[];show("quiz");buildPPal();render()}
function render(){
  var q=pool[idx];done=false;updPPal();
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
  var ok=i===q.a;pst[idx]=ok?"ok":"bad";updPPal();$("exp").innerHTML='<div class="exp'+(ok?'':' bad')+'"><strong></strong> <span></span></div>';
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
    d.children[0].firstChild.textContent=q.q;d.children[1].textContent=answers[i]<0?"පිළිතුරක් දී නැත":"ඔබේ පිළිතුර: "+(answers[i]+1)+". "+q.o[answers[i]];
    d.children[2].textContent="නිවැරදි පිළිතුර: "+(q.a+1)+". "+q.o[q.a]+" | "+q.e;w.appendChild(d)}});
  $("wrongCard").classList.toggle("hide",!wl.length);$("wrongOnly").classList.toggle("hide",!wl.length);
  $("wrongOnly").onclick=function(){count=wl.length;start(wl)};
  $("prog").style.width="100%";show("res");
}
$("go").onclick=function(){mode==="exam"?startExam(avail()):start(avail())};
$("again").onclick=function(){show("start")};
$("theme").onclick=function(){var r=document.documentElement,dark=r.getAttribute("data-theme")==="dark"||(!r.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme:dark)").matches);r.setAttribute("data-theme",dark?"light":"dark")};
/* ---- විභාග ක්‍රමය (exam mode) ---- */
function pad(n){return(n<10?"0":"")+n}
function startExam(list){
  pool=shuffle(list).slice(0,count);
  ex={i:0,ans:pool.map(function(){return null}),flag:pool.map(function(){return false}),
      end:Date.now()+Math.round(pool.length*2.4)*60000};
  show("exam");buildPal();renderX();tick();ex.t=setInterval(tick,1000);
}
function tick(){var s=Math.max(0,Math.round((ex.end-Date.now())/1000));
  $("timer").textContent=pad(Math.floor(s/3600))+":"+pad(Math.floor(s%3600/60))+":"+pad(s%60);
  if(s===0)submitExam();}
function buildPal(){var p=$("pal");p.innerHTML="";
  pool.forEach(function(_,k){var b=document.createElement("button");b.className="pq";b.textContent=k+1;
    b.setAttribute("aria-label","ප්‍රශ්නය "+(k+1));b.onclick=function(){ex.i=k;renderX()};p.appendChild(b)})}
function renderX(){
  var q=pool[ex.i];
  $("xpos").textContent="ප්‍රශ්නය "+(ex.i+1)+" / "+pool.length;$("xtp").textContent=T[q.t];$("xq").textContent=q.q;
  var box=$("xopts");box.innerHTML="";
  q.o.forEach(function(t,k){var b=document.createElement("button");b.className="opt"+(ex.ans[ex.i]===k?" sel":"");
    b.innerHTML='<span class="n">'+(k+1)+'</span><span></span>';b.lastChild.textContent=t;
    b.onclick=function(){ex.ans[ex.i]=k;renderX()};box.appendChild(b)});
  $("xflag").setAttribute("aria-pressed",ex.flag[ex.i]);
  $("xprev").disabled=ex.i===0;$("xnext").disabled=ex.i===pool.length-1;
  [].forEach.call($("pal").children,function(b,k){
    b.className="pq"+(ex.ans[k]!==null?" a":"")+(ex.flag[k]?" f":"")+(k===ex.i?" c":"")});
  var a=ex.ans.filter(function(x){return x!==null}).length,f=ex.flag.filter(Boolean).length;
  $("pstat").textContent="පිළිතුරු: "+a+" · සලකුණු: "+f+" · ඉතිරි: "+(pool.length-a);
}
$("xprev").onclick=function(){ex.i--;renderX()};
$("xnext").onclick=function(){ex.i++;renderX()};
$("xflag").onclick=function(){ex.flag[ex.i]=!ex.flag[ex.i];renderX()};
$("xclear").onclick=function(){ex.ans[ex.i]=null;renderX()};
$("xsubmit").onclick=function(){var left=ex.ans.filter(function(x){return x===null}).length;
  if(confirm(left?"ප්‍රශ්න "+left+"කට පිළිතුරු දී නැත. බාරදෙන්නද?":"පත්‍රය බාරදෙන්නද?"))submitExam()};
function submitExam(){clearInterval(ex.t);answers=ex.ans.map(function(x){return x===null?-1:x});finish()}
buildStart();
