async function loadVendors() {
  const container = document.getElementById('content');
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-6 text-center mt-4">Choose a Food Stall</h2>
    <div class="grid grid-cols-2 gap-4 px-4" id="vendor-grid">
      <p class="text-center col-span-2 text-gray-500">Loading stalls...</p>
    </div>
  `;

  const grid = document.getElementById('vendor-grid');
  
  // Fetch vendors from Firebase
  const snapshot = await db.collection('vendors').get();
  
  if (snapshot.empty) {
    grid.innerHTML = `<p class="text-center col-span-2 text-red-500">No stalls available. Admin needs to add them.</p>`;
    return;
  }

  grid.innerHTML = ""; // Clear loading text
  snapshot.forEach(doc => {
    const v = doc.data();
    // Pass the QR code to the function so the Cart can use it later
    const card = `
      <div onclick="selectVendor('${doc.id}', '${v.name}', '${v.qrUrl}')" 
           class="menu-card bg-white border-2 border-transparent hover:border-red-700 p-4 rounded-3xl text-center cursor-pointer shadow-sm">
        <img src="${v.logoUrl || 'https://via.placeholder.com/150'}" class="w-full h-24 object-cover rounded-2xl mx-auto mb-2">
        <h3 class="font-bold text-lg text-gray-800">${v.name}</h3>
      </div>
    `;
    grid.innerHTML += card;
  });
}

window.selectVendor = function(vendorId, vendorName, qrUrl) {
  localStorage.setItem('currentVendorId', vendorId);
  localStorage.setItem('currentVendorName', vendorName);
  localStorage.setItem('currentVendorQR', qrUrl); // Save QR for the cart
  
  const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
  if(existingCart.length > 0 && existingCart[0].vendorId !== vendorId) {
      if(confirm("Switching stalls will clear your current cart. Continue?")) {
          cart = [];
          saveCart();
          updateCartCount();
      } else {
          return;
      }
  }
  loadMenuForVendor(vendorId);
};