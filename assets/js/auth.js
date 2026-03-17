// assets/js/auth.js
function studentLogin(studentNumber) {
  if (studentNumber.length >= 5) {
    localStorage.setItem('studentNumber', studentNumber);
    localStorage.setItem('role', 'student');
    window.location.href = 'index.html';
  } else alert("Enter valid ZPPSU Student Number");
}

function staffLogin(code) {
  const validVendors = ["manginasal", "jollibee", "chowking", "siomai"];
  if (validVendors.includes(code)) {
    localStorage.setItem('role', 'staff');
    localStorage.setItem('vendorId', code);
    window.location.href = 'staff.html';
  } else {
    alert("Wrong staff code! Use: manginasal / jollibee / chowking / siomai");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}