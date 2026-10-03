/* ==========================================================================
   LocalCart — Seller Portal Management Engine
   Dashboard Metrics, Product CRUD, Order Status Updating, Inventory Alerts
   ========================================================================== */

function renderSellerDashboard() {
  const products = JSON.parse(localStorage.getItem("localcart_products") || "[]");
  const orders = JSON.parse(localStorage.getItem("localcart_orders") || "[]");

  const todayRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProds = products.length;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const revenueEl = document.getElementById("seller-stat-revenue");
  const ordersEl = document.getElementById("seller-stat-orders");
  const productsEl = document.getElementById("seller-stat-products");
  const lowStockEl = document.getElementById("seller-stat-lowstock");

  if (revenueEl) revenueEl.textContent = formatINR(todayRevenue);
  if (ordersEl) ordersEl.textContent = orders.length;
  if (productsEl) productsEl.textContent = totalProds;
  if (lowStockEl) lowStockEl.textContent = lowStockCount;

  renderSellerRecentOrdersTable();
  renderSellerCharts();
}

function renderSellerRecentOrdersTable() {
  const container = document.getElementById("seller-recent-orders-body");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("localcart_orders") || "[]");

  container.innerHTML = orders.map(ord => `
    <tr>
      <td><strong>#${ord.id}</strong></td>
      <td>${ord.customerName}</td>
      <td>${ord.items.length} items</td>
      <td><strong>${formatINR(ord.total)}</strong></td>
      <td>${ord.date}</td>
      <td>
        <select class="form-control" style="padding:0.25rem 0.5rem; font-size:0.82rem; font-weight:700; width:auto;" onchange="changeOrderStatus('${ord.id}', this.value)">
          <option value="PLACED" ${ord.status === 'PLACED' ? 'selected' : ''}>PLACED</option>
          <option value="ACCEPTED" ${ord.status === 'ACCEPTED' ? 'selected' : ''}>ACCEPTED</option>
          <option value="PREPARING" ${ord.status === 'PREPARING' ? 'selected' : ''}>PREPARING</option>
          <option value="READY" ${ord.status === 'READY' ? 'selected' : ''}>READY</option>
          <option value="OUT FOR DELIVERY" ${ord.status === 'OUT FOR DELIVERY' ? 'selected' : ''}>OUT FOR DELIVERY</option>
          <option value="DELIVERED" ${ord.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
        </select>
      </td>
    </tr>
  `).join("");
}

function changeOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem("localcart_orders") || "[]");
  const order = orders.find(o => o.id === orderId);

  if (order) {
    order.status = newStatus;
    localStorage.setItem("localcart_orders", JSON.stringify(orders));
    showToast(`Order #${orderId} set to ${newStatus}`, "success");
  }
}

function renderSellerProductsTable() {
  const container = document.getElementById("seller-products-body");
  if (!container) return;

  const products = JSON.parse(localStorage.getItem("localcart_products") || "[]");

  container.innerHTML = products.map(p => `
    <tr>
      <td style="display:flex; align-items:center; gap:0.75rem;">
        <img src="${p.image}" alt="${p.name}" style="width:40px; height:40px; border-radius:6px; object-fit:contain; background:#f8fafc;">
        <div>
          <div style="font-weight:700; color:var(--navy);">${p.name}</div>
          <span style="font-size:0.78rem; color:var(--muted);">${p.unit}</span>
        </div>
      </td>
      <td><span class="badge badge-navy">${p.category}</span></td>
      <td><strong>${formatINR(p.price)}</strong></td>
      <td>
        <span class="${p.stock < 10 ? 'text-accent font-bold' : ''}">${p.stock} units</span>
      </td>
      <td><span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}">${p.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}</span></td>
      <td>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-outline btn-sm" onclick="editProductModal('${p.id}')"><i data-lucide="edit-2"></i></button>
          <button class="btn btn-outline btn-sm" style="color:var(--danger);" onclick="deleteProduct('${p.id}')"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join("");

  renderIcons();
}

function addNewProduct(name, category, price, stock, unit, image, description) {
  const products = JSON.parse(localStorage.getItem("localcart_products") || "[]");
  const newProd = {
    id: "p-" + Date.now(),
    name,
    category,
    shopId: "shop-1",
    shopName: "Sri Murugan Stores",
    price: parseFloat(price),
    oldPrice: Math.round(parseFloat(price) * 1.15),
    rating: 4.8,
    stock: parseInt(stock),
    unit: unit || "1 Pack",
    image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    description: description || "Fresh high-quality product from local store."
  };

  products.unshift(newProd);
  localStorage.setItem("localcart_products", JSON.stringify(products));
  showToast(`Product "${name}" added successfully!`, "success");
  if (typeof renderSellerProductsTable === "function") renderSellerProductsTable();
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    let products = JSON.parse(localStorage.getItem("localcart_products") || "[]");
    products = products.filter(p => p.id !== productId);
    localStorage.setItem("localcart_products", JSON.stringify(products));
    showToast("Product deleted", "info");
    renderSellerProductsTable();
  }
}

function renderSellerCharts() {
  const ctx = document.getElementById("sellerSalesChart");
  if (!ctx || typeof Chart === "undefined") return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales (₹)',
        data: [1200, 1900, 3000, 5000, 2400, 3200, 4500],
        backgroundColor: '#1B8A5A',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}
