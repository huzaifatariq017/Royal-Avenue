// ============================================
// ROYAL AVENUE - APP.JS - COMPLETE - FINAL
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyBlf_w6DPQdlIItPshoAAX7D5guWnHzZOU",
  authDomain: "urban-mart-e5c0a.firebaseapp.com",
  projectId: "urban-mart-e5c0a",
  storageBucket: "urban-mart-e5c0a.firebasestorage.app",
  messagingSenderId: "962504542587",
  appId: "1:962504542587:web:57f94ff24b3c8680cad5de"
};
try { firebase.initializeApp(firebaseConfig); } catch(e) {}
const auth = firebase.auth();
const db = firebase.firestore();

const U = '?w=900&q=80';
let pid = 1;
function P(n, c, pr, old, img) {
  return { id: pid++, name: n, cat: c, price: pr, old: old, img: 'https://images.unsplash.com/' + img + U };
}
const products = [
  // FASHION - 5 - FINAL
  P('Premium Wool Overcoat - Men Classic', 'Fashion', 7999, 11999, 'photo-1591047139829-d91aecb6caea'),
  P('Elegant Silk Evening Dress - Women', 'Fashion', 5999, 8999, 'photo-1595777457583-95e059d581b8'),
  P('Classic Premium White Shirt - Slim Fit', 'Fashion', 2999, 4499, 'photo-1603252109303-2751441dd157'),
  P('Luxury Leather Jacket - Black Premium', 'Fashion', 8999, 12999, 'photo-1551028719-00167b16eac5'),
  P('Premium Denim Jacket - Everyday Style', 'Fashion', 4499, 6499, 'photo-1543076447-215ad9ba6923'),
  // SHOES - 5 - FINAL
  P('Red Nike Style Sneakers - Running', 'Shoes', 7999, 11999, 'photo-1542291026-7eec264c27ff'),
  P('White Premium Sneakers - Everyday Comfort', 'Shoes', 4999, 7499, 'photo-1595950653106-6c9ebd614d3a'),
  P('Sport Sneakers - Stylish Lightweight', 'Shoes', 6499, 8999, 'photo-1560769629-975ec94e6a86'),
  P('Running Shoes - Premium Comfort', 'Shoes', 5999, 8499, 'photo-1600185365926-3a2ce3cdb9eb'),
  P('Leather Boots - Brown Ankle Premium', 'Shoes', 6999, 9999, 'photo-1520639888713-7851133b1ed0'),
  // WATCHES - 5 - FINAL
  P('Luxury Gold Watch - Premium Dial', 'Watches', 6999, 9999, 'photo-1614164185128-e4ec99c436d7'),
  P('Classic Gold Watch - Leather Strap', 'Watches', 6499, 8999, 'photo-1522312346375-d1a52e2b99b3'),
  P('Silver Classic Watch - Stainless Steel', 'Watches', 5499, 7999, 'photo-1434056886845-dac89ffe9b56'),
  P('Men Steel Chronograph Watch - Silver', 'Watches', 7499, 10999, 'photo-1524592094714-0f0654e20314'),
  P('Modern Minimal Watch - Black Dial', 'Watches', 5999, 8499, 'photo-1523275335684-37898b6baf30'),
  // HOME - 5 - FINAL
  P('Modern Home Chair - Premium Decor', 'Home', 8999, 12999, 'photo-1592078615290-033ee584e267'),
  P('Luxury Sofa Set - Modern Living Room', 'Home', 45999, 59999, 'photo-1555041469-a586c61ea9bc'),
  P('Luxury Bedsheet Set - King Size', 'Home', 3999, 5999, 'photo-1631049307264-da0ec9d70304'),
  P('Kitchen Collection - Cooking Set 5 Pcs', 'Home', 4999, 7499, 'photo-1584990347449-a2d4c2c6d4e8'),
  P('Home Decor Set - Premium Style', 'Home', 3499, 4999, 'photo-1586023492125-27b2c045efd7'),
  // BEAUTY - 5 - SAME
  P('Luxury Perfume - Pink Bottle 100ml', 'Beauty', 3999, 5999, 'photo-1541643600914-78b084683601'),
  P('Premium Perfume - Oud 100ml', 'Beauty', 4499, 6499, 'photo-1594035910387-fea47794261f'),
  P('Makeup Kit - Beauty Collection 12 Pcs', 'Beauty', 2999, 4499, 'photo-1512496015851-a90fb38ba796'),
  P('Skin Care Set - Glow 3 Pcs', 'Beauty', 2499, 3999, 'photo-1620916566398-39f1143ab7be'),
  P('Makeup Brush Set - Premium 10 Pcs', 'Beauty', 1999, 2999, 'photo-1596462502278-27bfdc403348'),
  // TECH - 5 - SAME
  P('Apple iPhone 16 Pro Max - 256GB', 'Tech', 185999, 219999, 'photo-1592750475338-74b7b21085ab'),
  P('Samsung Galaxy S24 Ultra - 512GB', 'Tech', 165999, 189999, 'photo-1610945265064-0e34e5519bbf'),
  P('Wireless Earbuds Pro - Noise Cancelling', 'Tech', 4999, 7999, 'photo-1590658268037-6bf12165a8df'),
  P('Wireless Headphones - Premium Sound', 'Tech', 6999, 9999, 'photo-1505740420928-5e560c06d30e'),
  P('Smart Watch - Fitness & Calling', 'Tech', 8999, 12999, 'photo-1579586337278-3befd40fd17a')
];
const cats = ['Fashion', 'Shoes', 'Watches', 'Home', 'Beauty', 'Tech'];
let cart = [];
try { cart = JSON.parse(localStorage.getItem('um_cart') || '[]'); } catch (e) { cart = []; }
let disc = 0;
let currentCat = 'All';
const $ = function(id) { return document.getElementById(id); };
function esc(s) { s = String(s || ''); s = s.split('&').join('&amp;'); s = s.split('<').join('&lt;'); s = s.split('>').join('&gt;'); return s; }
function openModal(html) { $('modalBody').innerHTML = html; $('modal').classList.remove('hidden'); }
function closeModal() { $('modal').classList.add('hidden'); }
function goHome() { filterCat('All'); window.scrollTo(0, 0); }
function renderCats() {
  let html = '';
  for (let i = 0; i < cats.length; i++) {
    let c = cats[i];
    let p = null;
    for (let j = 0; j < products.length; j++) { if (products[j].cat === c) { p = products[j]; break; } }
    html += '<div class="cat-card" onclick="filterCat(\'' + c + '\')">';
    html += '<img src="' + p.img + '">';
    html += '<div><b>' + c + '</b><br><small>5 Products</small></div>';
    html += '</div>';
  }
  $('catGrid').innerHTML = html;
}
function renderProducts(list) {
  if (!list.length) { $('productGrid').innerHTML = '<p>No products found.</p>'; return; }
  let html = '';
  for (let i = 0; i < list.length; i++) {
    let p = list[i];
    html += '<div class="pc" onclick="openDetail(' + p.id + ')">';
    html += '<img src="' + p.img + '">';
    html += '<div class="info"><small>' + p.cat + '</small>';
    html += '<h3>' + esc(p.name) + '</h3>';
    html += '<b>Rs. ' + p.price.toLocaleString() + '</b> ';
    html += '<s>Rs. ' + p.old.toLocaleString() + '</s>';
    html += '<button onclick="event.stopPropagation();addToCart(' + p.id + ')">Add to Cart</button>';
    html += '</div></div>';
  }
  $('productGrid').innerHTML = html;
}
function filterCat(c, btn) {
  currentCat = c;
  let btns = document.querySelectorAll('nav button');
  for (let i = 0; i < btns.length; i++) { btns[i].classList.remove('on'); }
  if (btn) btn.classList.add('on');
  $('gridTitle').innerText = (c === 'All') ? 'Just For You' : c;
  if (c === 'All') { renderProducts(products); }
  else {
    let filtered = [];
    for (let i = 0; i < products.length; i++) { if (products[i].cat === c) filtered.push(products[i]); }
    renderProducts(filtered);
  }
  window.scrollTo(0, 0);
}
function doSearch() {
  let q = $('searchInput').value.trim().toLowerCase();
  if (!q) {
    if (currentCat === 'All') renderProducts(products);
    else {
      let f = [];
      for (let i = 0; i < products.length; i++) { if (products[i].cat === currentCat) f.push(products[i]); }
      renderProducts(f);
    }
    return;
  }
  let res = [];
  for (let i = 0; i < products.length; i++) {
    let p = products[i];
    if (p.name.toLowerCase().indexOf(q) > -1 || p.cat.toLowerCase().indexOf(q) > -1) { res.push(p); }
  }
  renderProducts(res);
}
function openDetail(id) {
  let p = null;
  for (let i = 0; i < products.length; i++) { if (products[i].id === id) { p = products[i]; break; } }
  if (!p) return;
  let html = '';
  html += '<h2>' + esc(p.name) + '</h2>';
  html += '<img src="' + p.img + '" style="width:100%;border-radius:12px;margin:10px 0">';
  html += '<p>' + p.cat + ' • 4.9 Rating • 100% Original</p>';
  html += '<h2 style="margin:10px 0">Rs. ' + p.price.toLocaleString() + ' <s style="font-size:14px;color:#999">Rs. ' + p.old.toLocaleString() + '</s></h2>';
  html += '<p style="margin:10px 0">100% Original. Vehari Same Day Delivery. 7-Day Return. COD Available.</p>';
  html += '<button class="gold" style="width:100%" onclick="addToCart(' + p.id + ');openCart()">Buy Now</button>';
  html += '<button style="width:100%;margin-top:8px" onclick="addToCart(' + p.id + ')">Add to Cart</button>';
  openModal(html);
}
function saveCart() { try { localStorage.setItem('um_cart', JSON.stringify(cart)); } catch (e) {} }
function addToCart(id) {
  let found = null;
  for (let i = 0; i < cart.length; i++) { if (cart[i].id === id) { found = cart[i]; break; } }
  if (found) { found.qty++; }
  else {
    let p = null;
    for (let i = 0; i < products.length; i++) { if (products[i].id === id) { p = products[i]; break; } }
    cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
  }
  saveCart(); updateCart(); alert('Added to cart.');
}
function updateCart() {
  let totalQty = 0;
  for (let i = 0; i < cart.length; i++) totalQty += cart[i].qty;
  $('cartCount').innerText = totalQty;
}
function getSubtotal() {
  let sub = 0;
  for (let i = 0; i < cart.length; i++) sub += cart[i].price * cart[i].qty;
  return sub;
}
function openCart() {
  let sub = getSubtotal();
  let del = (sub >= 5000 || sub === 0) ? 0 : 200;
  let tot = sub + del - disc;
  if (tot < 0) tot = 0;
  let msg = '';
  if (sub === 0) msg = '';
  else if (sub >= 5000) msg = 'You got FREE Delivery!';
  else msg = 'Add Rs. ' + (5000 - sub).toLocaleString() + ' more for FREE Delivery!';
  let itemsHtml = '';
  if (cart.length === 0) { itemsHtml = '<p>Your cart is empty.</p>'; }
  else {
    for (let i = 0; i < cart.length; i++) {
      let it = cart[i];
      itemsHtml += '<div style="display:flex;gap:10px;margin-bottom:8px">';
      itemsHtml += '<img src="' + it.img + '" style="width:60px;height:60px;object-fit:contain">';
      itemsHtml += '<div style="flex:1"><b>' + esc(it.name) + '</b><br>';
      itemsHtml += 'Qty: ' + it.qty + ' ';
      itemsHtml += '<button onclick="changeQty(' + i + ',1)">+</button> ';
      itemsHtml += '<button onclick="changeQty(' + i + ',-1)">-</button> ';
      itemsHtml += '<a onclick="removeItem(' + i + ')" style="color:#c00">Remove</a></div>';
      itemsHtml += '<b>Rs. ' + (it.price * it.qty).toLocaleString() + '</b></div>';
    }
  }
  let delText = (del === 0) ? 'FREE' : 'Rs. ' + del;
  let html = '';
  html += '<h2>Shopping Cart</h2>';
  html += '<p style="color:#0a7a42;font-weight:700;margin:8px 0">' + msg + '</p>';
  html += itemsHtml;
  html += '<hr>';
  html += '<p>Subtotal: <b>Rs. ' + sub.toLocaleString() + '</b></p>';
  html += '<p>Delivery: <b>' + delText + '</b></p>';
  html += '<p>Total: <b>Rs. ' + tot.toLocaleString() + '</b></p>';
  html += '<label style="margin-top:10px">Promo Code</label>';
  html += '<input id="voucher" placeholder="ROYAL10">';
  html += '<button onclick="applyVoucher()">Apply Code</button>';
  html += '<button class="gold" style="width:100%;margin-top:8px" onclick="openCheckout()">Proceed to Checkout</button>';
  openModal(html);
}
function changeQty(i, d) { cart[i].qty += d; if (cart[i].qty <= 0) cart.splice(i, 1); saveCart(); updateCart(); openCart(); }
function removeItem(i) { cart.splice(i, 1); saveCart(); updateCart(); openCart(); }
function applyVoucher() {
  let v = $('voucher').value.trim().toUpperCase();
  if (v === 'ROYAL10' || v === 'URBAN10') { disc = 500; alert('Rs. 500 discount applied!'); }
  else { disc = 0; alert('Invalid code. Try: ROYAL10'); }
  openCart();
}
function openAuth(mode) {
  if (mode === 'login') {
    let html = '';
    html += '<h2>Welcome Back</h2>';
    html += '<label>Email</label><input id="aEmail" type="email" placeholder="Enter your email">';
    html += '<label>Password</label><input id="aPass" type="password" placeholder="Enter password">';
    html += '<button class="dark" style="width:100%" onclick="doLogin()">Login</button>';
    html += '<p style="margin-top:10px">New? <a onclick="openAuth(\'register\')">Create Account</a> • <a onclick="forgotPass()">Forgot Password?</a></p>';
    html += '<p><a onclick="closeModal()">Continue as Guest</a></p>';
    openModal(html);
  } else {
    let html = '';
    html += '<h2>Create Account</h2>';
    html += '<label>Full Name</label><input id="aName" placeholder="Enter your full name">';
    html += '<label>Phone</label><input id="aPhone" placeholder="03XX-XXXXXXX">';
    html += '<label>Email</label><input id="aEmail" type="email" placeholder="Enter your email">';
    html += '<label>Password</label><input id="aPass" type="password" placeholder="Min 6 characters">';
    html += '<button class="gold" style="width:100%" onclick="doRegister()">Create Account</button>';
    html += '<p style="margin-top:10px">Already have an account? <a onclick="openAuth(\'login\')">Login</a></p>';
    openModal(html);
  }
}
async function doRegister() {
  let name = $('aName').value.trim();
  let phone = $('aPhone').value.trim();
  let email = $('aEmail').value.trim();
  let pass = $('aPass').value;
  if (name.length < 3) return alert('Enter full name.');
  let cleanPhone = phone.replace(/[\s-]/g, '');
  if (!/^03\d{9}$/.test(cleanPhone)) return alert('Enter valid phone 03XX-XXXXXXX.');
  if (pass.length < 6) return alert('Password min 6 chars.');
  try {
    let cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('users').doc(cred.user.uid).set({ name: name, phone: phone, email: email, createdAt: new Date() });
    alert('Account created!'); closeModal();
  } catch (e) { alert(e.message); }
}
async function doLogin() {
  let email = $('aEmail').value.trim();
  let pass = $('aPass').value;
  try { await auth.signInWithEmailAndPassword(email, pass); alert('Welcome back!'); closeModal(); }
  catch (e) { alert(e.message); }
}
async function forgotPass() {
  let email = prompt('Enter your email:');
  if (!email) return;
  try { await auth.sendPasswordResetEmail(email); alert('Reset link sent to your email.'); }
  catch (e) { alert(e.message); }
}
function logout() { auth.signOut(); alert('Logged out.'); }
auth.onAuthStateChanged(function(user) {
  let out = $('loggedOut'); let inn = $('loggedIn');
  if (user) { out.classList.add('hidden'); inn.classList.remove('hidden'); }
  else { inn.classList.add('hidden'); out.classList.remove('hidden'); }
});
function openCheckout() {
  if (!cart.length) return alert('Cart is empty.');
  if (!auth.currentUser) return openAuth('login');
  let sub = getSubtotal();
  let tot = sub + (sub >= 5000 ? 0 : 200) - disc;
  let itemsHtml = '';
  for (let i = 0; i < cart.length; i++) {
    let c = cart[i];
    itemsHtml += '<div style="display:flex;justify-content:space-between"><span>' + esc(c.name) + ' x ' + c.qty + '</span><b>Rs. ' + (c.price * c.qty).toLocaleString() + '</b></div>';
  }
  let html = '';
  html += '<h2>Checkout - Secure</h2>';
  html += '<label>Full Name</label><input id="ckName" value="' + esc(auth.currentUser.displayName || '') + '">';
  html += '<label>Phone</label><input id="ckPhone" placeholder="03XX-XXXXXXX">';
  html += '<label>Complete Address</label><input id="ckAddr" placeholder="House, Street, Vehari">';
  html += '<p style="margin:10px 0"><b>Payment Method</b></p>';
  html += '<label><input type="radio" name="pay" value="COD" checked onchange="togglePay()"> Cash on Delivery</label><br>';
  html += '<label><input type="radio" name="pay" value="JazzCash" onchange="togglePay()"> JazzCash</label><br>';
  html += '<label><input type="radio" name="pay" value="EasyPaisa" onchange="togglePay()"> EasyPaisa</label>';
  html += '<div id="payInfo" class="hidden" style="background:#fff8e6;padding:12px;border-radius:10px;margin:10px 0">';
  html += '<b id="payTitle"></b><p id="payDetails" style="font-size:13px;white-space:pre-line"></p>';
  html += '<label>Transaction ID (TID)</label><input id="ckTxn" placeholder="Enter Transaction ID">';
  html += '</div>';
  html += itemsHtml;
  html += '<p style="margin-top:10px">Total Payable: <b>Rs. ' + tot.toLocaleString() + '</b></p>';
  html += '<button class="gold" style="width:100%" onclick="placeOrder()">Place Order</button>';
  openModal(html);
}
function togglePay() {
  let pay = document.querySelector('input[name="pay"]:checked').value;
  let box = $('payInfo');
  if (pay === 'COD') { box.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  $('payTitle').innerText = pay + ' Payment';
  $('payDetails').innerText = 'Send payment to:\nAccount Title: Huzaifa Tariq\nAccount Number: 0334-1765911\nSend exact total, then enter Transaction ID.';
}
async function placeOrder() {
  let user = auth.currentUser;
  if (!user) return openAuth('login');
  let name = $('ckName').value.trim();
  let phone = $('ckPhone').value.trim();
  let addr = $('ckAddr').value.trim();
  if (name.length < 3) return alert('Enter full name.');
  let cleanPhone = phone.replace(/[\s-]/g, '');
  if (!/^03\d{9}$/.test(cleanPhone)) return alert('Invalid phone! Enter 03XX-XXXXXXX');
  if (addr.length < 10) return alert('Enter complete address.');
  let pay = document.querySelector('input[name="pay"]:checked').value;
  let txnEl = $('ckTxn');
  let txn = txnEl ? txnEl.value.trim() : '';
  if (pay !== 'COD' && txn.length < 5) return alert('Enter Transaction ID for ' + pay);
  let sub = getSubtotal();
  let total = sub + (sub >= 5000 ? 0 : 200) - disc;
  let oid = 'RA-' + Math.floor(1000 + Math.random() * 9000);
  let items = '';
  for (let i = 0; i < cart.length; i++) { if (i > 0) items += ', '; items += cart[i].name + ' x ' + cart[i].qty; }
  try {
    await db.collection('orders').doc(oid).set({ id: oid, userId: user.uid, email: user.email, name: name, phone: phone, address: addr, items: items, total: total, pay: pay, txn: txn, status: 'On The Way', createdAt: new Date() });
    let wa = 'New Order ' + oid + '\nName: ' + name + '\nPhone: ' + phone + '\nAddress: ' + addr + '\nPayment: ' + pay + '\nItems: ' + items + '\nTotal: Rs. ' + total;
    cart = []; disc = 0; saveCart(); updateCart();
    alert('Order placed! Your Order ID is ' + oid);
    window.open('https://wa.me/923341765911?text=' + encodeURIComponent(wa), '_blank');
    closeModal();
  } catch (e) { alert(e.message); }
}
function openTrack() {
  let html = '';
  html += '<h2>Track Your Order</h2>';
  html += '<label>Order ID</label><input id="trackInput" placeholder="Enter Order ID">';
  html += '<div id="trackResult"></div>';
  html += '<button class="gold" onclick="doTrack()">Track Order</button>';
  openModal(html);
}
async function doTrack() {
  let id = $('trackInput').value.trim().toUpperCase();
  if (!id) return;
  try {
    let doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) { $('trackResult').innerHTML = '<p style="color:#c00">Order not found. Please check your Order ID.</p>'; return; }
    let o = doc.data();
    let html = '';
    html += '<div style="background:#e8f5e9;padding:12px;border-radius:10px;margin-top:10px">';
    html += '<b>' + o.id + '</b> - Rs. ' + o.total + '<br>';
    html += 'Status: <b>' + o.status + '</b><br>';
    html += 'Items: ' + esc(o.items) + '<br>';
    html += 'Payment: ' + o.pay;
    html += '</div>';
    $('trackResult').innerHTML = html;
  } catch (e) { alert(e.message); }
}
async function openDashboard() {
  let user = auth.currentUser;
  if (!user) return openAuth('login');
  openModal('<h2>My Account</h2><p><b>' + esc(user.displayName || '') + '</b><br>' + esc(user.email) + '</p><p>Loading orders...</p>');
  try {
    let snap = await db.collection('orders').where('userId', '==', user.uid).get();
    let orders = snap.docs.map(function(d) { return d.data(); });
    let ordersHtml = '';
    if (orders.length === 0) { ordersHtml = '<p>No orders yet.</p>'; }
    else {
      for (let i = 0; i < orders.length; i++) {
        let o = orders[i];
        ordersHtml += '<div style="border:1px solid #eee;padding:10px;border-radius:10px;margin-top:8px">';
        ordersHtml += '<b>' + esc(o.id) + '</b> - Rs. ' + o.total + '<br>';
        ordersHtml += 'Status: <b>' + esc(o.status) + '</b><br>';
        ordersHtml += 'Items: ' + esc(o.items) + '<br>';
        ordersHtml += 'Payment: ' + esc(o.pay);
        ordersHtml += '</div>';
      }
    }
    let html = '';
    html += '<h2>My Account</h2>';
    html += '<p><b>' + esc(user.displayName || '') + '</b><br>' + esc(user.email) + '</p>';
    html += '<h3 style="margin-top:12px">My Orders</h3>';
    html += ordersHtml;
    html += '<button style="width:100%;margin-top:12px" onclick="logout()">Logout</button>';
    openModal(html);
  } catch (e) {
    openModal('<h2>My Account</h2><p><b>' + esc(user.displayName || '') + '</b><br>' + esc(user.email) + '</p><p>No orders yet.</p><button style="width:100%;margin-top:12px" onclick="logout()">Logout</button>');
  }
}
function openInfo(type) {
  let title = 'Information';
  let body = '';
  if (type === 'shipping') { title = 'Shipping Information'; body = 'Vehari Same Day Delivery. All Pakistan 2-4 days. Free delivery on orders over Rs. 5,000. Otherwise Rs. 200 delivery charge. COD available.'; }
  else if (type === 'returns') { title = 'Returns & Refunds'; body = '7-Day Return. Product unused ho, original packing me ho. WhatsApp 0334-1765911 pe rabta karein. Refund 3-5 working days me.'; }
  else if (type === 'privacy') { title = 'Privacy Policy'; body = 'Aapka data sirf order ke liye use hota hai. Kisi teesre ko nahi diya jata.'; }
  else if (type === 'terms') { title = 'Terms & Conditions'; body = 'Prices change ho sakti hain. Order confirm karne se pehle stock check kiya jata hai. COD par parcel khol ke check karein.'; }
  else if (type === 'sell') { title = 'Sell on Royal Avenue'; body = 'Apna product bechna hai? WhatsApp 0334-1765911 pe product ki pics aur price bhejein.'; }
  else if (type === 'contact') { title = 'Contact Us'; body = 'Main Bazaar Road, Vehari<br>Phone: 0334-1765911<br>Email: support@royalavenue.pk<br>WhatsApp: <a href="https://wa.me/923341765911" target="_blank">Chat on WhatsApp</a>'; }
  else { title = 'Help'; body = 'Kisi bhi help ke liye WhatsApp karein: 0334-1765911'; }
  openModal('<h2>' + title + '</h2><p style="margin-top:10px">' + body + '</p>');
}
function subscribe() {
  let em = $('newsEmail').value.trim();
  if (!em || em.indexOf('@') === -1) return alert('Enter valid email.');
  alert('Thanks! Code ROYAL10 - Rs. 500 OFF. Aapko offers email par milengi.');
  $('newsEmail').value = '';
}
renderCats();
renderProducts(products);
updateCart();
