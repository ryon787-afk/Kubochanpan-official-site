'use strict';

const KUBO_STORAGE_KEY = 'kubochan_official_shop_v1';
const KUBO_CART_KEY = 'kubochan_official_cart_v1';

const ORDER_STATUSES = ['受付済み','銀行振込待ち','入金確認','発送準備','発送完了','キャンセル'];

const defaultData = {
  version: 'local-1.0.0',
  updatedAt: '',
  settings: {
    adminPassword: 'kubochan2025',
    adminEmail: '',
    privacyMode: true,
    bankInfo: {
      bankName: '〇〇銀行',
      branchName: '〇〇支店',
      accountType: '普通',
      accountNumber: '0000000',
      accountName: 'ユ）クボチャンパン'
    }
  },
  site: {
    title: 'くぼちゃんパン',
    catchcopy: 'ミルク屋さんが本気で作った、毎日食べたいパン。',
    subcopy: '自家製牛乳と北海道産小麦で、毎日の食卓にやさしいおいしさを届けます。',
    footerText: '© くぼちゃんパン All Rights Reserved.',
    storeInfo: '石川県七尾市の小さなパン屋です。',
    businessHours: '月・水・金 11:00〜17:00 / 前日17時まで予約',
    instagramUrl: 'https://www.instagram.com/',
    shopGuide: '初期版は銀行振込のみ対応しています。ご注文後、振込先をご案内します。',
    sections: {
      storyTitle: '私たちは、牛乳屋から始まりました。',
      storyBody: '<p>自家製牛乳をたっぷり使い、やさしい香りとふんわり食感のパンを焼いています。</p>',
      productTitle: 'おすすめ商品',
      productBody: '<p>毎日食べたくなる、ミルク感のあるパンを揃えています。</p>',
      shopTitle: '公式通販',
      shopBody: '<p>遠方のお客様にも、くぼちゃんパンの味をお届けできるよう準備しています。</p>'
    },
    images: { hero: '', main: '', stories: [] },
    heroPosition: 'center',
    notices: ['公式通販サイトの準備を進めています。']
  },
  products: [
    { id: 'milk-shokupan', name: '贅沢ミルク食パン', price: 700, category: '食パン', description: '自家製牛乳をたっぷり使った、毎日食べたい食パン。', material: '自家製牛乳、北海道産小麦、よつ葉バター使用。', recommend: '軽くトーストして、バターをのせるのがおすすめです。', visible: true, images: [] },
    { id: 'bagel-sand', name: 'ベーグルサンド', price: 370, category: '調理パン', description: 'もっちりベーグルに具材を合わせた満足感のあるサンド。', material: '北海道産小麦、自家製牛乳使用。', recommend: '少し温めると生地の香りが戻ります。', visible: true, images: [] },
    { id: 'cheesecake', name: 'ごほうびチーズケーキ', price: 450, category: 'スイーツ', description: 'なめらかでミルク感のある瓶入りチーズケーキ。', material: 'クリームチーズ、卵、牛乳、砂糖。', recommend: '冷蔵庫でしっかり冷やしてお召し上がりください。', visible: true, images: [] }
  ],
  banners: [
    { id: 'banner-shop', title: '公式通販はこちら', text: '贈り物やご自宅用に。', url: 'order.html', visible: true, order: 1, image: '' }
  ],
  orders: [],
  notifications: []
};

function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }

function mergeData(base, saved){
  const out = deepClone(base);
  if (!saved || typeof saved !== 'object') return out;
  Object.assign(out, saved);
  out.settings = Object.assign({}, base.settings, saved.settings || {});
  out.settings.bankInfo = Object.assign({}, base.settings.bankInfo, (saved.settings || {}).bankInfo || {});
  out.site = Object.assign({}, base.site, saved.site || {});
  out.site.sections = Object.assign({}, base.site.sections, (saved.site || {}).sections || {});
  out.site.images = Object.assign({}, base.site.images, (saved.site || {}).images || {});
  out.products = Array.isArray(saved.products) ? saved.products : base.products;
  out.banners = Array.isArray(saved.banners) ? saved.banners : base.banners;
  out.orders = Array.isArray(saved.orders) ? saved.orders : [];
  out.notifications = Array.isArray(saved.notifications) ? saved.notifications : [];
  return out;
}

function loadData(){
  try {
    const raw = localStorage.getItem(KUBO_STORAGE_KEY);
    return mergeData(defaultData, raw ? JSON.parse(raw) : null);
  } catch (e) {
    console.warn('loadData fallback', e);
    return deepClone(defaultData);
  }
}

function saveData(data){
  const safeData = mergeData(defaultData, data);
  safeData.updatedAt = new Date().toISOString();
  localStorage.setItem(KUBO_STORAGE_KEY, JSON.stringify(safeData));
  return safeData;
}

function resetData(){
  localStorage.removeItem(KUBO_STORAGE_KEY);
  return loadData();
}

function loadCart(){
  try { return JSON.parse(localStorage.getItem(KUBO_CART_KEY) || '[]'); }
  catch { return []; }
}
function saveCart(cart){ localStorage.setItem(KUBO_CART_KEY, JSON.stringify(cart || [])); }
function clearCart(){ localStorage.removeItem(KUBO_CART_KEY); }

function generateId(prefix='id'){
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
}
function yen(n){ return `¥${Number(n || 0).toLocaleString('ja-JP')}`; }
function escapeHTML(str=''){
  return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function safeHTML(html=''){
  const tpl = document.createElement('template');
  tpl.innerHTML = String(html || '');
  tpl.content.querySelectorAll('script,iframe,object,embed,form,input,button').forEach(el => el.remove());
  tpl.content.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
      if (attr.name === 'href' && /^javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
    });
  });
  return tpl.innerHTML;
}

async function saveImageFiles(fileList, maxWidth=1400, quality=.78){
  const files = Array.from(fileList || []);
  const results = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    results.push(await resizeImageToDataURL(file, maxWidth, quality));
  }
  return results;
}

function resizeImageToDataURL(file, maxWidth, quality){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function maskOrderForLog(order){
  return {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    customerName: order.customer?.name ? `${order.customer.name.slice(0,1)}***` : '',
    total: order.total,
    itemsCount: order.items?.length || 0,
    status: order.status
  };
}

function sendOrderNotification(orderData){
  const data = loadData();
  const notification = {
    id: generateId('notice'),
    type: 'order',
    createdAt: new Date().toISOString(),
    to: data.settings.adminEmail || '未設定',
    title: `新規注文 ${orderData.orderNumber}`,
    message: `新しい注文が入りました。合計 ${yen(orderData.total)} / ${orderData.items.length}商品`,
    orderNumber: orderData.orderNumber
  };
  data.notifications.unshift(notification);
  saveData(data);
  console.log('sendOrderNotification placeholder', maskOrderForLog(orderData));
  return notification;
}

window.KuboStorage = { ORDER_STATUSES, defaultData, loadData, saveData, resetData, loadCart, saveCart, clearCart, generateId, yen, escapeHTML, safeHTML, saveImageFiles, sendOrderNotification };
