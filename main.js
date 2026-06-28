'use strict';
const S = window.KuboStorage;
function firstImage(images){ return Array.isArray(images) && images[0] ? images[0] : ''; }
function renderImageBox(el, src, alt){ if(!el) return; el.innerHTML = src ? `<img src="${src}" alt="${S.escapeHTML(alt)}">` : S.escapeHTML(alt || '画像未登録'); }
function renderSite(){
  const data = S.loadData(); const site = data.site;
  document.title = site.title || 'くぼちゃんパン';
  document.querySelectorAll('[data-site-title]').forEach(el=>el.textContent=site.title);
  document.getElementById('hero-title').textContent = site.catchcopy;
  document.getElementById('hero-subcopy').textContent = site.subcopy;
  document.getElementById('story-title').textContent = site.sections.storyTitle;
  document.getElementById('story-body').innerHTML = S.safeHTML(site.sections.storyBody);
  document.getElementById('product-title').textContent = site.sections.productTitle;
  document.getElementById('product-body').innerHTML = S.safeHTML(site.sections.productBody);
  document.getElementById('shop-title').textContent = site.sections.shopTitle;
  document.getElementById('shop-body').innerHTML = S.safeHTML(site.sections.shopBody);
  document.getElementById('store-info').textContent = site.storeInfo;
  document.getElementById('business-hours').textContent = site.businessHours;
  document.getElementById('shop-guide').textContent = site.shopGuide;
  document.getElementById('footer-text').textContent = site.footerText;
  const ig = document.getElementById('instagram-link'); if(ig) ig.href = site.instagramUrl || '#';
  renderImageBox(document.getElementById('hero-image'), site.images.hero, 'ヒーロー画像');
  const heroBox = document.getElementById('hero-image'); if(heroBox) heroBox.style.objectPosition = site.heroPosition || 'center';
  renderImageBox(document.getElementById('main-image'), site.images.main, 'メイン画像');
  document.getElementById('notice-list').innerHTML = (site.notices||[]).map(n=>`<div class="notice">${S.escapeHTML(n)}</div>`).join('') || '<div class="notice">お知らせはありません</div>';
  document.getElementById('product-list').innerHTML = data.products.filter(p=>p.visible).map(p=>`<article class="card product-card"><div class="product-img">${firstImage(p.images)?`<img src="${firstImage(p.images)}" alt="${S.escapeHTML(p.name)}">`:'写真未登録'}</div><div class="product-body"><span class="pill">${S.escapeHTML(p.category)}</span><h3>${S.escapeHTML(p.name)}</h3><p>${S.escapeHTML(p.description)}</p><p class="price">${S.yen(p.price)}</p><button class="btn" onclick="addToCart('${p.id}')">カートに追加</button></div></article>`).join('');
  document.getElementById('banner-list').innerHTML = data.banners.filter(b=>b.visible).sort((a,b)=>(a.order||0)-(b.order||0)).map(b=>`<a class="card banner-card" href="${S.escapeHTML(b.url||'#')}"><div class="banner-img">${b.image?`<img src="${b.image}" alt="${S.escapeHTML(b.title)}">`:'バナー画像'}</div><div><h3>${S.escapeHTML(b.title)}</h3><p>${S.escapeHTML(b.text)}</p></div><strong>詳しく見る →</strong></a>`).join('');
}
function addToCart(id){ const data=S.loadData(); const product=data.products.find(p=>p.id===id); if(!product) return; const cart=S.loadCart(); const found=cart.find(i=>i.id===id); if(found) found.qty++; else cart.push({id:product.id,name:product.name,price:product.price,qty:1}); S.saveCart(cart); location.href='order.html'; }
document.addEventListener('DOMContentLoaded', renderSite);


/* --- 2026追加：カート追加ポップアップ --- */
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),1800);}
addToCart=function(id){const data=S.loadData();const product=data.products.find(p=>p.id===id);if(!product)return;const cart=S.loadCart();const found=cart.find(i=>i.id===id);if(found)found.qty++;else cart.push({id:product.id,name:product.name,price:product.price,qty:1});S.saveCart(cart);showToast('カートに追加しました');setTimeout(()=>{location.href='order.html';},650);};
