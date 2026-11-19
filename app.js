// ============================================
// URBAN MART - APP.JS - COMPLETE
// Firebase Auth + Firestore + Cart + Orders
// ============================================

// ===== 1. FIREBASE CONFIG =====
// Firebase Console -> Project Settings -> Web App se copy karo
// Yahan apni real keys paste karo

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_ID",
  appId: "PASTE_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===== 2. PRODUCTS - 30 PRODUCTS =====
const U = '?w=900&q=80';
let pid = 1;

function P(n, c, pr, old, img) {
  return {
    id: pid++,
    name: n,
    cat: c,
    price: pr,
    old: old,
    img: 'https://images.unsplash.com/' + img + U
  };
}

const products = [
  P('Apple iPhone 16 Pro Max - 256GB', 'Mobiles', 185999, 219999, 'photo-1592750475338-74b7b21085ab'),
  P('Samsung Galaxy S24 Ultra - 512GB', 'Mobiles', 165999, 189999, 'photo-1610945265064-0e34e5519bbf'),
  P('Google Pixel 9 Pro - 256GB', 'Mobiles', 98999, 119999, 'photo-1598327105666-5b89351aff97'),
  P('Wireless Earbuds Pro - Noise Cancelling', 'Mobiles', 4999, 7999, 'photo-1590658268037-6bf12165a8df'),
  P('Wireless Headphones - Premium Sound', 'Mobiles', 6999, 9999, 'photo-1505740420928-5e560c06d30e'),

  P('Women Premium Fashion Dress - Floral', 'Fashion', 3499, 4999, 'photo-1595777457583-95e059d581b8'),
  P('Men Premium Casual Shirt - Slim Fit', 'Fashion', 2999, 4499, 'photo-1596755094514-f87e34085b2c'),
  P('Summer Fashion Dress - Floral Print', 'Fashion', 3999, 5499, 'photo-1572804013309-59a88b7e92f1'),
  P('Elegant Evening Dress - Red', 'Fashion', 4499, 5999, 'photo-1566174053879-31528523f8ae'),
  P('Casual Fashion Collection - Everyday', 'Fashion', 2799, 3999, 'photo-1521572163474-6864f9cf17ab'),

  P('Luxury Gold Watch - Premium Dial', 'Watches', 6999, 9999, 'photo-1524805444758-089113d48a6d'),
  P('Classic Gold Watch - Leather Strap', 'Watches', 6499, 8999, 'photo-1522312346375-d1a52e2b99b3'),
  P('Silver Classic Watch - Stainless Steel', 'Watches', 5499, 7999, 'photo-1434056886845-dac89ffe9b56'),
  P('Men Steel Chronograph Watch - Silver', 'Watches', 7499, 10999, 'photo-1547996160-81dfa63595aa'),
  P('Modern Minimal Watch - Black Dial', 'Watches', 5999, 8499, 'photo-1622434641406-a158123450f9'),

  P('Luxury Perfume - Pink Bottle 100ml', 'Health & Beauty', 3999, 5999, 'photo-1541643600914-78b084683601'),
  P('Premium Perfume - Oud 100ml', 'Health & Beauty', 4499, 6499, 'photo-1594035910387-fea47794261f'),
  P('Makeup Kit - Beauty Collection 12 Pcs', 'Health & Beauty', 2999, 4499, 'photo-1512496015851-a90fb38ba796'),
  P('Skin Care Set - Glow 3 Pcs', 'Health & Beauty', 2499, 3999, 'photo-1620916566398-39f1143ab7be'),
  P('Makeup Brush Set - Premium 10 Pcs', 'Health & Beauty', 1999, 2999, 'photo-1596462502278-27bfdc403348'),

  P('Red Nike Style Sneakers - Running', 'Shoes', 7999, 11999, 'photo-1542291026-7eec264c27ff'),
  P('Sport Sneakers - Stylish Lightweight', 'Shoes', 6499, 8999, 'photo-1560769629-975ec94e6a86'),
  P('White Sneakers - Everyday Comfort', 'Shoes', 2999, 4499, 'photo-1595950653106-6c9ebd614d3a'),
  P('Running Shoes - Premium Comfort', 'Shoes', 4999, 7499, 'photo-1600185365926-3a2ce3cdb9eb'),
  P('Leather Boots - Brown Ankle', 'Shoes', 5999, 8499, 'photo-1614252369475-531eba835eb1'),

  P('Modern Home Chair - Premium Decor', 'Home & Living', 8999, 12999, 'photo-1592078615290-033ee584e267'),
  P('Kitchen Collection - Cooking Set 5 Pcs', 'Home & Living', 4999, 7499, 'photo-1556911220-bff31c812dba'),
  P('Luxury Bedsheet Set - King Size', 'Home & Living', 3999, 5999, 'photo-1522770179533-24471fcdba45'),
  P('Dining Table Set - 4 Seater Wooden', 'Home & Living', 12999, 18999, 'photo-1538688525198-9b88f6f53126'),
  P('Home Decor Set - Premium Style', 'Home & Living', 3499, 4999, 'photo-1586023492125-27b2c045efd7')
];

