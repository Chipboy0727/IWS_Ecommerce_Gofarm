import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/backend/db";

/* ── Vietnamese → English product dictionary ──────────────── */
const VI_PRODUCT_MAP: Record<string, string[]> = {
  // Fruits
  "tao": ["apple"], "tao fuji": ["fuji apple"], "tao xanh": ["granny smith apple"],
  "chuoi": ["banana", "laba banana"], "xoai": ["mango", "hoa loc mango"],
  "dua hau": ["watermelon", "seedless watermelon"], "thanh long": ["dragon fruit"],
  "sau rieng": ["durian", "ri6 durian"], "mang cut": ["mangosteen"],
  "cam": ["orange", "king orange"], "buoi": ["pomelo", "green skin pomelo"],
  "nho": ["grape", "shine muscat grape", "black grape"],
  "dau tay": ["strawberry"], "viet quat": ["blueberry"], "kiwi": ["kiwi", "golden kiwi"],
  "le": ["pear", "korean pear"], "bo": ["avocado", "butter avocado"],
  "chom chom": ["rambutan"], "oi": ["guava", "queen guava"], "dua": ["pineapple"],
  "trai cay": ["fruits"], "hoa qua": ["fruits"],
  // Vegetables
  "sup lo": ["broccoli", "cauliflower"], "sup lo xanh": ["broccoli"],
  "sup lo trang": ["cauliflower"], "bap cai": ["cabbage", "white cabbage", "purple cabbage"],
  "cai thao": ["napa cabbage"], "cai thia": ["bok choy"],
  "rau bi na": ["spinach"], "cai xoan": ["kale"], "xa lach": ["lettuce"],
  "ca rot": ["carrot"], "khoai tay": ["potato"],
  "khoai lang": ["sweet potato", "purple sweet potato"], "bi do": ["pumpkin"],
  "bi ngoi": ["zucchini"], "ca chua": ["tomato", "cherry tomato"],
  "dua leo": ["cucumber"], "ot chuong": ["bell pepper"],
  "mang tay": ["asparagus"], "rau": ["vegetables"], "rau cu": ["vegetables"],
  "nam": ["mushroom"], "hanh": ["onion"], "toi": ["garlic"],
};

/** Vietnamese category keywords */
const VI_CATEGORY_MAP: Record<string, string> = {
  "trai cay": "FRUITS", "hoa qua": "FRUITS", "fruit": "FRUITS", "fruits": "FRUITS",
  "rau": "VEGETABLES", "rau cu": "VEGETABLES", "rau qua": "VEGETABLES",
  "vegetable": "VEGETABLES", "vegetables": "VEGETABLES",
  "thit": "MEAT", "meat": "MEAT",
  "hai san": "SEAFOOD", "seafood": "SEAFOOD",
  "sua": "DAIRY", "dairy": "DAIRY",
};

/* ── Helpers ──────────────────────────────────────────────── */

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s]/g, "").trim();
}

const STOP_WORDS = new Set([
  "price","of","the","how","much","is","what","show","me","find","search","get",
  "do","you","have","for","a","an","cost","in","and","or","with","about","tell",
  "give","want","need","buy","order","can","please","i","my","it","this","that",
  // Vietnamese stop words
  "gia","bao","nhieu","cua","co","khong","con","hang","la","nao","cho","toi",
  "xin","hoi","muon","mua","oi","vay","the","nhe","duoc","biet","hay","va",
  "cac","nhung","nay","ay","roi","ma","thi","se","da","dang","cung","rat",
  "lam","nhat","gi","sao","nhu","mot","hai","ba","bon","nam",
]);

function extractSearchTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

/** Translate Vietnamese terms to English product names */
function translateViToEn(query: string): string[] {
  const q = normalize(query);
  const results: string[] = [];
  // Check longest phrases first (2-word then 1-word)
  const words = q.split(/\s+/);
  const checked = new Set<number>();
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    if (VI_PRODUCT_MAP[phrase]) {
      results.push(...VI_PRODUCT_MAP[phrase]);
      checked.add(i); checked.add(i + 1);
    }
  }
  for (let i = 0; i < words.length; i++) {
    if (!checked.has(i) && VI_PRODUCT_MAP[words[i]]) {
      results.push(...VI_PRODUCT_MAP[words[i]]);
    }
  }
  return results;
}

