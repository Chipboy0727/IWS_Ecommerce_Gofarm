module.exports=[71306,(a,b,c)=>{b.exports=a.r(18622)},79847,a=>{a.n(a.i(3343))},9185,a=>{a.n(a.i(29432))},72842,a=>{a.n(a.i(75164))},54897,a=>{a.n(a.i(30106))},56157,a=>{a.n(a.i(18970))},94331,a=>{a.n(a.i(60644))},15988,a=>{a.n(a.i(56952))},25766,a=>{a.n(a.i(77341))},29725,a=>{a.n(a.i(94290))},5785,a=>{a.n(a.i(90588))},74793,a=>{a.n(a.i(33169))},85826,a=>{a.n(a.i(37111))},21565,a=>{a.n(a.i(41763))},65911,a=>{a.n(a.i(8950))},25128,a=>{a.n(a.i(91562))},40781,a=>{a.n(a.i(49670))},69411,a=>{a.n(a.i(75700))},63081,a=>{a.n(a.i(276))},62837,a=>{a.n(a.i(40795))},34607,a=>{a.n(a.i(11614))},96338,a=>{a.n(a.i(21751))},50642,a=>{a.n(a.i(12213))},32242,a=>{a.n(a.i(22693))},88530,a=>{a.n(a.i(10531))},93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},8583,a=>{a.n(a.i(1082))},38534,a=>{a.n(a.i(98175))},70408,a=>{a.n(a.i(9095))},22922,a=>{a.n(a.i(96772))},78294,a=>{a.n(a.i(71717))},16625,a=>{a.n(a.i(85034))},88648,a=>{a.n(a.i(68113))},51914,a=>{a.n(a.i(66482))},25466,a=>{a.n(a.i(91505))},12714,(a,b,c)=>{b.exports=a.x("node:fs/promises",()=>require("node:fs/promises"))},50227,(a,b,c)=>{b.exports=a.x("node:path",()=>require("node:path"))},66680,(a,b,c)=>{b.exports=a.x("node:crypto",()=>require("node:crypto"))},50708,a=>{"use strict";var b=a.i(7997),c=a.i(12714),d=a.i(50227),e=a.i(66680);let f=d.default.resolve(process.cwd(),"..","gofarm-yt-main (1)","gofarm-yt-main","server","seed","production-export-2025-11-30t08-28-44-763z");function g(a,b){let c=a?._sanityAsset??"",d=c.match(/\.\/images\/([^"\]]+)/i);if(d?.[1])return`/images/${d[1]}`;let e=c.match(/\/([^/]+\.(?:png|jpe?g|webp|svg|gif))$/i);if(e?.[1])return`/images/${e[1]}`;if(b)for(let a of Object.values(b)){if(!a.sha1hash)continue;let b=a.originalFilename;if(b&&c.includes(a.sha1hash))return`/images/${b}`}return"/images/logo.svg"}async function h(){let a=process.env.GOFARM_SEED_DIR?d.default.resolve(process.env.GOFARM_SEED_DIR):f,b=d.default.join(a,"data.ndjson"),h=d.default.join(a,"assets.json"),[i,j]=await Promise.all([c.default.readFile(b,"utf8").catch(()=>""),c.default.readFile(h,"utf8").catch(()=>"{}")]),k=JSON.parse(j),l=i.split(/\r?\n/).map(a=>a.trim()).filter(Boolean).map(a=>JSON.parse(a)),m=new Map(l.filter(a=>"brand"===a._type&&a._id).map(a=>[a._id,a.name??"Brand"])),n=new Map(l.filter(a=>"category"===a._type&&a._id).map(a=>[a._id,{id:a._id,title:a.title??"Category",slug:a.slug?.current??"",imageSrc:g(a.image,k),count:0}])),o=l.filter(a=>"product"===a._type).sort((a,b)=>{let c=Number(!!a.isFeatured),d=Number(!!b.isFeatured);if(c!==d)return d-c;let e=a._createdAt?Date.parse(a._createdAt):0;return(b._createdAt?Date.parse(b._createdAt):0)-e}).slice(0,12).map(a=>{let b=a.brand?._ref??null,c=a.categories?.[0]?._ref??null,d=c?n.get(c):null,f=g(a.images?.[0],k);return{id:a._id??a.slug?.current??a.name??(0,e.randomUUID)(),name:a.name??"Unnamed product",slug:a.slug?.current??"",imageSrc:f,imageAlt:a.name??"Product image",price:"number"==typeof a.price?a.price:0,discount:"number"==typeof a.discount?a.discount:null,brand:b?m.get(b)??b:null,categoryId:c,categoryTitle:d?.title??null,description:a.description??"",rating:"number"==typeof a.averageRating?a.averageRating:0,reviews:"number"==typeof a.totalReviews?a.totalReviews:0,stock:"number"==typeof a.stock?a.stock:null,status:a.status??null}}),p=new Map;for(let a of o)a.categoryId&&p.set(a.categoryId,(p.get(a.categoryId)??0)+1);return{products:o,categories:Array.from(n.values()).map(a=>({...a,count:p.get(a.id)??0}))}}async function i(){let a=d.default.join(process.cwd(),"index.html"),b=await c.default.readFile(a,"utf8"),e=b.match(/<body[^>]*>([\s\S]*)<\/body>/i);return(e?.[1]??b).replace(/<link rel="preload" as="script" fetchpriority="low" href="\/_next\/static\/chunks\/([^"?]+)(?:\?[^"]*)?">/g,'<link rel="preload" as="script" fetchpriority="low" href="/js/$1">')}function j(a){return a.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function k(a){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(a)}function l(a){let b=a.discount&&a.discount>0?Math.max(0,a.price-Math.round(a.price*a.discount/100)):a.price,c=Array.from({length:5},(b,c)=>c<Math.round(a.rating)),d=a.status?a.status.charAt(0).toUpperCase()+a.status.slice(1):"New";return`
    <article class="group rounded-[10px] border border-gray-200 bg-white overflow-hidden shadow-[0_1px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div class="relative h-[330px] bg-white flex items-center justify-center overflow-hidden px-4 pt-4">
        <div class="absolute left-3 top-3 z-10 flex flex-col gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gofarm-green text-white shadow">${j(d)}</span>
          ${a.discount?`<span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow">-${a.discount}%</span>`:""}
        </div>
        <img
          src="${j(a.imageSrc)}"
          alt="${j(a.imageAlt)}"
          class="max-h-[240px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_22px_22px_rgba(0,0,0,0.08)]"
          loading="lazy"
        >
      </div>
      <div class="px-4 pb-4 pt-2">
        <h4 class="text-[17px] font-bold text-gofarm-black leading-tight mb-1 line-clamp-1">${j(a.name)}</h4>
        <div class="flex items-center gap-1 text-[12px] leading-none">
          ${c.map(a=>`<span class="${a?"text-yellow-400":"text-gray-300"}">&#9733;</span>`).join("")}
          <span class="ml-1 text-gofarm-gray">(${a.reviews})</span>
        </div>
        <div class="flex items-end gap-2 mt-2 mb-4 flex-wrap">
          <span class="text-[22px] font-bold text-gofarm-green leading-none">${k(b)}</span>
          ${a.discount?`<span class="text-[18px] font-semibold text-gray-500 line-through leading-none">${k(a.price)}</span>`:""}
          ${a.discount?`<span class="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">-${a.discount}%</span>`:""}
        </div>
        <button class="w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-gofarm-light-green/35 bg-white px-4 py-3 text-[15px] font-semibold text-gofarm-black transition-all duration-200 hover:border-gofarm-green hover:bg-gofarm-light-orange/10">
          <span>&#128722;</span>
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  `}async function m(){let a,c,d=await i(),e=await h(),f=e.products.slice(0,13),g=e.categories.find(a=>a.count>0)?.title??e.categories[0]?.title??"Vegetables",k='<div><div class="max-w-(--breakpoint-xl) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">',m=(a=f.slice(0,5),c=Math.max(f.length,a.length),`
    <div><div class="max-w-(--breakpoint-xl) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="h-1 w-12 bg-linear-to-r from-gofarm-light-green to-gofarm-green rounded-full"></div>
          <h2 class="text-3xl lg:text-4xl font-bold text-gofarm-black">Featured Products</h2>
          <div class="h-1 w-12 bg-linear-to-l from-gofarm-light-green to-gofarm-green rounded-full"></div>
        </div>
        <p class="text-gofarm-gray text-lg max-w-2xl mx-auto">Discover our carefully curated selection of premium products</p>
      </div>
      <div class="rounded-[28px] border border-gray-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] overflow-hidden">
        <div class="flex items-center justify-between gap-4 px-5 md:px-8 pt-6 pb-5 border-b border-gray-200">
          <div class="flex items-center gap-4">
            <h3 class="text-2xl font-extrabold tracking-tight text-gofarm-black">${j(g)}</h3>
            <span class="inline-flex items-center rounded-full bg-gofarm-light-orange/40 px-4 py-1.5 text-sm font-semibold text-gofarm-green">${c} Products</span>
          </div>
          <a href="/shop" class="inline-flex items-center gap-2 text-lg font-semibold text-gofarm-green hover:text-gofarm-light-green transition-colors">
            <span>View More</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
          </a>
        </div>
        <div class="relative px-5 md:px-8 py-6 md:py-8">
          <button type="button" aria-label="Previous products" class="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
          </button>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            ${a.map(l).join("")}
          </div>
          <button type="button" aria-label="Next products" class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gofarm-green bg-white text-gofarm-green shadow-md transition-colors hover:bg-gofarm-green hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
          </button>
        </div>
        <div class="flex items-center justify-center gap-2 pb-6">
          <span class="h-2.5 w-8 rounded-full bg-gofarm-green"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-gray-200"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-gray-200"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-gray-200"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-gray-200"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-gray-200"></span>
        </div>
      </div>
    </div></div>
  `),n=d.indexOf(k),o=n>=0?d.indexOf(k,n+k.length):-1,p=d;return n>=0&&o>n&&(p=d.slice(0,n)+m+d.slice(o)),p=p.replace(/0 products/g,`${f.length} products`),(0,b.jsx)("div",{dangerouslySetInnerHTML:{__html:p}})}a.s(["default",0,m],50708)},26030,a=>{a.n(a.i(50708))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0tej.u5._.js.map