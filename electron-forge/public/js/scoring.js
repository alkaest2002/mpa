(()=>{var _=computeScores=({testee:w,session:S,answers:I,specs:g})=>{let f=(i,n="answerValue")=>Object.values(i).sort(r=>r.order).map(r=>r[n]),h=(i,n,r)=>{let t=n.map(e=>e-1),o=r.filter((e,m)=>t.includes(m)),c=o.filter(e=>e.answerValue=="")?.length||0;return{straightItemsRawScore:o.filter(e=>e.answerValue!="").reduce((e,m)=>e+Number(m),0),straightItemsOmissions:c}},v=({likert:{max:i,min:n}},r,t)=>{let o=i+n,c=r.map(s=>s-1),a=t.filter((s,u)=>c.includes(u)),e=a.filter(s=>s.answerValue=="")?.length||0;return{reversedItemsRawScore:a.filter(s=>s.answerValue!="").map(s=>o-s).reduce((s,u)=>s+Number(u),0),reverseItemsdOmissions:e}},p=(i,n,r,t,o)=>{let c=r.norms.getNorms,a=eval?.(`"use strict";${c};fn(${JSON.stringify({...t,...o})},"${i}")`),e=r.norms[a],m=eval?.(`"use strict";${e};fn(${n})`);return Math.round(m,0)};return((i,n,r,t)=>{let o=f(r,"answerValue"),c={};for(let[a,{name:e,straightItems:m,reversedItems:s}]of Object.entries(t.scales)){let{straightItemsRawScore:u,straightItemsOmissions:R}=h(t,m,o),{reversedItemsRawScore:V,reverseItemsdOmissions:N}=v(t,s,o),d=R+N,l=u+V,O=l/(m.length+s.length-d),$=p(a,l,t,i,n);c={...c,[a]:{scaleId:a,name:e,rawScore:l,meanScore:O,standardScore:$,omissions:d}}}return c})(w,S,I,g)};})();
