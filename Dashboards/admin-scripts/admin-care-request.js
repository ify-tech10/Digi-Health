/* =========================
   AUTH
========================= */
function getAuth() {
  try {
    const user = JSON.parse(localStorage.getItem("dh_user"));

    if (!user || !user.token || user.role !== "ADMIN") {
      localStorage.removeItem("dh_user");
      window.location.href = "../../login.html";
      return null;
    }

    return {
      token: user.token,
      role: user.role
    };

  } catch (err) {
    localStorage.removeItem("dh_user");
    window.location.href = "../../login.html";
    return null;
  }
}

function logout() {
  localStorage.removeItem("dh_user");
  window.location.href = "../../login.html";
}

/* =========================
   STATE
========================= */
let careRequestsCache = [];
let providersCache = [];
let currentTab = "all";
let selectedRequestId = null;
let selectedLocation = null;

/* =========================
   LOAD CARE REQUESTS
========================= */
async function loadCareRequests() {
  const tbody = document.getElementById("tableBody");

  tbody.innerHTML = `
    <tr>
      <td colspan="7">Loading...</td>
    </tr>
  `;

  try {
    const auth = getAuth();
    if (!auth) return;

    const res = await fetch(
      "https://digihealth-2795.onrender.com/api/admin/care-requests",
      {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }
    );

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("dh_user");
      window.location.href = "../../login.html";
      return;
    }

    if (!res.ok) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">Error ${res.status}</td>
        </tr>
      `;
      return;
    }

    const data = await res.json();
    careRequestsCache = data || [];

    document.getElementById("careRequestCount").textContent =
      careRequestsCache.length;

    renderTable(careRequestsCache);

  } catch (err) {
    console.error(err);
    tbody.innerHTML = `
      <tr>
        <td colspan="7">Network error</td>
      </tr>
    `;
  }
}

/* =========================
   RENDER TABLE
========================= */
function renderTable(data) {
  const tbody = document.getElementById("tableBody");

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">No care requests found</td>
      </tr>
    `;
    document.getElementById("rowCount").textContent = "0 requests";
    return;
  }

  tbody.innerHTML = "";

  data.forEach(req => {
    const tr = document.createElement("tr");

    tr.dataset.id       = req.id;
    tr.dataset.status   = (req.status || "").toLowerCase();
    tr.dataset.service  = (req.serviceNeeded || "").toLowerCase();
    tr.dataset.location = req.locationArea || "";

    tr.innerHTML = `
      <td class="td-name">
        ${req.fullName || "-"}<br>
        <small style="color:#888;">${req.email || "-"}</small>
      </td>
      <td>${req.serviceNeeded || "-"}</td>
      <td>${req.locationArea || "-"}</td>
      <td>${formatDate(req.submittedAt)}</td>
      <td>${req.phoneNumber || "-"}</td>
      <td>${getStatusBadge(req.status)}</td>
      <td>
        <div class="td-actions">
         <!-- <button class="act-btn act-assign">Assign</button> -->
          <button class="act-btn act-view">View</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("rowCount").textContent =
    `${data.length} request${data.length !== 1 ? "s" : ""}`;
}

/* =========================
   TABLE CLICK DELEGATION
========================= */
document.addEventListener("click", e => {

  const assignBtn = e.target.closest(".act-assign");
  if (assignBtn) {
    const row = assignBtn.closest("tr");
    openAssign(row.dataset.id, row.dataset.location);
    return;
  }

  const viewBtn = e.target.closest(".act-view");
  if (viewBtn) {
    const row = viewBtn.closest("tr");
    openView(row.dataset.id);
    return;
  }
});

/* =========================
   FILTER TABLE
========================= */
function filterTable() {
  const search   = document.getElementById("searchInput").value.toLowerCase();
  const statusF  = document.getElementById("statusFilter").value.toLowerCase();
  const serviceF = document.getElementById("serviceFilter").value.toLowerCase();

  const rows = document.querySelectorAll("#tableBody tr");
  let count = 0;

  rows.forEach(row => {
    const status  = row.dataset.status  || "";
    const service = row.dataset.service || "";
    const text    = row.innerText.toLowerCase();

    let show = text.includes(search);

    if (statusF && status !== statusF)          show = false;
    if (serviceF && !service.includes(serviceF)) show = false;

    if (currentTab === "unassigned" && status === "assigned") show = false;
    if (currentTab === "assigned"   && status !== "assigned") show = false;
    if (currentTab === "completed"  && status !== "completed") show = false;

    row.style.display = show ? "" : "none";
    if (show) count++;
  });

  document.getElementById("rowCount").textContent =
    `${count} request${count !== 1 ? "s" : ""}`;
}

/* =========================
   VIEW REQUEST
========================= */
function openView(id) {
  const req = careRequestsCache.find(r => r.id == id);
  if (!req) return;

  selectedRequestId = req.id;
  selectedLocation  = req.locationArea || null;

  document.getElementById("viewModalBody").innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Patient</span>
      <span class="detail-value">${req.fullName || "-"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Email</span>
      <span class="detail-value">${req.email || "-"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Phone</span>
      <span class="detail-value">${req.phoneNumber || "-"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Service</span>
      <span class="detail-value">${req.serviceNeeded || "-"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Location</span>
      <span class="detail-value">${req.locationArea || "-"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status</span>
      <span class="detail-value">${req.status || "-"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Preferred Time</span>
      <span class="detail-value">${req.preferredContactTime || "-"}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Assigned Provider</span>
      <span class="detail-value">${req.assignedProviderName || "-"}</span>
    </div>
  `;

  // Show or hide the Assign button based on status
  const assignBtn = document.querySelector("#viewModal .btn-modal-assign");
  if (assignBtn) {
    assignBtn.style.display =
      req.status?.toLowerCase() === "pending" ? "" : "none";
  }

  document.getElementById("viewModal").classList.add("open");
}

/* =========================
   ASSIGN MODAL
========================= */
function openAssign(requestId, location) {
  closeModal("viewModal");
  selectedRequestId = requestId;
  selectedLocation  = location;
  document.getElementById("assignModal").classList.add("open");
  loadProviders(location);
}

/* =========================
   LOAD PROVIDERS
========================= */
async function loadProviders(location) {
  const select = document.getElementById("providerSelect");

  try {
    const auth = getAuth();
    if (!auth) return;

    const url = new URL("https://digihealth-2795.onrender.com/api/admin/providers/available");
    url.searchParams.set("careRequestId", selectedRequestId);
    if (location) url.searchParams.set("location", location);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    if (res.status === 401) {
      localStorage.removeItem("dh_user");
      window.location.href = "../../login.html";
      return;
    }

    if (res.status === 404) {
      select.innerHTML = `<option value="">No providers available in this area</option>`;
      return;
    }

    if (!res.ok) throw new Error("Failed to load providers");

    const data = await res.json();
    const providers = data.content || [];
    providersCache = providers;

    if (providers.length === 0) {
      select.innerHTML = `<option value="">No providers available</option>`;
      return;
    }

    select.innerHTML = `<option value="">Select provider</option>`;
    providers.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = `${p.fullName} (${p.serviceProviderType || "General"})`;
      select.appendChild(option);
    });

  } catch (err) {
    console.error(err);
    select.innerHTML = `<option value="">Error loading providers</option>`;
  }
}

