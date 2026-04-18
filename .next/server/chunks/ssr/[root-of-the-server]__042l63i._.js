module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},71306,(a,b,c)=>{b.exports=a.r(18622)},79847,a=>{a.n(a.i(3343))},9185,a=>{a.n(a.i(29432))},72842,a=>{a.n(a.i(75164))},54897,a=>{a.n(a.i(30106))},56157,a=>{a.n(a.i(18970))},94331,a=>{a.n(a.i(60644))},15988,a=>{a.n(a.i(56952))},25766,a=>{a.n(a.i(77341))},29725,a=>{a.n(a.i(94290))},5785,a=>{a.n(a.i(90588))},74793,a=>{a.n(a.i(33169))},85826,a=>{a.n(a.i(37111))},21565,a=>{a.n(a.i(41763))},65911,a=>{a.n(a.i(8950))},25128,a=>{a.n(a.i(91562))},40781,a=>{a.n(a.i(49670))},69411,a=>{a.n(a.i(75700))},63081,a=>{a.n(a.i(276))},62837,a=>{a.n(a.i(40795))},34607,a=>{a.n(a.i(11614))},96338,a=>{a.n(a.i(21751))},50642,a=>{a.n(a.i(12213))},32242,a=>{a.n(a.i(22693))},88530,a=>{a.n(a.i(10531))},8583,a=>{a.n(a.i(1082))},38534,a=>{a.n(a.i(98175))},70408,a=>{a.n(a.i(9095))},22922,a=>{a.n(a.i(96772))},78294,a=>{a.n(a.i(71717))},16625,a=>{a.n(a.i(85034))},88648,a=>{a.n(a.i(68113))},51914,a=>{a.n(a.i(66482))},25466,a=>{a.n(a.i(91505))},12714,(a,b,c)=>{b.exports=a.x("node:fs/promises",()=>require("node:fs/promises"))},50227,(a,b,c)=>{b.exports=a.x("node:path",()=>require("node:path"))},66680,(a,b,c)=>{b.exports=a.x("node:crypto",()=>require("node:crypto"))},96136,a=>{"use strict";var b=a.i(12714),c=a.i(50227),d=a.i(66680);let e=c.default.resolve(process.cwd(),"..","gofarm-yt-main (1)","gofarm-yt-main","server","seed","production-export-2025-11-30t08-28-44-763z");function f(a,b){let c=a?._sanityAsset??"",d=c.match(/\.\/images\/([^"\]]+)/i);if(d?.[1])return`/images/${d[1]}`;let e=c.match(/\/([^/]+\.(?:png|jpe?g|webp|svg|gif))$/i);if(e?.[1])return`/images/${e[1]}`;if(b)for(let a of Object.values(b)){if(!a.sha1hash)continue;let b=a.originalFilename;if(b&&c.includes(a.sha1hash))return`/images/${b}`}return"/images/logo.svg"}async function g(){let a=process.env.GOFARM_SEED_DIR?c.default.resolve(process.env.GOFARM_SEED_DIR):e,g=c.default.join(a,"data.ndjson"),h=c.default.join(a,"assets.json"),[i,j]=await Promise.all([b.default.readFile(g,"utf8").catch(()=>""),b.default.readFile(h,"utf8").catch(()=>"{}")]),k=JSON.parse(j),l=i.split(/\r?\n/).map(a=>a.trim()).filter(Boolean).map(a=>JSON.parse(a)),m=new Map(l.filter(a=>"brand"===a._type&&a._id).map(a=>[a._id,a.name??"Brand"])),n=new Map(l.filter(a=>"category"===a._type&&a._id).map(a=>[a._id,{id:a._id,title:a.title??"Category",slug:a.slug?.current??"",imageSrc:f(a.image,k),count:0}])),o=l.filter(a=>"product"===a._type).sort((a,b)=>{let c=Number(!!a.isFeatured),d=Number(!!b.isFeatured);if(c!==d)return d-c;let e=a._createdAt?Date.parse(a._createdAt):0;return(b._createdAt?Date.parse(b._createdAt):0)-e}).map(a=>{let b=a.brand?._ref??null,c=a.categories?.[0]?._ref??null,e=c?n.get(c):null,g=f(a.images?.[0],k);return{id:a._id??a.slug?.current??a.name??(0,d.randomUUID)(),name:a.name??"Unnamed product",slug:a.slug?.current??"",imageSrc:g,imageAlt:a.name??"Product image",price:"number"==typeof a.price?a.price:0,discount:"number"==typeof a.discount?a.discount:null,brand:b?m.get(b)??b:null,categoryId:c,categoryTitle:e?.title??null,description:a.description??"",rating:"number"==typeof a.averageRating?a.averageRating:0,reviews:"number"==typeof a.totalReviews?a.totalReviews:0,stock:"number"==typeof a.stock?a.stock:null,status:a.status??null}}),p=new Map;for(let a of o)a.categoryId&&p.set(a.categoryId,(p.get(a.categoryId)??0)+1);return{products:o,categories:Array.from(n.values()).map(a=>({...a,count:p.get(a.id)??0}))}}a.s(["loadLocalCatalog",0,g])},22735,a=>{"use strict";var b=a.i(7997);function c(a){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(a)}function d(a){let b=a.discount&&a.discount>0?Math.max(0,a.price-Math.round(a.price*a.discount/100)):a.price,d=Array.from({length:5},(b,c)=>c<Math.round(a.rating));return a.status&&(a.status.charAt(0).toUpperCase(),a.status.slice(1)),`
    <article class="group rounded-[10px] border border-gray-200 bg-white overflow-hidden shadow-[0_1px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div class="relative h-[330px] bg-white flex items-center justify-center overflow-hidden px-4 pt-4">
        <div class="absolute left-3 top-3 z-10 flex flex-col gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gofarm-green text-white shadow">${a.status?a.status.charAt(0).toUpperCase()+a.status.slice(1):"New"}</span>
          ${a.discount?`<span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow">-${a.discount}%</span>`:""}
        </div>
        <img
          src="${a.imageSrc}"
          alt="${a.imageAlt}"
          class="max-h-[240px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_22px_22px_rgba(0,0,0,0.08)]"
          loading="lazy"
        >
        <div class="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
          <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green" aria-label="Add to wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-.06-.06a5.5 5.5 0 0 0-7.78 7.78l.06.06L12 21l7.78-7.55.06-.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </button>
          <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green" aria-label="Compare product">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <path d="M16 3h5v5" />
              <path d="M4 20 20 4" />
              <path d="M8 21H3v-5" />
            </svg>
          </button>
          <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green" aria-label="Share product">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51 15.42 17.49" />
              <path d="M15.41 6.51 8.59 10.49" />
            </svg>
          </button>
        </div>
      </div>
      <div class="px-4 pb-4 pt-2">
        <h4 class="text-[17px] font-bold text-gofarm-black leading-tight mb-1 line-clamp-1">${a.name}</h4>
        <div class="flex items-center gap-1 text-[12px] leading-none">
          ${d.map(a=>`<span class="${a?"text-yellow-400":"text-gray-300"}">&#9733;</span>`).join("")}
          <span class="ml-1 text-gofarm-gray">(${a.reviews})</span>
        </div>
        <div class="flex items-end gap-2 mt-2 mb-4 flex-nowrap">
          <span class="text-[22px] font-bold text-gofarm-green leading-none">${c(b)}</span>
          ${a.discount?`<span class="text-[18px] font-semibold text-gray-500 line-through leading-none">${c(a.price)}</span>`:""}
          ${a.discount?`<span class="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">-${a.discount}%</span>`:""}
        </div>
      </div>
        <button class="w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-gofarm-light-green/35 bg-white px-4 py-3 text-[15px] font-semibold text-gofarm-black whitespace-nowrap transition-all duration-200 hover:border-gofarm-green hover:bg-gofarm-light-orange/10">
          <span>&#128722;</span>
          <span>Add to Cart</span>
        </button>
    </article>
  `}a.s(["ProductCard",0,function({product:a}){return(0,b.jsx)("div",{dangerouslySetInnerHTML:{__html:d(a)}})},"productCardHtml",0,d])},50708,a=>{"use strict";var b=a.i(7997),c=a.i(12714),d=a.i(50227),e=a.i(22735);function f({title:a,href:b,products:c,productCount:d}){let g=c.slice(0,10);return`
    <div class="bg-gofarm-white rounded-2xl shadow-lg border border-gofarm-light-green/20 p-6 mb-8">
      <div class="flex items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          <h3 class="text-2xl font-bold text-gofarm-black">${a}</h3>
          <span class="inline-flex items-center rounded-full bg-gofarm-light-orange/40 px-4 py-2 text-sm font-semibold text-gofarm-green">
            ${d} Products
          </span>
        </div>
        <a class="inline-flex items-center gap-2 text-gofarm-green font-semibold hover:text-gofarm-light-green transition-colors duration-200" href="${b}">
          <span>View More</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div class="border-t border-gofarm-light-gray pt-8 relative">
        <button
          type="button"
          class="absolute left-[-16px] top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green"
          aria-label="Previous products"
          onclick="(function(el){if(el){el.scrollBy({left:-el.clientWidth,behavior:'smooth'})}})(document.getElementById('veg-carousel'))"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          class="absolute right-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-400 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green"
          aria-label="Next products"
          onclick="(function(el){if(el){el.scrollBy({left:el.clientWidth,behavior:'smooth'})}})(document.getElementById('veg-carousel'))"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div id="veg-carousel" class="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-20 pr-16">
          <div class="pb-2" style="display:grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 64px) / 5); gap: 16px;">
            ${g.map((a,b)=>`
                  <div id="veg-item-${b}" class="snap-start">
                    ${(0,e.productCardHtml)(a)}
                  </div>
                `).join("")}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 pt-8">
        <span class="h-3 w-8 rounded-full bg-gofarm-green"></span>
        <span class="h-3 w-3 rounded-full bg-gray-200"></span>
        <span class="h-3 w-3 rounded-full bg-gray-200"></span>
        <span class="h-3 w-3 rounded-full bg-gray-200"></span>
        <span class="h-3 w-3 rounded-full bg-gray-200"></span>
        <span class="h-3 w-3 rounded-full bg-gray-200"></span>
        <span class="h-3 w-3 rounded-full bg-gray-200"></span>
        <span class="h-3 w-3 rounded-full bg-gray-200"></span>
      </div>
    </div>
  `}var g=a.i(96136);async function h(){let a=d.default.join(process.cwd(),"index.html"),b=await c.default.readFile(a,"utf8"),e=b.match(/<body[^>]*>([\s\S]*)<\/body>/i),f=(e?.[1]??b).replace(/<div class="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">[\s\S]*?<\/div><div class="border-b border-gofarm-light-gray">/,'<div class="border-b border-gofarm-light-gray">'),g=f.indexOf('<div><div class="max-w-(--breakpoint-xl) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">'),h=g>=0?f.slice(0,g):f,i=g>=0?f.slice(g):"";return(h.replace(/<a[^>]*href="\/compare"[^>]*>[\s\S]*?<\/a>/g,"").replace(/<a[^>]*href="\/blog"[^>]*>[\s\S]*?<\/a>/g,"")+i).replace(/<link rel="preload" as="script" fetchpriority="low" href="\/_next\/static\/chunks\/([^"?]+)(?:\?[^"]*)?">/g,'<link rel="preload" as="script" fetchpriority="low" href="/js/$1">')}async function i(){let a=await h(),c=(await (0,g.loadLocalCatalog)()).products,d=c.slice(0,13),i=`
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      ${d.map(e.productCardHtml).join("")}
    </div>
  `,j=d.slice(0,10),k=f({title:"Vegetables",href:"/category/vegetables",products:j,productCount:j.length}),l=new Set;for(let a of j)a.slug&&l.add(a.slug);let m=(a,b=10)=>{let d=[];for(let c of a)if(!(!c.slug||l.has(c.slug))&&(d.push(c),l.add(c.slug),d.length>=b))return d;for(let a of c)if(!(!a.slug||l.has(a.slug))&&(d.push(a),l.add(a.slug),d.length>=b))break;return d},n=m(c.filter(a=>a.categoryTitle?.toLowerCase()==="fruit"||/fruit|apple|pear|mango|banana|watermelon|orange|berry/i.test(a.name))),o=m(c.filter(a=>/juice|juices|smoothie/i.test(a.name))),p=m(c.filter(a=>/drink|drinks|water|tea|milk|coffee|cola/i.test(a.name))),q=f({title:"Fruits",href:"/collection",products:n,productCount:n.length}),r=f({title:"Jucies",href:"/collection",products:o,productCount:o.length}),s=f({title:"Drinks",href:"/collection",products:p,productCount:p.length}),t=a.replace(/0(?:<!-- -->)? products/g,`${d.length} products`),u=t.indexOf('<div><div class="max-w-(--breakpoint-xl) mx-auto px-4 flex flex-col lg:px-0 mt-16 lg:mt-24">'),v=u>=0?t.indexOf('<div class="space-y-6 mb-12">',u):-1,w=u>=0?t.indexOf('<div class="bg-gofarm-white rounded-2xl shadow-lg border border-gofarm-light-green/20 p-6 mb-8">',u):-1,x=w>=0?t.indexOf('<div class="flex flex-col items-center justify-center py-16 min-h-80 space-y-8 text-center bg-linear-to-br from-gray-50/50 to-white rounded-xl border border-gray-200/50 w-full">',w):-1,y=x>=0?t.indexOf('<section class="py-16 lg:py-20 bg-linear-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">',x):-1;if(u>=0&&v>=0&&w>=0&&x>=0&&y>x){let a=t.slice(u,v),b=t.slice(w,x);t=t.slice(0,u)+a+k+q+r+s+b+`<div class="pt-8">${i}</div>`+t.slice(y)}return t=t.replace(/<a target="_blank" rel="noopener noreferrer" class="fixed bottom-6 right-20 z-50 group" href="https:\/\/buymeacoffee\.com\/reactbd\/e\/484104">[\s\S]*?<\/a>(?=<section aria-label="Notifications alt\+T")/,""),(0,b.jsx)("div",{dangerouslySetInnerHTML:{__html:t}})}a.s(["default",0,i],50708)},26030,a=>{a.n(a.i(50708))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__042l63i._.js.map