const cats = ['Mobiles', 'Fashion', 'Watches', 'Health & Beauty', 'Shoes', 'Home & Living'];

let cart = [];
try {
  cart = JSON.parse(localStorage.getItem('um_cart') || '[]');
} catch (e) {
  cart = [];
}
let disc = 0;
let currentCat = 'All';

// ===== 3. HELPERS =====
const $ = function(id) {
  return document.getElementById(id);
};

function esc(s) {
  s = String(s || '');
  s = s.split('&').join('&amp;');
  s = s.split('<').join('&lt;');
  s = s.split('>').join('&gt;');
  return s;
}

function openModal(html) {
  $('modalBody').innerHTML = html;
  $('modal').classList.remove('hidden');
}

function closeModal() {
  $('modal').classList.add('hidden');
}

function goHome() {
  filterCat('All');
  window.scrollTo(0, 0);
}

// ===== 4. RENDER PRODUCTS =====
function renderCats() {
  let html = '';
  for (let i = 0; i < cats.length; i++) {
    let c = cats[i];
    let p = null;
    for (let j = 0; j < products.length; j++) {
      if (products[j].cat === c) { p = products[j]; break; }
    }
    html += '<div class="cat-card" onclick="filterCat(\'' + c + '\')">';
    html += '<img src="' + p.img + '">';
    html += '<div><b>' + c + '</b><br><small>5 Products</small></div>';
    html += '</div>';
  }
  $('catGrid').innerHTML = html;
}

function renderProducts(list) {
  if (!list.length) {
    $('productGrid').innerHTML = '<p>No products found.</p>';
    return;
  }
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
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove('on');
  }
  if (btn) btn.classList.add('on');
  $('gridTitle').innerText = (c === 'All') ? 'Just For You' : c;
  if (c === 'All') {
    renderProducts(products);
  } else {
    let filtered = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].cat === c) filtered.push(products[i]);
    }
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
      for (let i = 0; i < products.length; i++) {
        if (products[i].cat === currentCat) f.push(products[i]);
      }
      renderProducts(f);
    }
    return;
  }
  let res = [];
  for (let i = 0; i < products.length; i++) {
    let p = products[i];
    if (p.name.toLowerCase().indexOf(q) > -1 || p.cat.toLowerCase().indexOf(q) > -1) {
      res.push(p);
    }
  }
  renderProducts(res);
}

function openDetail(id) {
  let p = null;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) { p = products[i]; break; }
  }
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

// ===== 5. CART =====
function saveCart() {
  try {
    localStorage.setItem('um_cart', JSON.stringify(cart));
  } catch (e) {}
}

