/* ==========================================================================
   LocalCart — Customer Portal Interactions
   Home Page Widgets, Explore Filters, Shop & Product Details, Wishlist
   ========================================================================== */

function getWishlist() {
  return JSON.parse(localStorage.getItem("localcart_wishlist") || "[]");
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from wishlist", "info");
  } else {
    wishlist.push(productId);
    showToast("Added to wishlist", "success");
  }

  localStorage.setItem("localcart_wishlist", JSON.stringify(wishlist));
  
  // Refresh wishlist buttons visually
  const btns = document.querySelectorAll(`[data-wishlist-id="${productId}"]`);
  btns.forEach(btn => {
    btn.classList.toggle("active", wishlist.includes(productId));
  });

  if (typeof renderWishlistPage === "function") renderWishlistPage();
}

// Render Categories Grid on Homepage
function renderHomeCategories() {
  const container = document.getElementById("home-categories-grid");
  if (!container) return;

  const categories = JSON.parse(localStorage.getItem("localcart_categories") || "[]");

  container.innerHTML = categories.map(cat => `
    <a href="pages/shops.html?category=${encodeURIComponent(cat.name)}" class="category-card">
      <div class="category-card-icon">
        <i data-lucide="${cat.icon || 'shopping-bag'}"></i>
      </div>
      <div class="category-card-name">${cat.name}</div>
    </a>
  `).join("");

  renderIcons();
}

// Render Shop Card Component HTML
function createShopCardHTML(shop, isSubfolder = false) {
  const shopUrl = isSubfolder ? `shop-details.html?id=${shop.id}` : `pages/shop-details.html?id=${shop.id}`;
  return `
    <div class="shop-card">
      <div style="position:relative;">
        <img src="${shop.banner}" alt="${shop.name}" class="shop-card-img">
        <span class="badge ${shop.isOpen ? 'badge-open' : 'badge-closed'} shop-badge-status">
          ${shop.isOpen ? 'OPEN NOW' : 'CLOSED'}
        </span>
      </div>
      <div class="shop-card-body">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <span class="product-shop-name">${shop.category}</span>
          <span class="rating-pill"><i data-lucide="star"></i> ${shop.rating} (${shop.reviewsCount})</span>
        </div>
        <h3 class="shop-card-title">${shop.name}</h3>
        <div class="shop-card-meta">
          <span><i data-lucide="map-pin"></i> ${shop.distance}</span>
          <span>•</span>
          <span><i data-lucide="clock"></i> ${shop.deliveryTime}</span>
        </div>
        <div style="margin-top:auto; padding-top:1rem;">
          <a href="${shopUrl}" class="btn btn-outline btn-sm" style="width:100%;">View Shop</a>
        </div>
      </div>
    </div>
  `;
}

// Render Product Card Component HTML
function createProductCardHTML(product, isSubfolder = false) {
  const wishlist = getWishlist();
  const isWishlisted = wishlist.includes(product.id);
  const detailUrl = isSubfolder ? `product-details.html?id=${product.id}` : `pages/product-details.html?id=${product.id}`;

  return `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}">
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist-id="${product.id}" onclick="toggleWishlist('${product.id}')">
          <i data-lucide="heart"></i>
        </button>
      </div>
      <div class="product-card-body">
        <div class="product-shop-name">${product.shopName}</div>
        <a href="${detailUrl}">
          <h4 class="product-title">${product.name}</h4>
        </a>
        <div style="font-size:0.8rem; color:var(--muted); margin-bottom:0.5rem;">Unit: ${product.unit}</div>
        <div class="product-price-row">
          <div>
            <span class="product-price">${formatINR(product.price)}</span>
            ${product.oldPrice ? `<span style="font-size:0.85rem; color:var(--muted); text-decoration:line-through; margin-left:0.4rem;">${formatINR(product.oldPrice)}</span>` : ''}
          </div>
          <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">
            <i data-lucide="plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render Home Nearby Shops
function renderHomeShops() {
  const container = document.getElementById("home-shops-grid");
  if (!container) return;

  const shops = JSON.parse(localStorage.getItem("localcart_shops") || "[]");
  container.innerHTML = shops.slice(0, 3).map(s => createShopCardHTML(s, false)).join("");
  renderIcons();
}

// Render Home Popular Products
function renderHomeProducts() {
  const container = document.getElementById("home-products-grid");
  if (!container) return;

  const products = JSON.parse(localStorage.getItem("localcart_products") || "[]");
  container.innerHTML = products.slice(0, 4).map(p => createProductCardHTML(p, false)).join("");
  renderIcons();
}
