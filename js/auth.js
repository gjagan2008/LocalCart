/* ==========================================================================
   LocalCart — Authentication Module
   Demo Auth, Role Switcher, Session Persistence
   ========================================================================== */

function getCurrentUser() {
  const user = localStorage.getItem("localcart_current_user");
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("localcart_current_user", JSON.stringify(user));
  showToast(`Logged in as ${user.name} (${user.role})`, "success");
}

function handleLogin(email, password, role) {
  const users = JSON.parse(localStorage.getItem("localcart_users") || "[]");
  const found = users.find(u => u.email === email);

  const user = found || {
    id: role === "Seller" ? "seller-1" : role === "Admin" ? "admin-1" : "cust-1",
    name: email.split("@")[0].toUpperCase(),
    email: email,
    role: role || "Customer"
  };

  setCurrentUser(user);

  setTimeout(() => {
    if (user.role === "Seller") {
      window.location.href = "../seller/dashboard.html";
    } else if (user.role === "Admin") {
      window.location.href = "../admin/dashboard.html";
    } else {
      window.location.href = "../index.html";
    }
  }, 600);
}

function handleRegister(name, email, role, phone) {
  const users = JSON.parse(localStorage.getItem("localcart_users") || "[]");
  const newUser = {
    id: "user-" + Date.now(),
    name,
    email,
    role,
    status: role === "Seller" ? "PENDING" : "ACTIVE",
    joined: new Date().toISOString().split("T")[0]
  };

  users.push(newUser);
  localStorage.setItem("localcart_users", JSON.stringify(users));
  setCurrentUser(newUser);

  if (role === "Seller") {
    showToast("Registration submitted! Pending Admin Approval.", "info");
    setTimeout(() => window.location.href = "../seller/dashboard.html", 1000);
  } else {
    showToast("Welcome to LocalCart!", "success");
    setTimeout(() => window.location.href = "../index.html", 800);
  }
}

function handleLogout() {
  localStorage.removeItem("localcart_current_user");
  showToast("Logged out successfully", "info");
  setTimeout(() => {
    const isSubfolder = window.location.pathname.includes("/seller/") || window.location.pathname.includes("/admin/") || window.location.pathname.includes("/pages/");
    window.location.href = isSubfolder ? "../pages/login.html" : "pages/login.html";
  }, 500);
}