function addToCart(id) {
  let found = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) { found = cart[i]; break; }
  }
  if (found) {
    found.qty++;
  } else {
    let p = null;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) { p = products[i]; break; }
    }
    cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
  }
  saveCart();
  updateCart();
  alert('Added to cart.');
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
  else if (sub >= 5000) msg = '🎉 You got FREE Delivery!';
  else msg = 'Add Rs. ' + (5000 - sub).toLocaleString() + ' more for FREE Delivery!';

  let itemsHtml = '';
  if (cart.length === 0) {
    itemsHtml = '<p>Your cart is empty.</p>';
  } else {
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
  html += '<input id="voucher" placeholder="URBAN10">';
  html += '<button onclick="applyVoucher()">Apply Code</button>';
  html += '<button class="gold" style="width:100%;margin-top:8px" onclick="openCheckout()">Proceed to Checkout</button>';
  openModal(html);
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
  updateCart();
  openCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  updateCart();
  openCart();
}

function applyVoucher() {
  let v = $('voucher').value.trim().toUpperCase();
  if (v === 'URBAN10') {
    disc = 500;
    alert('Rs. 500 discount applied!');
  } else {
    disc = 0;
    alert('Invalid code. Try: URBAN10');
  }
  openCart();
}

// ===== 6. AUTH - FIREBASE =====
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
    await db.collection('users').doc(cred.user.uid).set({
      name: name,
      phone: phone,
      email: email,
      createdAt: new Date()
    });
    alert('Account created!');
    closeModal();
  } catch (e) {
    alert(e.message);
  }
}

async function doLogin() {
  let email = $('aEmail').value.trim();
  let pass = $('aPass').value;
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    alert('Welcome back!');
    closeModal();
  } catch (e) {
    alert(e.message);
  }
}

async function forgotPass() {
  let email = prompt('Enter your email:');
  if (!email) return;
  try {
    await auth.sendPasswordResetEmail(email);
    alert('Reset link sent to your email.');
  } catch (e) {
    alert(e.message);
  }
}

function logout() {
  auth.signOut();
  alert('Logged out.');
}

auth.onAuthStateChanged(function(user) {
  let out = $('loggedOut');
  let inn = $('loggedIn');
  if (user) {
    out.classList.add('hidden');
    inn.classList.remove('hidden');
  } else {
    inn.classList.add('hidden');
    out.classList.remove('hidden');
  }
});

// ===== 7. CHECKOUT + ORDERS - FIRESTORE =====
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
  if (pay === 'COD') {
    box.classList.add('hidden');
    return;
  }
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
  let oid = 'UM-' + Math.floor(1000 + Math.random() * 9000);

  let items = '';
  for (let i = 0; i < cart.length; i++) {
    if (i > 0) items += ', ';
    items += cart[i].name + ' x ' + cart[i].qty;
  }

  try {
    await db.collection('orders').doc(oid).set({
      id: oid,
      userId: user.uid,
      email: user.email,
      name: name,
      phone: phone,
      address: addr,
      items: items,
      total: total,
      pay: pay,
      txn: txn,
      status: 'On The Way',
      createdAt: new Date()
    });

    let wa = 'New Order ' + oid + '\nName: ' + name + '\nPhone: ' + phone + '\nAddress: ' + addr + '\nPayment: ' + pay + '\nItems: ' + items + '\nTotal: Rs. ' + total;

    cart = [];
    disc = 0;
    saveCart();
    updateCart();
    alert('Order placed! Your Order ID is ' + oid);
    window.open('https://wa.me/923341765911?text=' + encodeURIComponent(wa), '_blank');
    closeModal();
  } catch (e) {
    alert(e.message);
  }
}

