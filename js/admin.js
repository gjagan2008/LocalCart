/* ==========================================================================
   LocalCart — Admin Portal Management Engine
   User/Seller Management, Shop Approval, Categories CRUD, Complaints Resolver
   ========================================================================== */

function renderAdminDashboard() {
  const users = JSON.parse(localStorage.getItem("localcart_users") || "[]");
  const shops = JSON.parse(localStorage.getItem("localcart_shops") || "[]");
  const products = JSON.parse(localStorage.getItem("localcart_products") || "[]");
  const orders = JSON.parse(localStorage.getItem("localcart_orders") || "[]");
  const complaints = JSON.parse(localStorage.getItem("localcart_complaints") || "[]");

  const totalUsers = users.filter(u => u.role === "Customer").length;
  const activeSellers = users.filter(u => u.role === "Seller").length;
  const totalShops = shops.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingSellers = users.filter(u => u.role === "Seller" && u.status === "PENDING").length;

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl("adm-users-count", totalUsers);
  setEl("adm-sellers-count", activeSellers);
  setEl("adm-shops-count", totalShops);
  setEl("adm-products-count", totalProducts);
  setEl("adm-orders-count", totalOrders);
  setEl("adm-revenue-val", formatINR(totalRev));
  setEl("adm-pending-count", pendingSellers);
  setEl("adm-complaints-count", complaints.length);

  renderAdminRevenueChart();
}

function renderAdminUsersTable() {
  const container = document.getElementById("admin-users-table-body");
  if (!container) return;

  const users = JSON.parse(localStorage.getItem("localcart_users") || "[]");

  container.innerHTML = users.map(u => `
    <tr>
      <td style="font-weight:700; color:var(--navy);">${u.name}</td>
      <td>${u.email}</td>
      <td><span class="badge badge-navy">${u.role}</span></td>
      <td>
        <span class="badge ${u.status === 'BLOCKED' ? 'badge-danger' : 'badge-success'}">${u.status}</span>
      </td>
      <td>${u.joined || '2026-01-10'}</td>
      <td>
        ${u.status === 'BLOCKED' ? 
          `<button class="btn btn-outline btn-sm" onclick="toggleUserBlock('${u.id}', 'ACTIVE')">Unblock</button>` :
          `<button class="btn btn-outline btn-sm" style="color:var(--danger);" onclick="toggleUserBlock('${u.id}', 'BLOCKED')">Block</button>`
        }
      </td>
    </tr>
  `).join("");
}

function toggleUserBlock(userId, newStatus) {
  const users = JSON.parse(localStorage.getItem("localcart_users") || "[]");
  const user = users.find(u => u.id === userId);
  if (user) {
    user.status = newStatus;
    localStorage.setItem("localcart_users", JSON.stringify(users));
    showToast(`User status updated to ${newStatus}`, "info");
    renderAdminUsersTable();
  }
}

function renderAdminSellersTable() {
  const container = document.getElementById("admin-sellers-table-body");
  if (!container) return;

  const users = JSON.parse(localStorage.getItem("localcart_users") || "[]");
  const sellers = users.filter(u => u.role === "Seller");

  container.innerHTML = sellers.map(s => `
    <tr>
      <td style="font-weight:700; color:var(--navy);">${s.name}</td>
      <td>${s.email}</td>
      <td>
        <span class="badge ${s.status === 'APPROVED' ? 'badge-approved' : s.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'}">${s.status}</span>
      </td>
      <td>${s.joined || '2026-01-05'}</td>
      <td>
        <div style="display:flex; gap:0.35rem;">
          <button class="btn btn-primary btn-sm" onclick="updateSellerStatus('${s.id}', 'APPROVED')">Approve</button>
          <button class="btn btn-outline btn-sm" style="color:var(--danger);" onclick="updateSellerStatus('${s.id}', 'REJECTED')">Reject</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function updateSellerStatus(sellerId, newStatus) {
  const users = JSON.parse(localStorage.getItem("localcart_users") || "[]");
  const seller = users.find(u => u.id === sellerId);
  if (seller) {
    seller.status = newStatus;
    localStorage.setItem("localcart_users", JSON.stringify(users));
    showToast(`Seller ${seller.name} ${newStatus.toLowerCase()}`, "success");
    renderAdminSellersTable();
  }
}

function renderAdminComplaintsTable() {
  const container = document.getElementById("admin-complaints-table-body");
  if (!container) return;

  const complaints = JSON.parse(localStorage.getItem("localcart_complaints") || "[]");

  container.innerHTML = complaints.map(c => `
    <tr>
      <td><strong>#${c.id}</strong></td>
      <td>${c.user}</td>
      <td><span class="badge badge-warning">${c.type}</span></td>
      <td>${c.description}</td>
      <td><span class="badge ${c.status === 'RESOLVED' ? 'badge-success' : 'badge-navy'}">${c.status}</span></td>
      <td>
        <select class="form-control" style="padding:0.2rem 0.4rem; font-size:0.8rem;" onchange="updateComplaintStatus('${c.id}', this.value)">
          <option value="OPEN" ${c.status === 'OPEN' ? 'selected' : ''}>OPEN</option>
          <option value="IN REVIEW" ${c.status === 'IN REVIEW' ? 'selected' : ''}>IN REVIEW</option>
          <option value="RESOLVED" ${c.status === 'RESOLVED' ? 'selected' : ''}>RESOLVED</option>
          <option value="CLOSED" ${c.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
        </select>
      </td>
    </tr>
  `).join("");
}

function updateComplaintStatus(id, newStatus) {
  const complaints = JSON.parse(localStorage.getItem("localcart_complaints") || "[]");
  const comp = complaints.find(c => c.id === id);
  if (comp) {
    comp.status = newStatus;
    localStorage.setItem("localcart_complaints", JSON.stringify(complaints));
    showToast(`Complaint #${id} updated to ${newStatus}`, "info");
  }
}

function renderAdminRevenueChart() {
  const ctx = document.getElementById("adminRevenueChart");
  if (!ctx || typeof Chart === "undefined") return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [{
        label: 'Platform Revenue (₹)',
        data: [12000, 19000, 28000, 35000, 42000, 58000, 71000, 89000],
        borderColor: '#1B8A5A',
        backgroundColor: 'rgba(27, 138, 90, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}
