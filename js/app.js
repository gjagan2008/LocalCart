/* ==========================================================================
   LocalCart — Main Application JS
   Toast Notifications, Modal Controller, UI Utilities, Icon Loader
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderIcons();
  updateCartBadge();
  setupMobileDrawer();
});

// Lucide Icon Auto Loader
function renderIcons() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}

// Currency Formatter
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Toast Notifications
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'danger' ? 'alert-triangle' : 'info'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  renderIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

// Cart Badge Counter
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("localcart_cart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const badges = document.querySelectorAll(".cart-badge, .mobile-nav-badge");
  badges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  });
}

// Mobile Sidebar Drawer Setup
function setupMobileDrawer() {
  const toggleBtn = document.querySelector(".toggle-sidebar-btn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      if (sidebar) sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
}