// ===== 8. TRACK + DASHBOARD =====
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
    if (!doc.exists) {
      $('trackResult').innerHTML = '<p style="color:#c00">Order not found. Please check your Order ID.</p>';
      return;
    }
    let o = doc.data();
    let html = '';
    html += '<div style="background:#e8f5e9;padding:12px;border-radius:10px;margin-top:10px">';
    html += '<b>' + o.id + '</b> - Rs. ' + o.total + '<br>';
    html += 'Status: <b>' + o.status + '</b><br>';
    html += 'Items: ' + esc(o.items) + '<br>';
    html += 'Payment: ' + o.pay;
    html += '</div>';
    $('trackResult').innerHTML = html;
  } catch (e) {
    alert(e.message);
  }
}

async function openDashboard() {
  let user = auth.currentUser;
  if (!user) return openAuth('login');
  let snap = await db.collection('orders').where('userId', '==', user.uid).orderBy('createdAt', 'desc').get();
  let orders = snap.docs.map(function(d) { return d.data(); });

  let ordersHtml = '';
  if (orders.length === 0) {
    ordersHtml = '<p>No orders yet.</p>';
  } else {
    for (let i = 0; i < orders.length; i++) {
      let o = orders[i];
      ordersHtml += '<div style="border:1px solid #eee;padding:10px;border-radius:10px;margin-top:8px">';
      ordersHtml += '<b>' + o.id + '</b> - Rs. ' + o.total + ' - ' + o.status + ' - ' + o.pay;
      ordersHtml += '<br><small>' + esc(o.items) + '</small></div>';
    }
  }

  let html = '';
  html += '<h2>My Account</h2>';
  html += '<p>' + esc(user.displayName || '') + ' • ' + esc(user.email) + '</p>';
  html += '<h3 style="margin-top:12px">My Orders (' + orders.length + ')</h3>';
  html += ordersHtml;
  html += '<button style="width:100%;margin-top:12px" onclick="closeModal();goHome()">Continue Shopping</button>';
  openModal(html);
}

// ===== 9. INFO + NEWSLETTER =====
function openInfo(t) {
  let data = {
    sell: ['Sell on Urban Mart', '1. Send shop + products on WhatsApp\n2. Verification in 24 hours\n3. Commission 5%\nWhatsApp: 0334-1765911'],
    shipping: ['Shipping Information', 'Vehari: Same-Day Delivery\nLahore/Multan: 1-2 Days\nKarachi/Islamabad: 2-4 Days\nAbove Rs. 5000: FREE, Below: Rs. 200\nPayment: COD, JazzCash, EasyPaisa'],
    returns: ['Returns & Refunds', '7-Day Easy Return. Damaged/wrong product? Contact us within 7 days on WhatsApp. Rider will collect it. Refund in 2-3 days.'],
    privacy: ['Privacy Policy', 'Name/phone/address only for delivery. Password is handled by Firebase. Data is never sold or shared.'],
    terms: ['Terms & Conditions', '1. 100% original products\n2. No hidden charges\n3. Cancel within 2 hours\n4. 7-Day Return Policy'],
    contact: ['Contact Us', 'Urban Mart - Vehari\nMain Bazaar Road, Vehari\nPhone/WhatsApp: 0334-1765911\nEmail: support@urbanmart.pk\nTime: 9 AM - 10 PM (7 Days)']
  };
  let x = data[t] || ['Info', 'WhatsApp: 0334-1765911'];
  let html = '';
  html += '<h2>' + x[0] + '</h2>';
  html += '<p style="white-space:pre-line;line-height:1.8;margin-top:10px">' + x[1] + '</p>';
  html += '<button class="gold" style="width:100%;margin-top:12px" onclick="closeModal()">Got It</button>';
  openModal(html);
}

function subscribe() {
  let em = $('newsEmail').value.trim();
  if (em.indexOf('@') < 1) return alert('Enter valid email.');
  let html = '';
  html += '<h2>Welcome to Urban Club!</h2>';
  html += '<p>Thank you for subscribing.<br>Your code is <b>URBAN10</b> - Rs. 500 OFF.</p>';
  openModal(html);
}

// ===== 10. START =====
renderCats();
renderProducts(products);
updateCart();
