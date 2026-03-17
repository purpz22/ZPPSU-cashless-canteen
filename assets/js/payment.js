// Function to compress receipt before saving
async function compressReceipt(file, maxWidth = 800) {
    return new Promise((resolve) => {
        const reader = new FileReader(); reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image(); img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width; let height = img.height;
                if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.80));
            }
        }
    });
}

async function processPayment() {
  const fileInput = document.getElementById('payment-screenshot');
  const file = fileInput.files[0];
  
  if (!file) {
    return alert("Please select a screenshot of your payment receipt.");
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) return;

  const total = cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  const vendorId = cart[0].vendorId;
  const vendorName = localStorage.getItem('currentVendorName');
  const studentNumber = localStorage.getItem('studentNumber');

  const btn = document.getElementById('submit-btn');
  btn.innerText = "Processing Order...";
  btn.disabled = true;

  try {
    // Compress image to Base64 string
    const compressedImage = await compressReceipt(file);

    // Save order to Firestore
    const docRef = await db.collection("orders").add({
      vendorId: vendorId,
      vendorName: vendorName,
      studentNumber: studentNumber,
      items: cart,
      total: total,
      status: "pending", 
      receiptUrl: compressedImage, // Saved as string
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    localStorage.removeItem('cart');
    window.location.href = `status.html?id=${docRef.id}`;
    
  } catch (error) {
    console.error("Error processing order: ", error);
    alert("Something went wrong with the upload. Please try again.");
    btn.innerText = "Submit Payment";
    btn.disabled = false;
  }
}