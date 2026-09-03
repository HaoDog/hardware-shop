const KEY = 'hw-shop-cart-v2';
const state = {
  shelf: 'kit',
  cart: {},
  sheet: null,
  order: null,
};

function loadCart() {
  try { state.cart = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
  catch { state.cart = {}; }
}
function saveCart() {
  localStorage.setItem(KEY, JSON.stringify(state.cart));
}
function product(id) { return window.HW_SHOP.find(id); }
function lines() {
  return Object.entries(state.cart)
    .map(([id, qty]) => ({ product: product(id), qty }))
    .filter((line) => line.product && line.qty > 0);
}
function count() { return lines().reduce((sum, line) => sum + line.qty, 0); }
function total() { return lines().reduce((sum, line) => sum + line.product.priceCents * line.qty, 0); }
function kitProduct() { return window.HW_SHOP.products.find((item) => item.contents); }

function setQty(id, qty) {
  const item = product(id);
  if (!item) return;
  const next = Math.max(0, Math.min(item.maxQty, Math.floor(qty)));
  if (next <= 0) delete state.cart[id];
  else state.cart[id] = next;
  saveCart();
  render();
}
function openSheet(name) {
  state.sheet = name;
  render();
}
function closeSheet() {
  if (state.sheet === 'pay') state.order = null;
  state.sheet = null;
  render();
}
function onMask(event) {
  if (event.target.id === 'mask') closeSheet();
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.hidden = true; }, 1600);
}

function copyText(text, ok) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast(ok)).catch(() => toast('请长按复制'));
    return;
  }
  toast('请长按复制');
}

function stepper(id, qty) {
  return `<div class="stepper">
    <button type="button" aria-label="减少" onclick="setQty('${id}', ${qty - 1})">−</button>
    <span>${qty}</span>
    <button type="button" aria-label="增加" onclick="setQty('${id}', ${qty + 1})">+</button>
  </div>`;
}

function contentsHtml(item) {
  const rows = item.contents.map((part) => {
    const qty = part.qty || 1;
    const name = qty > 1 ? `${part.name} × ${qty}` : part.name;
    const right = part.gift
      ? `附赠 / ${part.unit}`
      : `${window.HW_SHOP.yuan(part.priceCents)} / ${part.unit}`;
    return `
    <li>
      <span>${name}</span>
      <span>${right}</span>
    </li>`;
  }).join('');
  const giftCount = item.contents.reduce((sum, part) => sum + (part.gift ? (part.qty || 1) : 0), 0);
  const partCount = item.contents.reduce((sum, part) => sum + (part.gift ? 0 : (part.qty || 1)), 0);
  return `<div class="contents">
    <p class="contents-title">套餐内容 · ${partCount} 件元器件，附赠 ${giftCount} 张券</p>
    <ul>${rows}</ul>
    <div class="row">
      <span>基础款套餐</span>
      <strong class="price">${window.HW_SHOP.yuan(item.priceCents)}</strong>
    </div>
  </div>`;
}

function cartHtml() {
  if (!lines().length) return '<p>还没有选器材。点卡片上的「加入清单」即可。</p>';
  return `<ul>${lines().map(({ product: item, qty }) => `
    <li class="line">
      <img src="${item.image}" alt="">
      <div>
        <strong>${item.name}</strong>
        <div>${window.HW_SHOP.yuan(item.priceCents)} × ${qty}</div>
      </div>
      ${stepper(item.id, qty)}
    </li>`).join('')}</ul>`;
}

function buyNow() {
  if (!count()) return;
  const no = 'CS-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  state.order = { no, total: total() };
  state.cart = {};
  saveCart();
  state.sheet = 'pay';
  render();
}

