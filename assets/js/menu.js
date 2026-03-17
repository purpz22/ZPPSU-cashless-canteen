async function loadMenuForVendor(vendorId) {
  const container = document.getElementById('content');
  const stallName = localStorage.getItem('currentVendorName');

  container.innerHTML = `
    <div class="flex items-center gap-3 mb-6 px-4 mt-4">
      <button onclick="goBackToVendors()" class="text-3xl font-bold text-red-700">←</button>
      <h2 class="text-2xl font-bold">${stallName} Menu</h2>
    </div>
    <div class="grid grid-cols-2 gap-4 px-4" id="menu-grid">
      <p class="text-center col-span-2 text-gray-500">Loading menu...</p>
    </div>
  `;

  const grid = document.getElementById('menu-grid');
  
  // Fetch menu items for this specific vendor from Firebase
  const snapshot = await db.collection('menu').where('vendorId', '==', vendorId).get();

  if (snapshot.empty) {
    grid.innerHTML = `<p class="text-center col-span-2 text-gray-500">No items available yet.</p>`;
    return;
  }

  grid.innerHTML = "";
  snapshot.forEach(doc => {
    const item = { id: doc.id, ...doc.data() };
    const card = `
      <div class="menu-card bg-white overflow-hidden shadow-sm rounded-2xl">
        <img src="${item.imageUrl || 'https://via.placeholder.com/150'}" class="w-full h-32 object-cover">
        <div class="p-3">
          <h3 class="font-bold text-gray-800 leading-tight">${item.name}</h3>
          <p class="text-red-700 font-bold mt-1">₱${item.price}</p>
          <button onclick='addToCart(${JSON.stringify(item)})' 
                  class="w-full mt-3 bg-red-700 hover:bg-red-800 py-2 text-white rounded-xl text-sm font-bold">
            Add
          </button>
        </div>
      </div>
    `;
    grid.innerHTML += card;
  });
}

window.goBackToVendors = function() {
  loadVendors();
};