/** Detect if query is Vietnamese */
function isVietnamese(text: string): boolean {
  return /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(text);
}

function scoreMatch(query: string, product: { name: string; categoryTitle: string | null; origin: string | null }): number {
  const searchTerms = extractSearchTerms(query);
  const viTranslations = translateViToEn(query);
  if (searchTerms.length === 0 && viTranslations.length === 0) return 0;

  const nameN = normalize(product.name);
  const catN = normalize(product.categoryTitle ?? "");
  const originN = normalize(product.origin ?? "");

  // Vietnamese translation match (exact product name)
  for (const t of viTranslations) {
    if (nameN.includes(normalize(t))) return 100;
  }

  const searchPhrase = searchTerms.join(" ");
  if (searchPhrase && nameN.includes(searchPhrase)) return 100;

  let nameHits = 0;
  for (const w of searchTerms) { if (nameN.includes(w)) nameHits++; }
  if (nameHits > 0) return Math.round((nameHits / searchTerms.length) * 90);

  let catHits = 0;
  for (const w of searchTerms) { if (catN.includes(w)) catHits++; }
  if (catHits > 0) return Math.round((catHits / searchTerms.length) * 60);

  let originHits = 0;
  for (const w of searchTerms) { if (originN.includes(w)) originHits++; }
  if (originHits > 0) return Math.round((originHits / searchTerms.length) * 50);

  return 0;
}

function formatPrice(price: number, discount: number | null): string {
  if (discount && discount > 0) {
    const dp = price * (1 - discount / 100);
    return `$${dp.toFixed(2)} (was $${price.toFixed(2)}, -${discount}%)`;
  }
  return `$${price.toFixed(2)}`;
}

function formatStock(stock: number | null, status: string | null, vi: boolean): string {
  if (status === "out_of_stock" || stock === 0) return vi ? "❌ Hết hàng" : "❌ Out of stock";
  if (stock !== null && stock < 20) return vi ? `⚠️ Sắp hết — còn ${stock}` : `⚠️ Low stock — ${stock} left`;
  if (stock !== null) return vi ? `✅ Còn hàng (${stock})` : `✅ In stock (${stock})`;
  return vi ? "✅ Còn hàng" : "✅ Available";
}

/* ── Intent detection ─────────────────────────────────────── */
type Intent = "price" | "search" | "category_list" | "greeting" | "help" | "stock" | "recommend" | "sale" | "trending";

function detectIntent(message: string): Intent {
  const m = normalize(message);
  if (/^(hi|hello|hey|xin chao|chao|alo)\b/.test(m)) return "greeting";
  if (/\b(help|giup|huong dan|ho tro)\b/.test(m)) return "help";
  if (/\b(price|gia|bao nhieu|cost|how much|gia ca|bang gia|gia tien)\b/.test(m)) return "price";
  if (/\b(stock|con hang|het hang|available|con khong|ton kho|con ko)\b/.test(m)) return "stock";
  if (/\b(category|categories|danh muc|loai|tat ca|all products)\b/.test(m)) return "category_list";
  
  // Sale/Discount intent
  if (/\b(sale|giam gia|khuyen mai|re nhat|uu dai|discount)\b/.test(m)) return "sale";
  
  // Trending/Best seller intent
  if (/\b(trending|ban chay|hot|pho bien|popular|mua nhieu|ngon nhat|best seller)\b/.test(m)) return "trending";
  
  if (/\b(recommend|goi y|de xuat|suggest|best|tot nhat|nen mua)\b/.test(m)) return "recommend";
  return "search";
}

/** Detect category from Vietnamese query */
function detectViCategory(query: string): string | null {
  const q = normalize(query);
  for (const [viKey, enCat] of Object.entries(VI_CATEGORY_MAP)) {
    if (q.includes(viKey)) return enCat;
  }
  return null;
}

/* ── Response generators (bilingual) ──────────────────────── */

function saleResponse(products: ProductInfo[], vi: boolean): string {
  const sales = products.filter(p => p.discount && p.discount > 0).sort((a, b) => (b.discount || 0) - (a.discount || 0));
  if (sales.length === 0) {
    return vi ? "Hiện tại Gofarm chưa có chương trình giảm giá đặc biệt, nhưng chúng mình luôn có mức giá tốt nhất cho bạn! 😊" : "We don't have special discounts right now, but we always offer the best prices for you! 😊";
  }
  let r = vi ? "🔥 **Các sản phẩm đang có ưu đãi cực tốt:**\n\n" : "🔥 **Our Best Deals Right Now:**\n\n";
  for (const p of sales.slice(0, 8)) {
    r += `• **${p.name}** — ${formatPrice(p.price, p.discount)}\n`;
  }
  return r;
}