/* =========================
   CONFIRM ASSIGNMENT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("confirmAssignBtn").addEventListener("click", async () => {
    const providerId = document.getElementById("providerSelect").value;
    const note       = document.getElementById("adminNoteInput").value.trim();

    if (!providerId) {
      alert("Please select a provider.");
      return;
    }

    if (!selectedRequestId) {
      alert("No care request selected.");
      return;
    }

    try {
      const auth = getAuth();
      if (!auth) return;

      const res = await fetch(
        `https://digihealth-2795.onrender.com/api/admin/care-requests/${selectedRequestId}/assign`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ providerId, note })
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(`Assignment failed: ${err.message || res.status}`);
        return;
      }

      closeModal("assignModal");
      selectedRequestId = null;
      selectedLocation  = null;
      await loadCareRequests();

    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  });
});

/* =========================
   MODALS
========================= */
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

/* =========================
   TABS
========================= */
function setTab(el, tab) {
  currentTab = tab;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  filterTable();
}

/* =========================
   HELPERS
========================= */
function getStatusBadge(status) {
  switch ((status || "").toLowerCase()) {
    case "urgent":   return `<span class="badge badge-urgent">Urgent</span>`;
    case "new":      return `<span class="badge badge-new">New</span>`;
    case "assigned": return `<span class="badge badge-active">Assigned</span>`;
    case "pending":  return `<span class="badge badge-pending">Pending</span>`;
    default:         return `<span class="badge">${status || "-"}</span>`;
  }
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* =========================
   EXPORT CSV
========================= */
function exportCSV() {
  const rows = [["Patient", "Service", "Location", "Status", "Submitted"]];

  careRequestsCache.forEach(r => {
    rows.push([
      r.fullName     || "",
      r.serviceNeeded || "",
      r.locationArea  || "",
      r.status        || "",
      formatDate(r.submittedAt)
    ]);
  });

  const csv = rows.map(r => r.join(",")).join("\n");
  const a   = document.createElement("a");
  a.href     = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = "care-requests.csv";
  a.click();
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadCareRequests();

  document.querySelectorAll(".modal-overlay").forEach(m => {
    m.addEventListener("click", e => {
      if (e.target === m) m.classList.remove("open");
    });
  });
});