let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentVendorId = null;

document.addEventListener("DOMContentLoaded", updateCartCount);

function addToCart(item) {
  currentVendorId = localStorage.getItem('currentVendorId');
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else cart.push({ ...item, qty: 1, vendorId: currentVendorId });

  saveCart();
  updateCartCount();
  alert(`${item.name} added to cart!`);
}

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  const countEl = document.getElementById('cart-count');
  if(countEl) countEl.textContent = count || 0;
}

function showCart() {
  if (cart.length === 0) return alert("Your cart is empty!");
  
  const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const vendorId = cart[0].vendorId;
    const vendorName = localStorage.getItem('currentVendorName');
  const vendorQR = localStorage.getItem('currentVendorQR') || 'https://via.placeholder.com/250?text=No+QR+Uploaded';
  let itemsHtml = cart.map(item => `
    <div class="flex justify-between border-b py-2">
      <span>${item.qty}x ${item.name}</span>
      <span class="font-bold">₱${item.price * item.qty}</span>
    </div>
  `).join('');

  const modalHtml = `
    <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4 border-b pb-2">Checkout: ${vendorName}</h2>
        <div class="mb-4">${itemsHtml}</div>
        <h3 class="text-xl font-bold text-right mb-6 text-red-700">Total: ₱${total.toFixed(2)}</h3>
        
        <div class="bg-gray-100 p-4 rounded-2xl text-center mb-6">
          <p class="font-bold text-gray-700 mb-2">1. Scan to Pay via GCash</p>
          <img src="${vendorQR}" class="w-48 h-48 mx-auto rounded-xl border-4 border-blue-500 shadow-md">
          <p class="text-sm text-gray-500 mt-2">Exact Amount: ₱${total.toFixed(2)}</p>
        </div>

        <div class="mb-6">
          <p class="font-bold text-gray-700 mb-2">2. Upload Screenshot of Receipt</p>
          <!-- CHANGED TO FILE INPUT -->
          <input type="file" id="payment-screenshot" accept="image/*" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-sm">
        </div>

        <div class="flex gap-3">
          <button onclick="closeCart()" class="w-1/3 bg-gray-200 py-4 rounded-xl font-bold text-gray-700">Cancel</button>
          <button onclick="processPayment()" id="submit-btn" class="w-2/3 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-white shadow-lg">Submit Payment</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.remove();
}