const KEY = 'hw-shop-cart-v2';
const state = {
  shelf: 'kit',
  cart: {},
  open: false,
  kitOpen: false,
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
function setQty(id, qty) {
  const item = product(id);
  if (!item) return;
  const next = Math.max(0, Math.min(item.maxQty, Math.floor(qty)));
  if (next <= 0) delete state.cart[id];
  else state.cart[id] = next;
  saveCart();
  render();
}
function toggleKit(event) {
  if (event) event.stopPropagation();
  state.kitOpen = !state.kitOpen;
  render();
}

function stepper(id, qty) {
  return `<div class="stepper">
    <button type="button" onclick="setQty('${id}', ${qty - 1})">−</button>
    <span>${qty}</span>
    <button type="button" onclick="setQty('${id}', ${qty + 1})">+</button>
  </div>`;
}

function contentsHtml(item) {
  if (!item.contents) return '';
  const rows = item.contents.map((part) => `
    <li>
      <span>${part.name}</span>
      <span>${window.HW_SHOP.yuan(part.priceCents)} / ${part.unit}</span>
    </li>`).join('');
  return `<div class="contents">
    <p class="contents-title">套餐内容 · 共 ${item.contents.length} 件</p>
    <ul>${rows}</ul>
    <div class="row">
      <span>散件合计</span>
      <span class="list-price">${window.HW_SHOP.yuan(item.listPriceCents)}</span>
    </div>
    <div class="row">
      <span>基础款套餐（八折）</span>
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
  state.open = true;
  render();
}

function render() {
  const shelves = document.getElementById('shelves');
  shelves.innerHTML = window.HW_SHOP.shelves.map((shelf) => `
    <button class="shelf ${state.shelf === shelf.id ? 'active' : ''}" onclick="state.shelf='${shelf.id}';render()">
      <small>✦ ${shelf.id === 'kit' ? 'KITS' : 'PARTS'} ✦</small>
      <div><strong>${shelf.label}</strong>${shelf.recommend ? '（<span class="recommend">推荐</span>）' : ''}</div>
      <div>${shelf.hint}</div>
    </button>`).join('');

  document.getElementById('grid').innerHTML = window.HW_SHOP.products
    .filter((item) => item.shelf === state.shelf)
    .map((item) => {
      const qty = state.cart[item.id] || 0;
      const isKit = Boolean(item.contents);
      const priceBlock = isKit
        ? `<div class="price-block"><span class="list-price">${window.HW_SHOP.yuan(item.listPriceCents)}</span><div class="price">${window.HW_SHOP.yuan(item.priceCents)}</div></div>`
        : `<div class="price">${window.HW_SHOP.yuan(item.priceCents)}</div>`;
      return `<article class="card ${isKit ? 'kit-card' : ''}">
        <img src="${item.image}" alt="${item.name}">
        <div class="body">
          <div class="row"><h3>${item.name}</h3>${priceBlock}</div>
          <p>${item.summary}</p>
          <p class="why">${item.why}</p>
          ${isKit && state.kitOpen ? contentsHtml(item) : ''}
          <div class="row">
            ${isKit ? `<button class="btn ghost" onclick="toggleKit(event)">${state.kitOpen ? '收起内容' : '查看套餐内容'}</button>` : ''}
            ${qty ? stepper(item.id, qty) : `<button class="btn add" onclick="setQty('${item.id}', 1)">加入清单</button>`}
            <span>${item.unit}</span>
          </div>
        </div>
      </article>`;
    }).join('');

  const cartBody = `
    <p class="eyebrow">✦ CART ✦</p>
    <h2>器材清单</h2>
    ${cartHtml()}
    <p>合计</p>
    <p class="total">${window.HW_SHOP.yuan(total())}</p>
    <button class="btn gold" ${count() ? '' : 'disabled'} onclick="buyNow()">一键购买</button>`;
  document.getElementById('cart').innerHTML = cartBody;
  document.getElementById('bar').style.display = count() && !state.open ? 'block' : 'none';
  document.getElementById('bar').innerHTML = `<button class="btn add" style="width:100%" onclick="state.open=true;render()">已选 ${count()} 件 · ${window.HW_SHOP.yuan(total())} · 打开清单</button>`;

  const mask = document.getElementById('mask');
  if (!state.open) { mask.hidden = true; return; }
  mask.hidden = false;
  if (state.order) {
    mask.innerHTML = `<div class="dialog">
      <div class="row"><h2>扫码付款</h2><button class="btn add" onclick="state.open=false;state.order=null;render()">关闭</button></div>
      <p>单号 ${state.order.no} · 请按 <strong>${window.HW_SHOP.yuan(state.order.total)}</strong> 扫码付款</p>
      <img class="qr" src="./course-shop/wechat-pay-qr.jpg" alt="学加家学费码">
      <p>微信或支付宝扫一扫，按上面的金额输入并完成支付。付完把截图发给老师，或现场报单号。</p>
    </div>`;
    return;
  }
  mask.innerHTML = `<div class="dialog">
    <div class="row"><h2>器材清单</h2><button class="btn add" onclick="state.open=false;render()">关闭</button></div>
    ${cartHtml()}
    <p>合计</p>
    <p class="total">${window.HW_SHOP.yuan(total())}</p>
    <button class="btn gold" ${count() ? '' : 'disabled'} onclick="buyNow()">一键购买</button>
  </div>`;
}

window.state = state;
window.setQty = setQty;
window.toggleKit = toggleKit;
window.buyNow = buyNow;
window.render = render;
loadCart();
render();
