/* ==========================================================================
   LocalCart — Cart & Order Summary Engine
   Add to Cart, Quantity Controls, Coupon Applied, Calculations
   ========================================================================== */

function getCart() {
  return JSON.parse(localStorage.getItem("localcart_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("localcart_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const products = JSON.parse(localStorage.getItem("localcart_products") || "[]");
  const product = products.find(p => p.id === productId);

  if (!product) {
    showToast("Product not found", "danger");
    return;
  }

  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      shopId: product.shopId,
      shopName: product.shopName,
      unit: product.unit,
      qty: qty
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to your cart!`, "success");
}

function updateCartQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
      showToast("Item removed from cart", "info");
    }
    saveCart(cart);
    if (typeof renderCartPage === "function") renderCartPage();
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  showToast("Item removed from cart", "info");
  if (typeof renderCartPage === "function") renderCartPage();
}

function calculateCartTotals(appliedCoupon = null) {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  let deliveryFee = subtotal > 0 ? (subtotal > 499 ? 0 : 30) : 0;
  let discount = 0;

  if (appliedCoupon === "LOCAL10") {
    discount = Math.round(subtotal * 0.10);
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  return { subtotal, deliveryFee, discount, total };
}

function renderCartPage() {
  const cartListContainer = document.getElementById("cart-items-list");
  const orderSummaryContainer = document.getElementById("cart-summary-box");

  if (!cartListContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i data-lucide="shopping-cart"></i></div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any products from local shops yet.</p>
        <a href="shops.html" class="btn btn-primary">Explore Shops</a>
      </div>
    `;
    if (orderSummaryContainer) orderSummaryContainer.style.display = "none";
    renderIcons();
    return;
  }

  if (orderSummaryContainer) orderSummaryContainer.style.display = "block";

  cartListContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="product-shop-name">${item.shopName}</div>
        <h4 style="font-size:1rem; font-weight:700; color:var(--navy); margin-bottom:0.25rem;">${item.name}</h4>
        <div style="font-weight:800; color:var(--navy); font-size:1.05rem;">${formatINR(item.price)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
      </div>
      <button class="btn-icon" style="color:var(--danger);" onclick="removeFromCart('${item.id}')">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  `).join("");

  updateOrderSummaryBox();
  renderIcons();
}

function updateOrderSummaryBox() {
  const couponInput = document.getElementById("coupon-code-input");
  const couponCode = couponInput ? couponInput.value.trim().toUpperCase() : null;
  const { subtotal, deliveryFee, discount, total } = calculateCartTotals(couponCode);

  const subtotalEl = document.getElementById("cart-subtotal");
  const deliveryEl = document.getElementById("cart-delivery");
  const discountEl = document.getElementById("cart-discount");
  const totalEl = document.getElementById("cart-total");

  if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? "FREE" : formatINR(deliveryFee);
  if (discountEl) discountEl.textContent = `- ${formatINR(discount)}`;
  if (totalEl) totalEl.textContent = formatINR(total);
}
