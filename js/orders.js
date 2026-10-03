/* ==========================================================================
   LocalCart — Order Placement, Tracking Timeline & History
   ========================================================================== */

function placeOrder(paymentMethod, deliveryAddress) {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Cart is empty", "danger");
    return;
  }

  const { subtotal, deliveryFee, discount, total } = calculateCartTotals();
  const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
  const currentUser = getCurrentUser() || { name: "Guest Customer", email: "guest@example.com" };

  const newOrder = {
    id: orderId,
    customerId: currentUser.id || "cust-1",
    customerName: currentUser.name,
    customerPhone: "+91 98765 43210",
    shopId: cart[0].shopId,
    shopName: cart[0].shopName,
    items: [...cart],
    subtotal,
    deliveryFee,
    discount,
    total,
    status: "PLACED", // PLACED, ACCEPTED, PREPARING, READY, OUT FOR DELIVERY, DELIVERED
    paymentMethod: paymentMethod || "Cash on Delivery",
    deliveryAddress: deliveryAddress || "124 M.G. Road, Indiranagar, Bengaluru - 560038",
    date: new Date().toLocaleString()
  };

  const orders = JSON.parse(localStorage.getItem("localcart_orders") || "[]");
  orders.unshift(newOrder);
  localStorage.setItem("localcart_orders", JSON.stringify(orders));

  // Clear cart
  localStorage.setItem("localcart_cart", JSON.stringify([]));
  updateCartBadge();

  // Show Modal Popup
  const modalHTML = `
    <div class="modal-backdrop active" id="order-success-modal">
      <div class="modal text-center" style="padding:2rem;">
        <div style="width:70px; height:70px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem auto; font-size:2rem;">
          <i data-lucide="check-circle"></i>
        </div>
        <h2 style="font-size:1.6rem; color:var(--navy); margin-bottom:0.5rem;">Order Placed Successfully!</h2>
        <p style="color:var(--muted); margin-bottom:1.5rem;">Your order <strong>${orderId}</strong> has been received by <strong>${newOrder.shopName}</strong>.</p>
        <div style="background:var(--background); padding:1rem; border-radius:var(--radius-md); font-weight:700; margin-bottom:1.5rem;">
          Total Amount Paid: ${formatINR(total)} (${paymentMethod})
        </div>
        <div style="display:flex; gap:1rem; justify-center;">
          <a href="order-tracking.html?id=${orderId}" class="btn btn-primary" style="width:100%;">Track Order Live</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  renderIcons();
}

function renderOrderTrackingPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id") || "ORD-9821";
  
  const orders = JSON.parse(localStorage.getItem("localcart_orders") || "[]");
  const order = orders.find(o => o.id === orderId) || orders[0];

  const container = document.getElementById("order-tracking-container");
  if (!container || !order) return;

  const statuses = ["PLACED", "ACCEPTED", "PREPARING", "READY", "OUT FOR DELIVERY", "DELIVERED"];
  const currentIndex = statuses.indexOf(order.status);
  const progressPct = Math.round((currentIndex / (statuses.length - 1)) * 100);

  container.innerHTML = `
    <div class="card" style="padding:2rem; margin-bottom:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
        <div>
          <span class="badge badge-accent" style="margin-bottom:0.4rem;">Live Tracking</span>
          <h2 style="font-size:1.75rem;">Order ID: #${order.id}</h2>
          <div style="color:var(--muted); font-size:0.9rem;">From <strong>${order.shopName}</strong> • Placed on ${order.date}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.5rem; font-weight:800; color:var(--navy);">${formatINR(order.total)}</div>
          <span class="badge badge-success">${order.paymentMethod}</span>
        </div>
      </div>

      <!-- Timeline -->
      <div class="tracking-timeline">
        <div class="tracking-progress-bar" style="width: ${progressPct}%;"></div>
        ${statuses.map((st, idx) => `
          <div class="timeline-step ${idx <= currentIndex ? (idx === currentIndex ? 'active' : 'completed') : ''}">
            <div class="step-dot">
              ${idx < currentIndex ? '<i data-lucide="check"></i>' : (idx + 1)}
            </div>
            <div class="step-label">${st}</div>
          </div>
        `).join("")}
      </div>

      <!-- Demo simulation button -->
      <div style="background:var(--background); padding:1rem 1.25rem; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; margin-top:2rem;">
        <span style="font-size:0.88rem; font-weight:600; color:var(--navy);">
          <i data-lucide="play" style="vertical-align:middle; color:var(--accent);"></i> Simulation Control (Demo Mode)
        </span>
        <button class="btn btn-outline btn-sm" onclick="advanceDemoOrderStatus('${order.id}')">Advance Status ➔</button>
      </div>
    </div>

    <!-- Items & Address -->
    <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:1.75rem;">
      <div class="card" style="padding:1.5rem;">
        <h3 style="font-size:1.15rem; margin-bottom:1rem;">Ordered Items</h3>
        ${order.items.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-bottom:1px solid var(--border);">
            <div>
              <h4 style="font-size:0.95rem; font-weight:700; color:var(--navy);">${item.name}</h4>
              <span style="font-size:0.85rem; color:var(--muted);">Qty: ${item.qty} × ${formatINR(item.price)}</span>
            </div>
            <span style="font-weight:700; color:var(--navy);">${formatINR(item.price * item.qty)}</span>
          </div>
        `).join("")}
      </div>
      <div class="card" style="padding:1.5rem;">
        <h3 style="font-size:1.15rem; margin-bottom:1rem;">Delivery Details</h3>
        <div style="margin-bottom:1rem;">
          <label style="font-size:0.8rem; font-weight:700; color:var(--muted); text-transform:uppercase;">Customer Name</label>
          <div style="font-weight:700; color:var(--navy);">${order.customerName}</div>
        </div>
        <div>
          <label style="font-size:0.8rem; font-weight:700; color:var(--muted); text-transform:uppercase;">Address</label>
          <div style="font-size:0.9rem; color:var(--text); line-height:1.5;">${order.deliveryAddress}</div>
        </div>
      </div>
    </div>
  `;

  renderIcons();
}

function advanceDemoOrderStatus(orderId) {
  const statuses = ["PLACED", "ACCEPTED", "PREPARING", "READY", "OUT FOR DELIVERY", "DELIVERED"];
  const orders = JSON.parse(localStorage.getItem("localcart_orders") || "[]");
  const order = orders.find(o => o.id === orderId);

  if (order) {
    let currIdx = statuses.indexOf(order.status);
    let nextIdx = (currIdx + 1) % statuses.length;
    order.status = statuses[nextIdx];
    localStorage.setItem("localcart_orders", JSON.stringify(orders));
    showToast(`Order status updated to: ${order.status}`, "info");
    renderOrderTrackingPage();
  }
}