function trendingResponse(products: ProductInfo[], vi: boolean): string {
  const trending = [...products].sort((a, b) => (b.reviews * b.rating) - (a.reviews * a.rating)).slice(0, 5);
  let r = vi ? "🚀 **Sản phẩm đang bán chạy nhất tại Gofarm:**\n\n" : "🚀 **Best Sellers at Gofarm:**\n\n";
  const medals = ["🥇", "🥈", "🥉", "✨", "✨"];
  for (let i = 0; i < trending.length; i++) {
    const p = trending[i];
    r += `${medals[i]} **${p.name}** — ${formatPrice(p.price, p.discount)}\n  ⭐ ${p.rating}/5 (${p.reviews} lượt mua)\n\n`;
  }
  return r;
}

function greeting(vi: boolean): string {
  if (vi) return `🌿 **Xin chào! Chào mừng đến với Gofarm!** 🌿

Mình là trợ lý ảo, có thể giúp bạn:

• 🏷️ **Giá sản phẩm** — Hỏi giá bất kỳ sản phẩm nào!
• 🔥 **Giảm giá** — Xem các sản phẩm đang có ưu đãi
• 🚀 **Bán chạy** — Xem những gì mọi người đang mua nhiều nhất
• 📦 **Tình trạng hàng** — Kiểm tra còn hàng không

Ví dụ: *"Cái gì đang giảm giá?"* hoặc *"Sản phẩm nào bán chạy nhất?"*`;
  if (vi) return `🌿 **Xin chào! Chào mừng đến với Gofarm!** 🌿

Mình là trợ lý ảo, có thể giúp bạn:

• 🏷️ **Giá sản phẩm** — Hỏi giá bất kỳ sản phẩm nào!
• 📦 **Tình trạng hàng** — Kiểm tra còn hàng không
• 🍎 **Thông tin sản phẩm** — Mô tả, xuất xứ, đánh giá
• 💡 **Gợi ý** — Sản phẩm bán chạy nhất

Ví dụ: *"Giá xoài bao nhiêu?"* hoặc *"Có trái cây gì?"*`;

  return `🌿 **Hello! Welcome to Gofarm!** 🌿

I'm your virtual assistant. I can help you with:

• 🏷️ **Product prices** — Ask me about any product!
• 📦 **Stock availability** — Check if items are in stock
• 🍎 **Product info** — Descriptions, origins, ratings
• 💡 **Recommendations** — Get our top picks

Try: *"How much is the Fuji Apple?"* or *"What fruits do you have?"*`;
}

function helpMsg(vi: boolean): string {
  if (vi) return `🆘 **Mình có thể giúp bạn:**

**Hỏi giá:** → "Giá táo bao nhiêu?" hoặc "Xoài giá bao nhiêu?"
**Kiểm tra hàng:** → "Sầu riêng còn hàng không?"
**Xem danh mục:** → "Có rau gì?" hoặc "Cho xem trái cây"
**Gợi ý:** → "Gợi ý sản phẩm ngon" hoặc "Nên mua gì?"
**Tìm kiếm:** → Gõ tên sản phẩm bằng tiếng Việt hoặc tiếng Anh 🚀`;

  return `🆘 **Here's how I can help:**

**Prices:** → "Price of Mango" or "How much is Broccoli?"
**Stock:** → "Is Durian in stock?"
**Categories:** → "What vegetables do you have?"
**Recommendations:** → "Recommend me something"
**Search:** → Type any product name 🚀`;
}

type ProductInfo = { name: string; price: number; discount: number | null; origin: string; description: string; rating: number; reviews: number; stock: number | null; status: string | null; categoryTitle: string | null };

