let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentVendorId = null;

document.addEventListener("DOMContentLoaded", updateCartCount);

// --- NEW: Custom Toast Notification System ---
function showToast(message, type = 'success') {
  // Remove existing toast if there is one to prevent stacking
  const existingToast = document.getElementById('custom-toast');
  if (existingToast) existingToast.remove();

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const icon = type === 'success' ? '✅' : '⚠️';

  const toast = document.createElement('div');
  toast.id = 'custom-toast';
  // Tailwind classes for a modern, floating, animated pill
  toast.className = `fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[10000] text-white font-bold flex items-center gap-2 transition-all duration-300 opacity-0 -translate-y-5 ${bgColor}`;
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  document.body.appendChild(toast);
  
  // Trigger animation in
  setTimeout(() => {
    toast.classList.remove('opacity-0', '-translate-y-5');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 10);

  // Trigger animation out and remove after 2.5 seconds
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-5');
    setTimeout(() => toast.remove(), 300); // Wait for fade out to finish
  }, 2500);
}
// ---------------------------------------------

function addToCart(item) {
  currentVendorId = localStorage.getItem('currentVendorId');
  const existing = cart.find(i => i.id === item.id);
  
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1, vendorId: currentVendorId });
  }

  saveCart();
  updateCartCount();
  
  // Replaced alert() with Toast
  showToast(`${item.name} added to cart!`, 'success');
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  updateCartCount();
  
  // Refresh the cart modal
  closeCart();
  if (cart.length > 0) {
    showCart();
  } else {
    // Replaced alert() with Toast
    showToast("Your cart is now empty.", 'error');
  }
}

function saveCart() { 
  localStorage.setItem('cart', JSON.stringify(cart)); 
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  const countEl = document.getElementById('cart-count');
  if(countEl) countEl.textContent = count || 0;
}

function showCart() {
  if (cart.length === 0) {
    // Replaced alert() with Toast
    showToast("Your cart is empty!", 'error');
    return;
  }
  
  const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const vendorId = cart[0].vendorId;
  const vendorName = localStorage.getItem('currentVendorName');
  const vendorQR = localStorage.getItem('currentVendorQR') || 'https://via.placeholder.com/250?text=No+QR+Uploaded';
  
  let itemsHtml = cart.map(item => `
    <div class="flex justify-between items-center border-b py-3">
      <div>
        <span class="font-bold text-gray-800">${item.qty}x ${item.name}</span>
        <div onclick="removeFromCart('${item.id}')" class="text-sm text-red-500 font-bold mt-1 cursor-pointer hover:underline">
          Remove
        </div>
      </div>
      <span class="font-bold text-lg text-gray-900">₱${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');

  const modalHtml = `
    <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity">
      <div class="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 class="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">Checkout: ${vendorName}</h2>
        
        <div class="mb-4">${itemsHtml}</div>
        
        <h3 class="text-2xl font-black text-right mb-6 text-red-700">Total: ₱${total.toFixed(2)}</h3>
        
        <div class="bg-gray-100 p-4 rounded-2xl text-center mb-6">
          <p class="font-bold text-gray-700 mb-2">1. Scan to Pay via GCash</p>
          <img src="${vendorQR}" class="w-48 h-48 mx-auto rounded-xl border-4 border-blue-500 shadow-md object-cover">
          <p class="text-sm text-gray-500 mt-2">Exact Amount: ₱${total.toFixed(2)}</p>
        </div>

        <div class="mb-6">
          <p class="font-bold text-gray-700 mb-2">2. Upload Screenshot of Receipt</p>
          <input type="file" id="payment-screenshot" accept="image/*" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-blue-500">
        </div>

        <div class="flex gap-3">
          <button onclick="closeCart()" class="w-1/3 bg-gray-200 hover:bg-gray-300 py-4 rounded-xl font-bold text-gray-700 transition-colors">Cancel</button>
          <button onclick="processPayment()" id="submit-btn" class="w-2/3 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-white shadow-lg transition-colors">Submit Payment</button>
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