function render() {
  document.body.classList.toggle('locked', Boolean(state.sheet));
  const n = count();
  const sum = window.HW_SHOP.yuan(total());

  document.getElementById('shelves').innerHTML = window.HW_SHOP.shelves.map((shelf) => `
    <button type="button" class="tab ${state.shelf === shelf.id ? 'active' : ''}" onclick="state.shelf='${shelf.id}';render()">
      ${shelf.label}${shelf.recommend ? '（<span class="recommend">推荐</span>）' : ''}
    </button>`).join('');
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = n;
  document.getElementById('grid').innerHTML = window.HW_SHOP.products
    .filter((item) => item.shelf === state.shelf)
    .map((item) => {
      const qty = state.cart[item.id] || 0;
      const isKit = Boolean(item.contents);
      return `<article class="card ${isKit ? 'kit-card' : 'part-card'}">
        <img src="${item.image}" alt="${item.name}">
        <div class="body">
          <div class="row"><h3>${item.name}</h3><div class="price">${window.HW_SHOP.yuan(item.priceCents)}</div></div>
          <p class="summary">${item.summary}</p>
          <p class="why">${item.why}</p>
          <div class="actions">
            ${isKit ? `<button type="button" class="btn ghost" onclick="openSheet('kit')">查看内容</button>` : ''}
            ${qty ? stepper(item.id, qty) : `<button type="button" class="btn add" onclick="setQty('${item.id}', 1)">加入清单</button>`}
            <span class="unit">${item.unit}</span>
          </div>
        </div>
      </article>`;
    }).join('');

  document.getElementById('cart').innerHTML = `
    <p class="eyebrow">✦ CART ✦</p>
    <h2>器材清单</h2>
    ${cartHtml()}
    <p>合计</p>
    <p class="total">${sum}</p>
    <button type="button" class="btn gold" ${n ? '' : 'disabled'} onclick="buyNow()">一键购买</button>`;

  const dock = document.getElementById('dock');
  dock.hidden = Boolean(state.sheet);
  dock.innerHTML = `
    <button type="button" class="dock-meta" onclick="openSheet('cart')">
      <span>${n ? `已选 ${n} 件 · 点看清单` : '还没选器材'}</span>
      <strong class="price">${sum}</strong>
    </button>
    <button type="button" class="btn gold" ${n ? '' : 'disabled'} onclick="buyNow()">一键购买</button>`;

  const mask = document.getElementById('mask');
  if (!state.sheet) { mask.hidden = true; mask.innerHTML = ''; return; }
  mask.hidden = false;
  mask.setAttribute('onclick', 'onMask(event)');

  if (state.sheet === 'kit') {
    const kit = kitProduct();
    mask.innerHTML = `<div class="dialog" onclick="event.stopPropagation()">
      <div class="handle"></div>
      <div class="row"><h2>基础款套餐</h2><button type="button" class="btn add" onclick="closeSheet()">关闭</button></div>
      ${contentsHtml(kit)}
      <div class="actions">
        <button type="button" class="btn add" onclick="setQty('basic-kit', (state.cart['basic-kit'] || 0) + 1); closeSheet(); toast('已加入清单')">加入清单</button>
      </div>
    </div>`;
    return;
  }

  if (state.sheet === 'pay' && state.order) {
    const amount = window.HW_SHOP.yuan(state.order.total);
    mask.innerHTML = `<div class="dialog" onclick="event.stopPropagation()">
      <div class="handle"></div>
      <div class="row"><h2>扫码付款</h2><button type="button" class="btn add" onclick="closeSheet()">关闭</button></div>
      <p>请按下面金额支付 · 单号 ${state.order.no}</p>
      <p class="pay-amount">${amount}</p>
      <div class="copy-row">
        <button type="button" class="btn ghost" onclick="copyText('${amount.replace('¥', '')}', '金额已复制')">复制金额</button>
        <button type="button" class="btn ghost" onclick="copyText('${state.order.no}', '单号已复制')">复制单号</button>
      </div>
      <img class="qr" src="./course-shop/wechat-pay-qr.jpg" alt="学加家学费码">
      <p>手机上请<strong>长按收款码</strong>，用微信或支付宝识别；电脑上直接扫。付完把截图发给老师，或现场报单号。</p>
    </div>`;
    return;
  }

  mask.innerHTML = `<div class="dialog" onclick="event.stopPropagation()">
    <div class="handle"></div>
    <div class="row"><h2>器材清单</h2><button type="button" class="btn add" onclick="closeSheet()">关闭</button></div>
    ${cartHtml()}
    <p>合计</p>
    <p class="total">${sum}</p>
    <button type="button" class="btn gold" ${n ? '' : 'disabled'} onclick="buyNow()" style="width:100%">一键购买</button>
  </div>`;
}

window.state = state;
window.setQty = setQty;
window.openSheet = openSheet;
window.closeSheet = closeSheet;
window.onMask = onMask;
window.buyNow = buyNow;
window.copyText = copyText;
window.toast = toast;
window.render = render;
loadCart();
const params = new URLSearchParams(location.search);
if (params.get('shelf') === 'part') state.shelf = 'part';
if (params.get('add') && product(params.get('add'))) state.cart[params.get('add')] = 1;
render();