function priceResponse(products: ProductInfo[], vi: boolean): string {
  if (products.length === 1) {
    const p = products[0];
    return vi
      ? `🏷️ **${p.name}** (từ ${p.origin})\n**Giá:** ${formatPrice(p.price, p.discount)}`
      : `🏷️ **${p.name}** (from ${p.origin})\n**Price:** ${formatPrice(p.price, p.discount)}`;
  }
  let r = vi ? "🏷️ **Giá các sản phẩm tìm được:**\n\n" : "🏷️ **Prices found:**\n\n";
  for (const p of products.slice(0, 8)) r += `• **${p.name}** — ${formatPrice(p.price, p.discount)}\n`;
  if (products.length > 8) r += vi ? `\n_...và ${products.length - 8} sản phẩm khác._` : `\n_...and ${products.length - 8} more._`;
  return r;
}

function detailResponse(products: ProductInfo[], vi: boolean): string {
  if (products.length === 1) {
    const p = products[0];
    return `🌿 **${p.name}**
📂 ${vi ? "Danh mục" : "Category"}: ${p.categoryTitle || "—"}
📍 ${vi ? "Xuất xứ" : "Origin"}: ${p.origin}
📝 ${p.description}
💰 ${vi ? "Giá" : "Price"}: ${formatPrice(p.price, p.discount)}
⭐ ${vi ? "Đánh giá" : "Rating"}: ${p.rating}/5 (${p.reviews} ${vi ? "lượt" : "reviews"})
${formatStock(p.stock, p.status, vi)}`;
  }
  let r = vi ? "🔍 **Sản phẩm tìm được:**\n\n" : "🔍 **Products found:**\n\n";
  for (const p of products.slice(0, 6)) {
    r += `**${p.name}** — ${formatPrice(p.price, p.discount)}\n  📍 ${p.origin} | ⭐ ${p.rating}/5 | ${formatStock(p.stock, p.status, vi)}\n\n`;
  }
  if (products.length > 6) r += vi ? `_...và ${products.length - 6} sản phẩm khác._` : `_...and ${products.length - 6} more._`;
  return r;
}

function stockResponse(products: ProductInfo[], vi: boolean): string {
  if (products.length === 1) {
    const p = products[0];
    return `📦 **${p.name}**\n${formatStock(p.stock, p.status, vi)}\n💰 ${vi ? "Giá" : "Price"}: ${formatPrice(p.price, p.discount)}`;
  }
  let r = vi ? "📦 **Tình trạng kho:**\n\n" : "📦 **Stock status:**\n\n";
  for (const p of products.slice(0, 8)) r += `• **${p.name}** — ${formatStock(p.stock, p.status, vi)}\n`;
  return r;
}

function recommendResponse(products: ProductInfo[], vi: boolean): string {
  const sorted = [...products].filter(p => p.rating >= 4.5)
    .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews)).slice(0, 5);
  let r = vi ? "⭐ **Sản phẩm được yêu thích nhất:**\n\n" : "⭐ **Top Recommendations:**\n\n";
  const medals = ["🥇", "🥈", "🥉", "✨", "✨"];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    r += `${medals[i]} **${p.name}** — ${formatPrice(p.price, p.discount)}\n  ⭐ ${p.rating}/5 (${p.reviews} ${vi ? "lượt" : "reviews"}) | 📍 ${p.origin}\n\n`;
  }
  const deals = products.filter(p => p.discount && p.discount > 0).slice(0, 3);
  if (deals.length > 0) {
    r += vi ? "🔥 **Đang giảm giá:**\n" : "🔥 **Hot Deals:**\n";
    for (const p of deals) r += `• **${p.name}** — ${formatPrice(p.price, p.discount)}\n`;
  }
  return r;
}

function notFound(query: string, vi: boolean): string {
  if (vi) return `🤔 Mình không tìm thấy sản phẩm nào khớp với **"${query}"**.

💡 Thử:
• Gõ tên sản phẩm (ví dụ: "xoài", "cà rốt", "táo")
• Hỏi theo danh mục ("có rau gì?", "trái cây")
• Gõ **"giúp"** để xem hướng dẫn!`;

  return `🤔 No products matching **"${query}"**.

💡 Try:
• Product names (e.g., "Apple", "Carrot")
• Categories ("What fruits do you have?")
• Type **"help"** for guidance!`;
}

