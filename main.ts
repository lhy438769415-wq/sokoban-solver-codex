const {readFileSync:R,mkdirSync:M,writeFileSync:W}=require('node:fs');

function solve(text){
 const rows=text.trimEnd().split(/\r?\n/),w=Math.max(...rows.map(r=>r.length));
 const board=rows.map(r=>r.padEnd(w,'#')).join(''),n=board.length;
 const d=[-w,w,-1,1],letters='udlr';
 let player=board.search(/[@+]/),out='';
 const h=player-player%w;
 for(let e=h+1;e<h+w-1;e++){
 if(board[e-w]==='#'&&board[e+w]==='#')continue;
 const floor=new Uint8Array(n),busy=new Uint8Array(n),prev=new Int8Array(n),q=new Int16Array(n);
 for(let p=0;p<n;p++)floor[p]=+(p===e||(p<h||p>=h+w)&&board[p]!=='#');

 function walk(b,s){
 prev.fill(-1);
 for(const p of b)busy[p]=1;
 let end=1,min=s;
 q[0]=s;
 prev[s]=4;
 for(let j=0;j<end;j++){
 const p=q[j];
 if(p<min)min=p;
 for(let i=0;i<4;i++){
 const t=p+d[i];
 if(floor[t]&&!busy[t]&&prev[t]<0){
 prev[t]=i;
 q[end++]=t;
 }
 }
 }
 for(const p of b)busy[p]=0;
 return min;
 }
 function path(t){
 let s='';
 for(let i; (i=prev[t])<4;t-=d[i])s=letters[i]+s;
 return s;
 }

 walk([],e);
 const b=[],g=[];
 for(let p=0;p<n;p++)if(prev[p]>=0){
 if('$*'.includes(board[p]))b.push(p);
 if('.*+'.includes(board[p]))g.push(p);
 }
 // Reverse pushes on the empty board identify live box squares.
 const live=new Set(g);
 for(const p of live)for(const a of d)
 if(p-a!==e&&floor[p-a]&&floor[p-2*a])live.add(p-a);

 const queue=[[b.sort(),e]],seen=new Set();
 for(let j=0;j<queue.length;j++){
 const state=queue[j], [b,p]=state;
 queue[j]=null;
 let key=walk(b,p);
 for(const t of b)key=key*n+t;
 if(seen.has(key))continue;
 seen.add(key);
 if(b.every(t=>g.includes(t))){
 let s=path(e);
 for(let c=state;c[2];c=c[2]){
 const [ ,t,[boxes,from],i]=c;
 walk(boxes,from);
 s=path(t-d[i])+letters[i]+s;
 }
 out+=(e<player?'l':'r').repeat(Math.abs(e-player))+s;
 player=e;
 break;
 }
 for(let k=0;k<b.length;k++)for(let i=0;i<4;i++){
 const t=b[k]+d[i];
 if(prev[b[k]-d[i]]>=0&&live.has(t)&&!b.includes(t)){
 const next=b.slice();
 next[k]=t;
 queue.push([next.sort(),b[k],state,i]);
 }
 }
 }
 }
 return out;
}

for(let i=1;i<=5;i++){
 const id='/i00'+i,{MAKEFUN_INPUT_DIR='/input',MAKEFUN_OUTPUT_DIR='/output'}=process.env;
 const out=MAKEFUN_OUTPUT_DIR+id;
 const answer=solve(R(MAKEFUN_INPUT_DIR+id+'/level.txt','utf8'));
 M(out,{recursive:true});
 W(out+'/solution.txt',answer);
}
