"use strict";(()=>{var e={};e.id=827,e.ids=[827],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},5240:e=>{e.exports=require("https")},5315:e=>{e.exports=require("path")},8621:e=>{e.exports=require("punycode")},6162:e=>{e.exports=require("stream")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},2623:e=>{e.exports=require("worker_threads")},1568:e=>{e.exports=require("zlib")},7561:e=>{e.exports=require("node:fs")},4492:e=>{e.exports=require("node:stream")},4702:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>m,requestAsyncStorage:()=>c,routeModule:()=>h,serverHooks:()=>d,staticGenerationAsyncStorage:()=>l});var o={};r.r(o),r.d(o,{POST:()=>u});var s=r(3278),a=r(5002),n=r(4877),i=r(1309),p=r(6920);async function u(e){try{let{tone:t,creativity:r,captionLength:o,language:s,keywords:a,numCaptions:n}=await e.json();if(!t||!r||!o||!s||!n)return i.NextResponse.json({error:"Missing required fields."},{status:400});let u=`
Generate ${n} Instagram post captions in ${s} language.
The tone should be ${t}.
The creativity level should be ${r}.
Each of the generated captions should have a length of ${o} words.
You need to use at least one of the following keywords, or their synonyms, or any other form of these words: ${a||""}, while generating captions.
If the keyword list is empty, generate captions without any keyword restrictions.
Make sure that you also provide the relevant and trending hashtags followed by each caption.
Do not generate anything else apart from captions in JSON format.
Generate the captions only in JSON format and stick to the format defined below:

{
    "Caption 1": {
        "text": "some text",
        "hashtag": "#few-hashtags"
    },
    "Caption 2": {
        "text": "another text",
        "hashtag": "#another-hashtags"
    }
}
`,h=await p.M.chat.completions.create({messages:[{role:"user",content:u}],model:"meta-llama/llama-4-maverick-17b-128e-instruct",response_format:{type:"json_object"},top_p:1,temperature:"High"===r?.8:"Medium"===r?.7:.6,max_tokens:"10 - 20"===o?300:"20 - 80"===o?700:"80 - 140"===o?1e3:1200,seed:42,n:1}),c=h.choices[0]?.message?.content||"{}",l=function(e){try{let t=JSON.parse(e);return Object.values(t).map(e=>({text:e.text??"",hashtag:e.hashtag??""}))}catch(e){return[]}}(c);return i.NextResponse.json({captions:l})}catch(e){return console.error("text caption error",e),i.NextResponse.json({error:e?.message||"Server error"},{status:500})}}let h=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/captions/text/route",pathname:"/api/captions/text",filename:"route",bundlePath:"app/api/captions/text/route"},resolvedPagePath:"/Users/81221574/Desktop/Personal_Files_Folders/Learnings/CaptionGen/web/app/api/captions/text/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:d}=h,x="/api/captions/text/route";function m(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:l})}},6920:(e,t,r)=>{r.d(t,{M:()=>s});var o=r(5934);if(!process.env.GROQ_API_KEY)throw Error("GROQ_API_KEY is not set. Add it to your Vercel envs.");let s=new o.ZP({apiKey:process.env.GROQ_API_KEY})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[787,966],()=>r(4702));module.exports=o})();