/* ── Main handler ─────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: { role: string; content: string }[] = body.messages ?? [];
    const userMessage = messages[messages.length - 1]?.content ?? "";
    if (!userMessage.trim()) return NextResponse.json({ reply: "Please type a message! 😊" });

    const vi = isVietnamese(userMessage);
    const intent = detectIntent(userMessage);

    if (intent === "greeting") return NextResponse.json({ reply: greeting(vi) });
    if (intent === "help") return NextResponse.json({ reply: helpMsg(vi) });

    // Load DB
    const db = await readDb();
    const products = db.products.map(p => ({ ...p, origin: (p as any).origin ?? "" }));
    const categories = db.categories;

    const toInfo = (p: typeof products[0]): ProductInfo => ({
      name: p.name, price: p.price, discount: p.discount ?? null,
      origin: (p as any).origin ?? "", description: p.description,
      rating: p.rating, reviews: p.reviews, stock: p.stock ?? null,
      status: p.status, categoryTitle: p.categoryTitle,
    });

    // Category listing (including Vietnamese)
    if (intent === "category_list") {
      const viCat = detectViCategory(userMessage);
      if (viCat) {
        const catProds = products.filter(p => normalize(p.categoryTitle ?? "").includes(normalize(viCat)));
        if (catProds.length > 0) {
          let r = `📂 **${viCat}** (${catProds.length} ${vi ? "sản phẩm" : "products"})\n\n`;
          for (const p of catProds.slice(0, 10)) r += `• **${p.name}** — ${formatPrice(p.price, p.discount ?? null)}\n`;
          if (catProds.length > 10) r += vi ? `\n_...và ${catProds.length - 10} sản phẩm khác._` : `\n_...and ${catProds.length - 10} more._`;
          return NextResponse.json({ reply: r });
        }
      }
      let r = vi ? "📂 **Danh mục sản phẩm:**\n\n" : "📂 **Product categories:**\n\n";
      for (const c of categories) {
        const emoji = c.title.includes("FRUIT") ? "🍎" : c.title.includes("VEGETABLE") ? "🥬" : "📦";
        const count = products.filter(p => p.categoryId === c.id).length || c.count;
        r += `${emoji} **${c.title}** — ${count} ${vi ? "sản phẩm" : "products"}\n`;
      }
      r += vi ? "\nHỏi về danh mục cụ thể để xem chi tiết!" : "\nAsk about any category to see its products!";
      return NextResponse.json({ reply: r });
    }

    // Recommendations
    if (intent === "recommend") {
      return NextResponse.json({ reply: recommendResponse(products.map(toInfo), vi) });
    }

    // Search products (with Vietnamese support)
    // First try Vietnamese category detection for search intents
    const viCat = detectViCategory(userMessage);
    if (viCat) {
      const catProds = products.filter(p => normalize(p.categoryTitle ?? "").includes(normalize(viCat)));
      if (catProds.length > 0) {
        if (intent === "price") return NextResponse.json({ reply: priceResponse(catProds.map(toInfo), vi) });
        if (intent === "stock") return NextResponse.json({ reply: stockResponse(catProds.map(toInfo), vi) });
        let r = `📂 **${viCat}** (${catProds.length} ${vi ? "sản phẩm" : "products"})\n\n`;
        for (const p of catProds.slice(0, 10)) r += `• **${p.name}** — ${formatPrice(p.price, p.discount ?? null)}\n`;
        return NextResponse.json({ reply: r });
      }
    }

    // Score-based product search
    const scored = products
      .map(p => ({ product: p, score: scoreMatch(userMessage, { name: p.name, categoryTitle: p.categoryTitle, origin: (p as any).origin ?? "" }) }))
      .filter(item => item.score >= 40)
      .sort((a, b) => b.score - a.score);

    const matched = scored.map(s => s.product);

    if (matched.length === 0) {
      return NextResponse.json({ reply: notFound(userMessage, vi) });
    }

    const infos = matched.map(toInfo);
    switch (intent) {
      case "price": return NextResponse.json({ reply: priceResponse(infos, vi) });
      case "stock": return NextResponse.json({ reply: stockResponse(infos, vi) });
      case "sale": return NextResponse.json({ reply: saleResponse(products.map(toInfo), vi) });
      case "trending": return NextResponse.json({ reply: trendingResponse(products.map(toInfo), vi) });
      case "recommend": return NextResponse.json({ reply: recommendResponse(products.map(toInfo), vi) });
      default: return NextResponse.json({ reply: detailResponse(infos, vi) });
    }
  } catch (error) {
    console.error("[chat API error]", error);
    return NextResponse.json({ reply: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại! 🙏" }, { status: 500 });
  }
}
