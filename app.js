// --- FIREBASE CONFIG - APNA WALA YAHAN PASTE KARO ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "urban-mart-e5c0a.firebaseapp.com",
  projectId: "urban-mart-e5c0a",
  storageBucket: "urban-mart-e5c0a.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let products = [
  {id:1, name:"Luxury Bedsheet Set - King Size", cat:"Home & Living", price:3699, old:5999, img:"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80"},
  {id:2, name:"Men's Premium Watch", cat:"Watches", price:2499, old:3999, img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"},
  {id:3, name:"Women's Fashion Handbag", cat:"Fashion", price:1899, old:2999, img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80"},
  {id:4, name:"Running Shoes - Comfort", cat:"Shoes", price:3299, old:4999, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"},
  {id:5, name:"Wireless Earbuds", cat:"Mobiles", price:1599, old:2599, img:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"},
  {id:6, name:"Face Serum - Glow Skin", cat:"Health & Beauty", price:1299, old:1999, img:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80"},
];
let cart = [];
let currentCat = 'All';

function renderProducts(list){
  let box = document.getElementById('products');
  box.innerHTML = list.map(p=>`
    <div class="card">
      <img src="${p.img}">
      <div class="card-body">
        <h4>${p.name}</h4>
        <div class="price">Rs. ${p.price} <s>${p.old}</s></div>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>`).join('');
}
function filterCat(c){ currentCat=c; renderProducts(c==='All'?products:products.filter(p=>p.cat===c)); }
function searchProducts(q){ renderProducts(products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()))); }
function addToCart(id){ let p=products.find(x=>x.id===id); cart.push(p); updateCart(); alert(p.name+" added!"); }
function updateCart(){ document.getElementById('cartCount').innerText=cart.length; }
function openCart(){ let box=document.getElementById('cartItems'); let total=cart.reduce((a,b)=>a+b.price,0);
  box.innerHTML = cart.length? cart.map((p,i)=>`<div class="cart-row"><img src="${p.img}"><div><b>${p.name}</b><br>Rs. ${p.price}</div><button onclick="cart.splice(${i},1);updateCart();openCart()">✕</button></div>`).join('') : "<p>Cart empty</p>";
  document.getElementById('cartTotal').innerText="Total: Rs. "+total;
  showModal('cartModal');
}
function openCheckout(){ if(!cart.length) return alert("Cart empty!"); closeModal('cartModal');
  document.getElementById('payAmount').innerText=cart.reduce((a,b)=>a+b.price,0); showModal('checkoutModal'); }
function toggleTID(){ let v=document.querySelector('input[name="pay"]:checked').value; document.getElementById('easyBox').style.display = v==='EasyPaisa'?'block':'none'; }
async function placeOrder(){
  let name=document.getElementById('custName').value, phone=document.getElementById('custPhone').value, addr=document.getElementById('custAddress').value;
  let pay=document.querySelector('input[name="pay"]:checked').value;
  let tid=document.getElementById('tidInput').value;
  if(!name||!phone||!addr) return alert("Please fill all fields");
  if(pay==='EasyPaisa' && !tid) return alert("Please enter Transaction ID");
  let total=cart.reduce((a,b)=>a+b.price,0);
  let oid="RA-"+Math.floor(1000+Math.random()*9000);
  try{ await db.collection("orders").doc(oid).set({orderId:oid,name,phone,address:addr,payment:pay,tid:tid||"",items:cart.map(p=>p.name+" x 1"),total,status:"On The Way",date:new Date().toISOString()}); }catch(e){ console.log(e); }
  cart=[]; updateCart(); closeModal('checkoutModal');
  alert("Order placed! Your Order ID is "+oid);
  document.getElementById('trackId').value=oid; openTrack();
}
function openAuth(){ showModal('authModal'); }
async function signup(){ try{ await auth.createUserWithEmailAndPassword(document.getElementById('authEmail').value, document.getElementById('authPass').value); alert("Account created!"); closeModal('authModal'); }catch(e){ alert(e.message); } }
async function login(){ try{ await auth.signInWithEmailAndPassword(document.getElementById('authEmail').value, document.getElementById('authPass').value); alert("Login successful!"); closeModal('authModal'); }catch(e){ alert(e.message); } }
async function logout(){ await auth.signOut(); alert("Logged out"); }
function openTrack(){ showModal('trackModal'); }
async function trackOrder(){ let id=document.getElementById('trackId').value.trim(); let box=document.getElementById('trackResult');
  if(!id) return box.innerHTML="Enter Order ID";
  try{ let doc=await db.collection("orders").doc(id).get(); if(!doc.exists) return box.innerHTML="<p>Order not found</p>";
    let o=doc.data(); box.innerHTML=`<hr><b>${o.orderId} - Rs. ${o.total}</b><br>Status: <b>${o.status}</b><br>Items: ${o.items.join(", ")}<br>Payment: ${o.payment}`; }catch(e){ box.innerHTML="Error: "+e.message; } }
function openDashboard(){ 
  let user=auth.currentUser; if(!user) return openAuth();
  document.getElementById('dashEmail').innerText="Email: "+user.email;
  db.collection("orders").where("phone","!=", "").get().then(snap=>{
    document.getElementById('myOrders').innerHTML = snap.empty? "No orders yet" : snap.docs.map(d=>{let o=d.data(); return `<p><b>${o.orderId}</b> - Rs.${o.total} - ${o.status}</p>`}).join('');
  });
  showModal('dashModal');
}
function showModal(id){ document.getElementById(id).style.display='flex'; }
function closeModal(id){ document.getElementById(id).style.display='none'; }
auth.onAuthStateChanged(user=>{
  document.getElementById('loggedOut').style.display = user? 'none':'block';
  document.getElementById('loggedIn').style.display = user? 'block':'none';
});
renderProducts(products);
