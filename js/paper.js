var pp={},tm=null;
function buildPapers(){var box=$("papers");PAPERS.forEach(function(p){var b=document.createElement("button");b.className="btn ghost";b.style.cssText="display:block;margin-bottom:8px";b.textContent=p.title+" (ප්‍රශ්න "+p.idx.length+", මිනිත්තු "+p.minutes+")";b.onclick=function(){startPaper(p)};box.appendChild(b)})}
function startPaper(p){pp={list:p.idx.map(function(i){return Q[i]}),ans:[],flag:[],cur:0,left:p.minutes*60,title:p.title,sure:false};clearInterval(tm);tm=setInterval(tick,1000);show("paper");rp();tick(true)}
function tick(skip){if(skip!==true)pp.left--;var m=Math.floor(pp.left/60),s=pp.left%60;$("clock").textContent=(m<10?"0":"")+m+":"+(s<10?"0":"")+s;if(pp.left<=0)submitPaper()}
function rp(){
  var q=pp.list[pp.cur];$("ptitle").textContent=pp.title;$("ppos").textContent="ප්‍රශ්නය "+(pp.cur+1)+" / "+pp.list.length;$("pqt").textContent=q.q;
  var box=$("popts");box.innerHTML="";
  q.o.forEach(function(t,i){var b=document.createElement("button");b.className="opt"+(pp.ans[pp.cur]===i?" sel":"");b.innerHTML='<span class="n">'+(i+1)+'</span><span></span>';b.lastChild.textContent=t;
    b.onclick=function(){pp.ans[pp.cur]=(pp.ans[pp.cur]===i?undefined:i);rp()};box.appendChild(b)});
  $("pprev").disabled=pp.cur===0;$("pnext").disabled=pp.cur===pp.list.length-1;
  $("pflag").textContent=pp.flag[pp.cur]?"සලකුණ ඉවත් කරන්න":"පසුව බැලීමට සලකුණු කරන්න";
  var pal=$("pal");pal.innerHTML="";
  pp.list.forEach(function(_,i){var b=document.createElement("button");b.className="pn"+(i===pp.cur?" cur":"")+(pp.ans[i]!==undefined?" ans":"")+(pp.flag[i]?" flg":"");b.textContent=i+1;b.setAttribute("aria-label","ප්‍රශ්නය "+(i+1));b.onclick=function(){pp.cur=i;rp()};pal.appendChild(b)});
  pp.sure=false;$("pmsg").textContent="";
}
function submitPaper(){clearInterval(tm);pool=pp.list;answers=pp.ans;finish()}
$("pprev").onclick=function(){pp.cur--;rp()};
$("pnext").onclick=function(){pp.cur++;rp()};
$("pflag").onclick=function(){pp.flag[pp.cur]=!pp.flag[pp.cur];rp()};
$("psub").onclick=function(){var n=pp.list.length-pp.ans.filter(function(a){return a!==undefined}).length;
  if(n&&!pp.sure){pp.sure=true;$("pmsg").textContent="පිළිතුරු දී නැති ප්‍රශ්න "+n+"ක් ඇත. භාර දීමට නැවත ඔබන්න.";return}submitPaper()};
buildPapers();
