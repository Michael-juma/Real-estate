// Sample data storage
let properties = [
  {
    id: 1,
    name: "Sunset Apartments",
    type: "apartment",
    address: "123 Main St",
    city: "New York",
    units: 10,
    occupiedUnits: 8,
    rent: 2500,
    status: "occupied",
    image: "/modern-apartment-building.png",
    amenities: "Wi-Fi, Parking, Gym",
    description: "Modern apartment complex in downtown",
  },
  {
    id: 2,
    name: "Green Valley House",
    type: "house",
    address: "456 Oak Ave",
    city: "Los Angeles",
    units: 1,
    occupiedUnits: 1,
    rent: 3500,
    status: "occupied",
    image: "/suburban-house.png",
    amenities: "Garden, Garage, Pool",
    description: "Beautiful family home with large backyard",
  },
  {
    id: 3,
    name: "Downtown Office Space",
    type: "office",
    address: "789 Business Blvd",
    city: "Chicago",
    units: 5,
    occupiedUnits: 3,
    rent: 4000,
    status: "vacant",
    image: "/modern-glass-office.png",
    amenities: "Conference rooms, Parking, Security",
    description: "Prime office location in business district",
  },
]

let tenants = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 234 567 8901",
    propertyId: 1,
    unit: "5A",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    rent: 2500,
    paymentStatus: "paid",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 234 567 8902",
    propertyId: 2,
    unit: "Main",
    leaseStart: "2023-06-01",
    leaseEnd: "2025-05-31",
    rent: 3500,
    paymentStatus: "paid",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    phone: "+1 234 567 8903",
    propertyId: 1,
    unit: "3B",
    leaseStart: "2024-03-01",
    leaseEnd: "2025-02-28",
    rent: 2500,
    paymentStatus: "pending",
  },
]

const payments = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    tenantId: 1,
    propertyId: 1,
    amount: 2500,
    dueDate: "2025-01-01",
    status: "paid",
    paidDate: "2024-12-28",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    tenantId: 2,
    propertyId: 2,
    amount: 3500,
    dueDate: "2025-01-01",
    status: "paid",
    paidDate: "2024-12-30",
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    tenantId: 3,
    propertyId: 1,
    amount: 2500,
    dueDate: "2025-01-01",
    status: "pending",
  },
]

const maintenanceRequests = [
  {
    id: 1,
    requestNumber: "MR-001",
    propertyId: 1,
    issue: "Leaking faucet in Unit 5A",
    priority: "medium",
    assignedTo: "John's Plumbing",
    status: "in-progress",
    cost: 150,
  },
  {
    id: 2,
    requestNumber: "MR-002",
    propertyId: 2,
    issue: "HVAC system maintenance",
    priority: "high",
    assignedTo: "Cool Air Services",
    status: "pending",
    cost: 500,
  },
  {
    id: 3,
    requestNumber: "MR-003",
    propertyId: 1,
    issue: "Broken window in common area",
    priority: "urgent",
    assignedTo: "Glass Masters",
    status: "pending",
    cost: 300,
  },
]

// Import Bootstrap and Google Maps
// const google = window.google

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData()
  loadProperties()
  loadTenants()
  loadPayments()
  loadMaintenance()
  initializeCharts()
  populatePropertyDropdowns()
})

// Navigation functions
function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".content-section")
  sections.forEach((section) => {
    section.style.display = "none"
  })

  // Show selected section
  const targetSection = document.getElementById(sectionName + "-section")
  if (targetSection) {
    targetSection.style.display = "block"
  }

  // Update active nav link
  const navLinks = document.querySelectorAll(".sidebar .nav-link")
  navLinks.forEach((link) => {
    link.classList.remove("active")
  })
  event.target.classList.add("active")
}

// Load dashboard overview data
function loadDashboardData() {
  // Update stats
  document.getElementById("totalProperties").textContent = properties.length

  const totalUnits = properties.reduce((sum, prop) => sum + prop.units, 0)
  const occupiedUnits = properties.reduce((sum, prop) => sum + prop.occupiedUnits, 0)
  document.getElementById("occupiedUnits").textContent = `${occupiedUnits}/${totalUnits}`

  const monthlyRevenue = properties.reduce((sum, prop) => sum + prop.rent * prop.occupiedUnits, 0)
  document.getElementById("monthlyRevenue").textContent = `$${monthlyRevenue.toLocaleString()}`

  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  document.getElementById("pendingPayments").textContent = `$${pendingAmount.toLocaleString()}`

  // Load recent properties table
  const tableBody = document.getElementById("recentPropertiesTable")
  tableBody.innerHTML = ""

  properties.slice(0, 5).forEach((property) => {
    const occupancyRate = ((property.occupiedUnits / property.units) * 100).toFixed(0)
    const statusBadge = property.status === "occupied" ? "success" : property.status === "vacant" ? "warning" : "danger"

    const row = `
            <tr>
                <td>${property.name}</td>
                <td>${property.city}</td>
                <td>${property.units}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" style="width: ${occupancyRate}%">${occupancyRate}%</div>
                    </div>
                </td>
                <td><span class="badge bg-${statusBadge}">${property.status}</span></td>
            </tr>
        `
    tableBody.innerHTML += row
  })
}

// Load properties
function loadProperties() {
  const grid = document.getElementById("propertiesGrid")
  grid.innerHTML = ""

  properties.forEach((property) => {
    const occupancyRate = ((property.occupiedUnits / property.units) * 100).toFixed(0)
    const statusBadge = property.status === "occupied" ? "success" : property.status === "vacant" ? "warning" : "danger"

    const card = `
            <div class="col-md-4">
                <div class="card property-card" onclick="viewPropertyDetails(${property.id})">
                    <img src="${property.image}" class="card-img-top" alt="${property.name}">
                    <div class="card-body">
                        <h5 class="card-title">${property.name}</h5>
                        <p class="text-muted mb-2"><i class="bi bi-geo-alt"></i> ${property.city}</p>
                        <p class="card-text">${property.description}</p>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span><i class="bi bi-door-open"></i> ${property.units} Units</span>
                            <span class="badge bg-${statusBadge}">${property.status}</span>
                        </div>
                        <div class="progress mb-2" style="height: 20px;">
                            <div class="progress-bar" role="progressbar" style="width: ${occupancyRate}%">${occupancyRate}% Occupied</div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-primary">$${property.rent}/month</strong>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary" onclick="event.stopPropagation(); editProperty(${property.id})">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-outline-danger" onclick="event.stopPropagation(); deleteProperty(${property.id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    grid.innerHTML += card
  })
}

// Load tenants
function loadTenants() {
  const tableBody = document.getElementById("tenantsTable")
  tableBody.innerHTML = ""

  tenants.forEach((tenant) => {
    const property = properties.find((p) => p.id === tenant.propertyId)
    const statusBadge = tenant.paymentStatus === "paid" ? "success" : "warning"

    const row = `
            <tr>
                <td>${tenant.name}</td>
                <td>${property ? property.name : "N/A"}</td>
                <td>${tenant.unit}</td>
                <td>${tenant.leaseStart}</td>
                <td>${tenant.leaseEnd}</td>
                <td>$${tenant.rent}</td>
                <td><span class="badge bg-${statusBadge}">${tenant.paymentStatus}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewTenant(${tenant.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTenant(${tenant.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `
    tableBody.innerHTML += row
  })
}

// Load payments
function loadPayments() {
  const tableBody = document.getElementById("paymentsTable")
  tableBody.innerHTML = ""

  payments.forEach((payment) => {
    const tenant = tenants.find((t) => t.id === payment.tenantId)
    const property = properties.find((p) => p.id === payment.propertyId)
    const statusBadge = payment.status === "paid" ? "success" : payment.status === "pending" ? "warning" : "danger"

    const row = `
            <tr>
                <td>${payment.invoiceNumber}</td>
                <td>${tenant ? tenant.name : "N/A"}</td>
                <td>${property ? property.name : "N/A"}</td>
                <td>$${payment.amount}</td>
                <td>${payment.dueDate}</td>
                <td><span class="badge bg-${statusBadge}">${payment.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewInvoice(${payment.id})">
                        <i class="bi bi-file-text"></i>
                    </button>
                    ${payment.status !== "paid" ? `<button class="btn btn-sm btn-outline-success" onclick="markAsPaid(${payment.id})"><i class="bi bi-check"></i></button>` : ""}
                </td>
            </tr>
        `
    tableBody.innerHTML += row
  })
}

// Load maintenance requests
function loadMaintenance() {
  const tableBody = document.getElementById("maintenanceTable")
  tableBody.innerHTML = ""

  maintenanceRequests.forEach((request) => {
    const property = properties.find((p) => p.id === request.propertyId)
    const priorityBadge = request.priority === "urgent" ? "danger" : request.priority === "high" ? "warning" : "info"
    const statusBadge =
      request.status === "completed" ? "success" : request.status === "in-progress" ? "info" : "warning"

    const row = `
            <tr>
                <td>${request.requestNumber}</td>
                <td>${property ? property.name : "N/A"}</td>
                <td>${request.issue}</td>
                <td><span class="badge bg-${priorityBadge}">${request.priority}</span></td>
                <td>${request.assignedTo}</td>
                <td><span class="badge bg-${statusBadge}">${request.status}</span></td>
                <td>$${request.cost}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewMaintenance(${request.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="updateMaintenanceStatus(${request.id})">
                        <i class="bi bi-check"></i>
                    </button>
                </td>
            </tr>
        `
    tableBody.innerHTML += row
  })
}

// Initialize charts
function initializeCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById("revenueChart")
  if (revenueCtx) {
    window.Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Revenue",
            data: [42000, 43500, 44000, 45000, 45500, 46000, 45000, 44500, 45000, 45500, 46000, 45000],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            tension: 0.4,
          },
          {
            label: "Expenses",
            data: [10000, 10500, 11000, 10800, 11200, 10900, 11500, 10700, 11000, 10800, 11200, 10500],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    })
  }

  // Expense Breakdown Chart
  const expenseCtx = document.getElementById("expenseChart")
  if (expenseCtx) {
    window.Chart(expenseCtx, {
      type: "doughnut",
      data: {
        labels: ["Maintenance", "Taxes", "Utilities", "Insurance", "Other"],
        datasets: [
          {
            data: [45000, 35000, 25000, 15000, 5000],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    })
  }

  // Occupancy Trends Chart
  const occupancyCtx = document.getElementById("occupancyChart")
  if (occupancyCtx) {
    window.Chart(occupancyCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Occupancy Rate (%)",
            data: [85, 87, 88, 90, 89, 91, 92, 90, 89, 90, 91, 90],
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    })
  }

  // Revenue Growth Chart
  const revenueGrowthCtx = document.getElementById("revenueGrowthChart")
  if (revenueGrowthCtx) {
    window.Chart(revenueGrowthCtx, {
      type: "line",
      data: {
        labels: ["2020", "2021", "2022", "2023", "2024"],
        datasets: [
          {
            label: "Annual Revenue",
            data: [420000, 465000, 510000, 525000, 540000],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })
  }

  // Load ROI table
  loadROITable()
}

// Load ROI table
function loadROITable() {
  const tableBody = document.getElementById("roiTable")
  if (!tableBody) return

  tableBody.innerHTML = ""

  const roiData = [
    { property: "Sunset Apartments", investment: 500000, revenue: 300000, expenses: 75000, netIncome: 225000, roi: 45 },
    { property: "Green Valley House", investment: 400000, revenue: 42000, expenses: 12000, netIncome: 30000, roi: 7.5 },
    {
      property: "Downtown Office Space",
      investment: 800000,
      revenue: 240000,
      expenses: 60000,
      netIncome: 180000,
      roi: 22.5,
    },
  ]

  roiData.forEach((data) => {
    const row = `
            <tr>
                <td>${data.property}</td>
                <td>$${data.investment.toLocaleString()}</td>
                <td>$${data.revenue.toLocaleString()}</td>
                <td>$${data.expenses.toLocaleString()}</td>
                <td class="text-success">$${data.netIncome.toLocaleString()}</td>
                <td><strong class="text-primary">${data.roi}%</strong></td>
            </tr>
        `
    tableBody.innerHTML += row
  })
}

// Modal functions
function showAddPropertyModal() {
  const modal = new bootstrap.Modal(document.getElementById("addPropertyModal"))
  modal.show()
}

function showAddTenantModal() {
  const modal = new bootstrap.Modal(document.getElementById("addTenantModal"))
  modal.show()
}

function showRecordPaymentModal() {
  const modal = new bootstrap.Modal(document.getElementById("recordPaymentModal"))
  modal.show()
}

function showAddMaintenanceModal() {
  const modal = new bootstrap.Modal(document.getElementById("addMaintenanceModal"))
  modal.show()
}

// Add property function
function addProperty() {
  const name = document.getElementById("propertyName").value
  const type = document.getElementById("propertyType").value
  const address = document.getElementById("propertyAddress").value
  const city = document.getElementById("propertyCity").value
  const units = Number.parseInt(document.getElementById("propertyUnits").value)
  const rent = Number.parseFloat(document.getElementById("propertyRent").value)
  const description = document.getElementById("propertyDescription").value
  const amenities = document.getElementById("propertyAmenities").value

  if (!name || !type || !address || !city || !units || !rent) {
    alert("Please fill in all required fields")
    return
  }

  const newProperty = {
    id: properties.length + 1,
    name,
    type,
    address,
    city,
    units,
    occupiedUnits: 0,
    rent,
    status: "vacant",
  image: `https://picsum.photos/seed/${encodeURIComponent(type)} /800/450`.replace(/\s+/g, ''),
    amenities,
    description,
  }

  properties.push(newProperty)
  loadProperties()
  loadDashboardData()

  bootstrap.Modal.getInstance(document.getElementById("addPropertyModal")).hide()
  document.getElementById("addPropertyForm").reset()

  alert("Property added successfully!")
}

// Add tenant function
function addTenant() {
  const name = document.getElementById("tenantName").value
  const email = document.getElementById("tenantEmail").value
  const phone = document.getElementById("tenantPhone").value
  const propertyId = Number.parseInt(document.getElementById("tenantProperty").value)
  const unit = document.getElementById("tenantUnit").value
  const leaseStart = document.getElementById("leaseStart").value
  const leaseEnd = document.getElementById("leaseEnd").value
  const rent = Number.parseFloat(document.getElementById("tenantRent").value)

  if (!name || !email || !phone || !propertyId || !unit || !leaseStart || !leaseEnd || !rent) {
    alert("Please fill in all required fields")
    return
  }

  const newTenant = {
    id: tenants.length + 1,
    name,
    email,
    phone,
    propertyId,
    unit,
    leaseStart,
    leaseEnd,
    rent,
    paymentStatus: "pending",
  }

  tenants.push(newTenant)
  loadTenants()

  bootstrap.Modal.getInstance(document.getElementById("addTenantModal")).hide()
  document.getElementById("addTenantForm").reset()

  alert("Tenant added successfully!")
}

// Record payment function
function recordPayment() {
  const tenantId = Number.parseInt(document.getElementById("paymentTenant").value)
  const amount = Number.parseFloat(document.getElementById("paymentAmount").value)
  const method = document.getElementById("paymentMethod").value
  const date = document.getElementById("paymentDate").value

  if (!tenantId || !amount || !method || !date) {
    alert("Please fill in all required fields")
    return
  }

  const tenant = tenants.find((t) => t.id === tenantId)
  const newPayment = {
    id: payments.length + 1,
    invoiceNumber: `INV-${String(payments.length + 1).padStart(3, "0")}`,
    tenantId,
    propertyId: tenant.propertyId,
    amount,
    dueDate: date,
    status: "paid",
    paidDate: date,
  }

  payments.push(newPayment)
  tenant.paymentStatus = "paid"

  loadPayments()
  loadTenants()
  loadDashboardData()

  bootstrap.Modal.getInstance(document.getElementById("recordPaymentModal")).hide()
  document.getElementById("recordPaymentForm").reset()

  alert("Payment recorded successfully!")
}

// Add maintenance function
function addMaintenance() {
  const propertyId = Number.parseInt(document.getElementById("maintenanceProperty").value)
  const issue = document.getElementById("maintenanceIssue").value
  const priority = document.getElementById("maintenancePriority").value
  const assignedTo = document.getElementById("maintenanceAssignee").value
  const cost = Number.parseFloat(document.getElementById("maintenanceCost").value) || 0

  if (!propertyId || !issue || !priority) {
    alert("Please fill in all required fields")
    return
  }

  const newRequest = {
    id: maintenanceRequests.length + 1,
    requestNumber: `MR-${String(maintenanceRequests.length + 1).padStart(3, "0")}`,
    propertyId,
    issue,
    priority,
    assignedTo: assignedTo || "Unassigned",
    status: "pending",
    cost,
  }

  maintenanceRequests.push(newRequest)
  loadMaintenance()

  bootstrap.Modal.getInstance(document.getElementById("addMaintenanceModal")).hide()
  document.getElementById("addMaintenanceForm").reset()

  alert("Work order created successfully!")
}

// Populate property dropdowns
function populatePropertyDropdowns() {
  const tenantPropertySelect = document.getElementById("tenantProperty")
  const maintenancePropertySelect = document.getElementById("maintenanceProperty")

  properties.forEach((property) => {
    const option = `<option value="${property.id}">${property.name}</option>`
    if (tenantPropertySelect) tenantPropertySelect.innerHTML += option
    if (maintenancePropertySelect) maintenancePropertySelect.innerHTML += option
  })

  // Populate tenant dropdown for payments
  const paymentTenantSelect = document.getElementById("paymentTenant")
  tenants.forEach((tenant) => {
    const option = `<option value="${tenant.id}">${tenant.name}</option>`
    if (paymentTenantSelect) paymentTenantSelect.innerHTML += option
  })
}

// Filter properties
function filterProperties() {
  const cityFilter = document.getElementById("cityFilter").value.toLowerCase()
  const statusFilter = document.getElementById("statusFilter").value.toLowerCase()
  const searchTerm = document.getElementById("searchProperty").value.toLowerCase()

  const filteredProperties = properties.filter((property) => {
    const matchesCity = !cityFilter || property.city.toLowerCase() === cityFilter
    const matchesStatus = !statusFilter || property.status.toLowerCase() === statusFilter
    const matchesSearch =
      !searchTerm ||
      property.name.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm)

    return matchesCity && matchesStatus && matchesSearch
  })

  // Re-render properties grid with filtered results
  const grid = document.getElementById("propertiesGrid")
  grid.innerHTML = ""

  filteredProperties.forEach((property) => {
    const occupancyRate = ((property.occupiedUnits / property.units) * 100).toFixed(0)
    const statusBadge = property.status === "occupied" ? "success" : property.status === "vacant" ? "warning" : "danger"

    const card = `
            <div class="col-md-4">
                <div class="card property-card" onclick="viewPropertyDetails(${property.id})">
                    <img src="${property.image}" class="card-img-top" alt="${property.name}">
                    <div class="card-body">
                        <h5 class="card-title">${property.name}</h5>
                        <p class="text-muted mb-2"><i class="bi bi-geo-alt"></i> ${property.city}</p>
                        <p class="card-text">${property.description}</p>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span><i class="bi bi-door-open"></i> ${property.units} Units</span>
                            <span class="badge bg-${statusBadge}">${property.status}</span>
                        </div>
                        <div class="progress mb-2" style="height: 20px;">
                            <div class="progress-bar" role="progressbar" style="width: ${occupancyRate}%">${occupancyRate}% Occupied</div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-primary">$${property.rent}/month</strong>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary" onclick="event.stopPropagation(); editProperty(${property.id})">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-outline-danger" onclick="event.stopPropagation(); deleteProperty(${property.id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    grid.innerHTML += card
  })
}

// Toggle property view (grid/list)
function togglePropertyView(view) {
  // This function can be expanded to switch between grid and list views
  console.log("Switching to " + view + " view")
}

// View property details
function viewPropertyDetails(id) {
  const property = properties.find((p) => p.id === id)
  if (property) {
    alert(
      `Property Details:\n\nName: ${property.name}\nType: ${property.type}\nLocation: ${property.address}, ${property.city}\nUnits: ${property.units}\nRent: $${property.rent}/month\nAmenities: ${property.amenities}\n\nDescription: ${property.description}`,
    )
  }
}

// Edit property
function editProperty(id) {
  alert("Edit property functionality - Property ID: " + id)
}

// Delete property
function deleteProperty(id) {
  if (confirm("Are you sure you want to delete this property?")) {
    properties = properties.filter((p) => p.id !== id)
    loadProperties()
    loadDashboardData()
    alert("Property deleted successfully!")
  }
}

// View tenant
function viewTenant(id) {
  const tenant = tenants.find((t) => t.id === id)
  if (tenant) {
    const property = properties.find((p) => p.id === tenant.propertyId)
    alert(
      `Tenant Details:\n\nName: ${tenant.name}\nEmail: ${tenant.email}\nPhone: ${tenant.phone}\nProperty: ${property ? property.name : "N/A"}\nUnit: ${tenant.unit}\nLease: ${tenant.leaseStart} to ${tenant.leaseEnd}\nRent: $${tenant.rent}/month`,
    )
  }
}

// Delete tenant
function deleteTenant(id) {
  if (confirm("Are you sure you want to remove this tenant?")) {
    tenants = tenants.filter((t) => t.id !== id)
    loadTenants()
    alert("Tenant removed successfully!")
  }
}

// View invoice
function viewInvoice(id) {
  const payment = payments.find((p) => p.id === id)
  if (payment) {
    const tenant = tenants.find((t) => t.id === payment.tenantId)
    const property = properties.find((p) => p.id === payment.propertyId)
    alert(
      `Invoice Details:\n\nInvoice #: ${payment.invoiceNumber}\nTenant: ${tenant ? tenant.name : "N/A"}\nProperty: ${property ? property.name : "N/A"}\nAmount: $${payment.amount}\nDue Date: ${payment.dueDate}\nStatus: ${payment.status}`,
    )
  }
}

// Mark payment as paid
function markAsPaid(id) {
  const payment = payments.find((p) => p.id === id)
  if (payment) {
    payment.status = "paid"
    payment.paidDate = new Date().toISOString().split("T")[0]
    loadPayments()
    loadDashboardData()
    alert("Payment marked as paid!")
  }
}

// View maintenance request
function viewMaintenance(id) {
  const request = maintenanceRequests.find((r) => r.id === id)
  if (request) {
    const property = properties.find((p) => p.id === request.propertyId)
    alert(
      `Maintenance Request:\n\nRequest #: ${request.requestNumber}\nProperty: ${property ? property.name : "N/A"}\nIssue: ${request.issue}\nPriority: ${request.priority}\nAssigned To: ${request.assignedTo}\nStatus: ${request.status}\nCost: $${request.cost}`,
    )
  }
}

// Update maintenance status
function updateMaintenanceStatus(id) {
  const request = maintenanceRequests.find((r) => r.id === id)
  if (request) {
    const newStatus = prompt("Enter new status (pending/in-progress/completed):", request.status)
    if (newStatus && ["pending", "in-progress", "completed"].includes(newStatus)) {
      request.status = newStatus
      loadMaintenance()
      alert("Status updated successfully!")
    }
  }
}

// Export financial report
function exportFinancialReport() {
  alert("Exporting financial report... (This would generate a PDF/Excel file)")
}

// Export analytics report
function exportAnalyticsReport() {
  alert("Exporting analytics report... (This would generate a PDF/Excel file)")
}

// Initialize Google Maps
function initMap() {
  const mapElement = document.getElementById("map")
  if (!mapElement) return

  // Default center (you can change this)
  const center = { lat: 40.7128, lng: -74.006 }

  const map = new google.maps.Map(mapElement, {
    zoom: 10,
    center: center,
  })

  // Add markers for each property
  properties.forEach((property) => {
    // In a real application, you would geocode the address to get coordinates
    // For demo purposes, we'll use random coordinates near the center
    const lat = center.lat + (Math.random() - 0.5) * 0.2
    const lng = center.lng + (Math.random() - 0.5) * 0.2

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: property.name,
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
                <div style="padding: 10px;">
                    <h6>${property.name}</h6>
                    <p>${property.address}, ${property.city}</p>
                    <p><strong>Status:</strong> ${property.status}</p>
                    <p><strong>Occupancy:</strong> ${property.occupiedUnits}/${property.units}</p>
                </div>
            `,
    })

    marker.addListener("click", () => {
      infoWindow.open(map, marker)
    })
  })
}

// Global variables
let receipts = []
let currentUser = null
let map = null
const markers = []
let revenueChart = null
let expenseChart = null
let currentPropertyId = null
let propertyImages = []
const bootstrap = window.bootstrap
const google = window.google

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  checkAuth()

  // Load data from localStorage
  loadData()

  // Initialize dashboard
  updateDashboard()

  // Set current date
  document.getElementById("currentDate").textContent = new Date().toLocaleDateString()

  // Initialize charts
  initializeCharts()

  console.log("[v0] Dashboard initialized")
})

// Authentication check
function checkAuth() {
  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"))
  } catch (e) {
    currentUser = null
  }

  if (!currentUser || currentUser.role !== "owner") {
    // For demo purposes, create a default owner
    currentUser = {
      id: "owner1",
      name: "Property Owner",
      email: "owner@dallah.com",
      role: "owner",
      company: "Dallah Home",
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
  }

  document.getElementById("ownerName").textContent = currentUser.name

  // Populate profile form
  if (document.getElementById("profileName")) {
    document.getElementById("profileName").value = currentUser.name || ""
    document.getElementById("profileEmail").value = currentUser.email || ""
    document.getElementById("profilePhone").value = currentUser.phone || ""
    document.getElementById("profileCompany").value = currentUser.company || "Dallah Home"
  }
}

// Logout
document.getElementById("ownerLogout")?.addEventListener("click", (e) => {
  e.preventDefault()
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser")
    window.location.href = "login.html"
  }
})

// Load data from localStorage
function loadData() {
  try {
    properties = JSON.parse(localStorage.getItem("properties")) || []
    tenants = JSON.parse(localStorage.getItem("tenants")) || []
    receipts = JSON.parse(localStorage.getItem("receipts")) || []
  } catch (e) {
    console.error("[v0] Error loading data:", e)
    properties = []
    tenants = []
    receipts = []
  }

  console.log("[v0] Loaded data:", {
    properties: properties.length,
    tenants: tenants.length,
    receipts: receipts.length,
  })
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("properties", JSON.stringify(properties))
  localStorage.setItem("tenants", JSON.stringify(tenants))
  localStorage.setItem("receipts", JSON.stringify(receipts))
  console.log("[v0] Data saved")
}

// Section navigation
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none"
  })

  // Show selected section
  const section = document.getElementById(sectionName + "-section")
  if (section) {
    section.style.display = "block"
    section.classList.add("animate__animated", "animate__fadeIn")
  }

  // Update active nav link
  document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  event.target.closest(".nav-link")?.classList.add("active")

  // Load section-specific data
  switch (sectionName) {
    case "properties":
      loadProperties()
      break
    case "tenants":
      loadTenants()
      break
    case "financial":
      updateFinancialCharts()
      break
    case "receipts":
      loadReceipts()
      break
    case "map":
      setTimeout(() => initMap(), 100)
      break
  }
}

// Update dashboard statistics
function updateDashboard() {
  const totalProps = properties.length
  const rentedProps = properties.filter((p) => p.status === "rented").length
  const soldProps = properties.filter((p) => p.status === "sold").length

  const renters = tenants.filter((t) => t.type === "renter")
  const monthlyRevenue = renters.reduce((sum, t) => sum + (Number.parseFloat(t.rent) || 0), 0)

  document.getElementById("totalProperties").textContent = totalProps
  document.getElementById("rentedUnits").textContent = rentedProps
  document.getElementById("soldProperties").textContent = soldProps
  document.getElementById("monthlyRevenue").textContent = "$" + monthlyRevenue.toLocaleString()

  // Update notifications
  const notifications = []
  tenants.forEach((t) => {
    if (t.type === "renter" && t.leaseEnd) {
      const daysUntilExpiry = Math.floor((new Date(t.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        notifications.push(`Lease expiring in ${daysUntilExpiry} days for ${t.name}`)
      }
    }
  })

  document.getElementById("notificationCount").textContent = notifications.length

  console.log("[v0] Dashboard updated")
}

// Property Management
function showAddPropertyModal() {
  document.getElementById("propertyModalTitle").textContent = "Add New Property"
  document.getElementById("propertyForm").reset()
  document.getElementById("propertyId").value = ""
  document.getElementById("imagePreviewContainer").innerHTML = ""
  propertyImages = []
  currentPropertyId = null

  const modal = new bootstrap.Modal(document.getElementById("propertyModal"))
  modal.show()
}

function previewImages(event) {
  const files = event.target.files
  const container = document.getElementById("imagePreviewContainer")
  container.innerHTML = ""
  propertyImages = []

  Array.from(files).forEach((file, index) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      propertyImages.push(e.target.result)

      const preview = document.createElement("div")
      preview.className = "image-preview"
      preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-image" onclick="removeImage(${index})">
                    <i class="bi bi-x"></i>
                </button>
            `
      container.appendChild(preview)
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(index) {
  propertyImages.splice(index, 1)
  const container = document.getElementById("imagePreviewContainer")
  container.children[index]?.remove()
}

function saveProperty() {
  const form = document.getElementById("propertyForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const propertyId = document.getElementById("propertyId").value
  const property = {
    id: propertyId || "prop_" + Date.now(),
    name: document.getElementById("propertyName").value,
    type: document.getElementById("propertyType").value,
    address: document.getElementById("propertyAddress").value,
    city: document.getElementById("propertyCity").value,
    bedrooms: document.getElementById("propertyBedrooms").value,
    bathrooms: document.getElementById("propertyBathrooms").value,
    area: document.getElementById("propertyArea").value,
    price: Number.parseFloat(document.getElementById("propertyPrice").value),
    status: document.getElementById("propertyStatus").value,
    description: document.getElementById("propertyDescription").value,
    amenities: document.getElementById("propertyAmenities").value,
    lat: Number.parseFloat(document.getElementById("propertyLat").value) || null,
    lng: Number.parseFloat(document.getElementById("propertyLng").value) || null,
    images: propertyImages.length > 0 ? propertyImages : ["/cozy-suburban-house.png"],
    ownerId: currentUser.id,
    createdAt: propertyId ? properties.find((p) => p.id === propertyId)?.createdAt : new Date().toISOString(),
  }

  if (propertyId) {
    // Update existing property
    const index = properties.findIndex((p) => p.id === propertyId)
    if (index !== -1) {
      properties[index] = property
    }
  } else {
    // Add new property
    properties.push(property)
  }

  saveData()
  loadProperties()
  updateDashboard()

  bootstrap.Modal.getInstance(document.getElementById("propertyModal")).hide()

  showToast("Success", "Property saved successfully!", "success")
}

function loadProperties() {
  const grid = document.getElementById("propertiesGrid")
  grid.innerHTML = ""

  const filteredProperties = filterPropertiesData()

  if (filteredProperties.length === 0) {
    grid.innerHTML =
      '<div class="col-12"><div class="alert alert-info">No properties found. Add your first property!</div></div>'
    return
  }

  filteredProperties.forEach((property) => {
    const statusBadge =
      {
        available: "bg-success",
        rented: "bg-warning",
        sold: "bg-danger",
      }[property.status] || "bg-secondary"

    const card = document.createElement("div")
    card.className = "col-md-4 fade-in"
    card.innerHTML = `
            <div class="card property-card">
                <div style="position: relative;">
                    <img src="${property.images[0]}" class="card-img-top" alt="${property.name}">
                    <span class="badge ${statusBadge} property-badge">${property.status.toUpperCase()}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${property.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${property.city}
                    </p>
                    <p class="card-text text-truncate">${property.description || "No description"}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${property.type}</span>
                        <strong class="text-primary">$${property.price.toLocaleString()}</strong>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary flex-fill" onclick="viewProperty('${property.id}')">
                            <i class="bi bi-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-secondary flex-fill" onclick="editProperty('${property.id}')">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProperty('${property.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
    grid.appendChild(card)
  })
}

function filterPropertiesData() {
  const statusFilter = document.getElementById("statusFilter")?.value || ""
  const typeFilter = document.getElementById("typeFilter")?.value || ""
  const searchTerm = document.getElementById("searchProperty")?.value.toLowerCase() || ""

  return properties.filter((property) => {
    const matchesStatus = !statusFilter || property.status === statusFilter
    const matchesType = !typeFilter || property.type === typeFilter
    const matchesSearch =
      !searchTerm ||
      property.name.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm)

    return matchesStatus && matchesType && matchesSearch
  })
}

function filterProperties() {
  loadProperties()
}

function viewProperty(propertyId) {
  const property = properties.find((p) => p.id === propertyId)
  if (!property) return

  currentPropertyId = propertyId

  const amenitiesList = property.amenities
    ? property.amenities
        .split(",")
        .map((a) => `<span class="badge bg-light text-dark me-1">${a.trim()}</span>`)
        .join("")
    : '<span class="text-muted">No amenities listed</span>'

  const imagesGallery = property.images
    .map(
      (img) =>
        `<div class="gallery-item"><img src="${img}" alt="${property.name}" onclick="openImageModal('${img}')"></div>`,
    )
    .join("")

  const content = `
        <div class="row">
            <div class="col-md-8">
                <div class="gallery-grid">
                    ${imagesGallery}
                </div>
                <h4 class="mt-4">Description</h4>
                <p>${property.description || "No description available"}</p>
                
                <h4 class="mt-4">Amenities</h4>
                <div>${amenitiesList}</div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5>${property.name}</h5>
                        <p class="text-muted"><i class="bi bi-geo-alt"></i> ${property.address}, ${property.city}</p>
                        <hr>
                        <div class="mb-2"><strong>Type:</strong> ${property.type}</div>
                        <div class="mb-2"><strong>Price:</strong> $${property.price.toLocaleString()}</div>
                        <div class="mb-2"><strong>Status:</strong> <span class="badge bg-${property.status === "available" ? "success" : property.status === "rented" ? "warning" : "danger"}">${property.status}</span></div>
                        ${property.bedrooms ? `<div class="mb-2"><strong>Bedrooms:</strong> ${property.bedrooms}</div>` : ""}
                        ${property.bathrooms ? `<div class="mb-2"><strong>Bathrooms:</strong> ${property.bathrooms}</div>` : ""}
                        ${property.area ? `<div class="mb-2"><strong>Area:</strong> ${property.area} sq ft</div>` : ""}
                    </div>
                </div>
            </div>
        </div>
    `

  document.getElementById("propertyDetailsContent").innerHTML = content
  document.getElementById("propertyDetailsTitle").textContent = property.name

  const modal = new bootstrap.Modal(document.getElementById("propertyDetailsModal"))
  modal.show()
}

function editProperty(propertyId) {
  const property = properties.find((p) => p.id === propertyId)
  if (!property) return

  currentPropertyId = propertyId

  document.getElementById("propertyModalTitle").textContent = "Edit Property"
  document.getElementById("propertyId").value = property.id
  document.getElementById("propertyName").value = property.name
  document.getElementById("propertyType").value = property.type
  document.getElementById("propertyAddress").value = property.address
  document.getElementById("propertyCity").value = property.city
  document.getElementById("propertyBedrooms").value = property.bedrooms || ""
  document.getElementById("propertyBathrooms").value = property.bathrooms || ""
  document.getElementById("propertyArea").value = property.area || ""
  document.getElementById("propertyPrice").value = property.price
  document.getElementById("propertyStatus").value = property.status
  document.getElementById("propertyDescription").value = property.description || ""
  document.getElementById("propertyAmenities").value = property.amenities || ""
  document.getElementById("propertyLat").value = property.lat || ""
  document.getElementById("propertyLng").value = property.lng || ""

  // Load existing images
  propertyImages = property.images || []
  const container = document.getElementById("imagePreviewContainer")
  container.innerHTML = ""
  propertyImages.forEach((img, index) => {
    const preview = document.createElement("div")
    preview.className = "image-preview"
    preview.innerHTML = `
            <img src="${img}" alt="Preview">
            <button type="button" class="remove-image" onclick="removeImage(${index})">
                <i class="bi bi-x"></i>
            </button>
        `
    container.appendChild(preview)
  })

  const modal = new bootstrap.Modal(document.getElementById("propertyModal"))
  modal.show()
}

function editPropertyFromDetails() {
  if (currentPropertyId) {
    bootstrap.Modal.getInstance(document.getElementById("propertyDetailsModal")).hide()
    setTimeout(() => editProperty(currentPropertyId), 300)
  }
}

function deleteProperty(propertyId) {
  if (!confirm("Are you sure you want to delete this property?")) return

  properties = properties.filter((p) => p.id !== propertyId)
  saveData()
  loadProperties()
  updateDashboard()

  showToast("Success", "Property deleted successfully!", "success")
}

// Tenant Management
function showAddTenantModal() {
  document.getElementById("tenantForm").reset()

  // Populate property dropdown
  const propertySelect = document.getElementById("tenantProperty")
  propertySelect.innerHTML = '<option value="">Select Property</option>'
  properties.forEach((property) => {
    propertySelect.innerHTML += `<option value="${property.id}">${property.name} - ${property.city}</option>`
  })

  toggleTenantFields()

  const modal = new bootstrap.Modal(document.getElementById("tenantModal"))
  modal.show()
}

function toggleTenantFields() {
  const type = document.getElementById("tenantType").value
  const renterFields = document.getElementById("renterFields")
  const buyerFields = document.getElementById("buyerFields")

  if (type === "renter") {
    renterFields.style.display = "block"
    buyerFields.style.display = "none"
  } else {
    renterFields.style.display = "none"
    buyerFields.style.display = "block"
  }
}

function saveTenant() {
  const form = document.getElementById("tenantForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const type = document.getElementById("tenantType").value
  const tenant = {
    id: "tenant_" + Date.now(),
    type: type,
    name: document.getElementById("tenantName").value,
    email: document.getElementById("tenantEmail").value,
    phone: document.getElementById("tenantPhone").value,
    propertyId: document.getElementById("tenantProperty").value,
    ownerId: currentUser.id,
    createdAt: new Date().toISOString(),
  }

  if (type === "renter") {
    tenant.unit = document.getElementById("tenantUnit").value
    tenant.leaseStart = document.getElementById("leaseStart").value
    tenant.leaseEnd = document.getElementById("leaseEnd").value
    tenant.rent = Number.parseFloat(document.getElementById("tenantRent").value)
  } else {
    tenant.purchaseDate = document.getElementById("purchaseDate").value
    tenant.purchasePrice = Number.parseFloat(document.getElementById("purchasePrice").value)
    tenant.paymentStatus = document.getElementById("paymentStatus").value
  }

  tenants.push(tenant)
  saveData()
  loadTenants()
  updateDashboard()

  bootstrap.Modal.getInstance(document.getElementById("tenantModal")).hide()

  showToast("Success", "Tenant/Buyer added successfully!", "success")
}

function loadTenants() {
  loadRenters()
  loadBuyers()
}

function loadRenters() {
  const table = document.getElementById("rentersTable")
  table.innerHTML = ""

  const renters = tenants.filter((t) => t.type === "renter")

  if (renters.length === 0) {
    table.innerHTML = '<tr><td colspan="8" class="text-center">No renters found</td></tr>'
    return
  }

  renters.forEach((renter) => {
    const property = properties.find((p) => p.id === renter.propertyId)
    const propertyName = property ? property.name : "Unknown"

    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${renter.name}</td>
            <td>${propertyName}</td>
            <td>${renter.unit || "N/A"}</td>
            <td>${new Date(renter.leaseStart).toLocaleDateString()}</td>
            <td>${new Date(renter.leaseEnd).toLocaleDateString()}</td>
            <td>$${renter.rent.toLocaleString()}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="generateReceiptForTenant('${renter.id}')">
                    <i class="bi bi-receipt"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTenant('${renter.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `
    table.appendChild(row)
  })
}

function loadBuyers() {
  const table = document.getElementById("buyersTable")
  table.innerHTML = ""

  const buyers = tenants.filter((t) => t.type === "buyer")

  if (buyers.length === 0) {
    table.innerHTML = '<tr><td colspan="6" class="text-center">No buyers found</td></tr>'
    return
  }

  buyers.forEach((buyer) => {
    const property = properties.find((p) => p.id === buyer.propertyId)
    const propertyName = property ? property.name : "Unknown"

    const statusBadge =
      {
        paid: "bg-success",
        partial: "bg-warning",
        pending: "bg-danger",
      }[buyer.paymentStatus] || "bg-secondary"

    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${buyer.name}</td>
            <td>${propertyName}</td>
            <td>${new Date(buyer.purchaseDate).toLocaleDateString()}</td>
            <td>$${buyer.purchasePrice.toLocaleString()}</td>
            <td><span class="badge ${statusBadge}">${buyer.paymentStatus.toUpperCase()}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="generateReceiptForTenant('${buyer.id}')">
                    <i class="bi bi-receipt"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTenant('${buyer.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `
    table.appendChild(row)
  })
}

function deleteTenant(tenantId) {
  if (!confirm("Are you sure you want to delete this tenant/buyer?")) return

  tenants = tenants.filter((t) => t.id !== tenantId)
  saveData()
  loadTenants()
  updateDashboard()

  showToast("Success", "Tenant/Buyer deleted successfully!", "success")
}

// Financial Charts
function initializeCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById("revenueChart")
  if (revenueCtx) {
    revenueChart = new window.Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Revenue",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: "rgb(39, 174, 96)",
            backgroundColor: "rgba(39, 174, 96, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Expenses",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: "rgb(231, 76, 60)",
            backgroundColor: "rgba(231, 76, 60, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
        },
      },
    })
  }

  // Expense Chart
  const expenseCtx = document.getElementById("expenseChart")
  if (expenseCtx) {
    expenseChart = new window.Chart(expenseCtx, {
      type: "doughnut",
      data: {
        labels: ["Maintenance", "Utilities", "Taxes", "Insurance", "Other"],
        datasets: [
          {
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              "rgb(52, 152, 219)",
              "rgb(46, 204, 113)",
              "rgb(155, 89, 182)",
              "rgb(241, 196, 15)",
              "rgb(231, 76, 60)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
        },
      },
    })
  }
}

function updateFinancialCharts() {
  // Calculate revenue and expenses
  const renters = tenants.filter((t) => t.type === "renter")
  const monthlyRevenue = renters.reduce((sum, t) => sum + (Number.parseFloat(t.rent) || 0), 0)
  const yearlyRevenue = monthlyRevenue * 12

  // Simulate monthly data with some variation
  const revenueData = Array(12)
    .fill(0)
    .map((_, i) => {
      const variation = (Math.random() - 0.5) * 0.2
      return Math.round(monthlyRevenue * (1 + variation))
    })

  // Simulate expenses (roughly 30% of revenue)
  const expenseData = revenueData.map((r) => Math.round(r * 0.3))

  // Update revenue chart
  if (revenueChart) {
    revenueChart.data.datasets[0].data = revenueData
    revenueChart.data.datasets[1].data = expenseData
    revenueChart.update("active")
  }

  // Calculate expense breakdown
  const totalExpenses = expenseData.reduce((a, b) => a + b, 0)
  const expenseBreakdown = [
    Math.round(totalExpenses * 0.35), // Maintenance
    Math.round(totalExpenses * 0.25), // Utilities
    Math.round(totalExpenses * 0.2), // Taxes
    Math.round(totalExpenses * 0.15), // Insurance
    Math.round(totalExpenses * 0.05), // Other
  ]

  // Update expense chart
  if (expenseChart) {
    expenseChart.data.datasets[0].data = expenseBreakdown
    expenseChart.update("active")
  }

  // Update financial summary
  const totalRev = revenueData.reduce((a, b) => a + b, 0)
  const totalExp = expenseData.reduce((a, b) => a + b, 0)
  const netProfit = totalRev - totalExp
  const profitMargin = totalRev > 0 ? ((netProfit / totalRev) * 100).toFixed(1) : 0

  document.getElementById("totalRevenue").textContent = "$" + totalRev.toLocaleString()
  document.getElementById("totalExpenses").textContent = "$" + totalExp.toLocaleString()
  document.getElementById("netProfit").textContent = "$" + netProfit.toLocaleString()
  document.getElementById("profitMargin").textContent = profitMargin + "% profit margin"
  document.getElementById("revenueChange").textContent = "+12% from last year"
}

// Receipt Management
function showGenerateReceiptModal() {
  document.getElementById("receiptForm").reset()
  document.getElementById("receiptPreview").style.display = "none"

  // Populate tenant dropdown
  const tenantSelect = document.getElementById("receiptTenant")
  tenantSelect.innerHTML = '<option value="">Select...</option>'
  tenants.forEach((tenant) => {
    const property = properties.find((p) => p.id === tenant.propertyId)
    const propertyName = property ? property.name : "Unknown"
    tenantSelect.innerHTML += `<option value="${tenant.id}">${tenant.name} - ${propertyName} (${tenant.type})</option>`
  })

  const modal = new bootstrap.Modal(document.getElementById("receiptModal"))
  modal.show()
}

function generateReceiptForTenant(tenantId) {
  showGenerateReceiptModal()
  document.getElementById("receiptTenant").value = tenantId
  loadTenantDetails()
}

function loadTenantDetails() {
  const tenantId = document.getElementById("receiptTenant").value
  if (!tenantId) return

  const tenant = tenants.find((t) => t.id === tenantId)
  if (!tenant) return

  if (tenant.type === "renter") {
    document.getElementById("receiptAmount").value = tenant.rent
    document.getElementById("receiptType").value = "rent"
  } else {
    document.getElementById("receiptAmount").value = tenant.purchasePrice
    document.getElementById("receiptType").value = "purchase"
  }
}

function generateReceipt() {
  const form = document.getElementById("receiptForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const tenantId = document.getElementById("receiptTenant").value
  const tenant = tenants.find((t) => t.id === tenantId)
  const property = properties.find((p) => p.id === tenant.propertyId)

  const receipt = {
    id: "REC-" + Date.now(),
    tenantId: tenantId,
    tenantName: tenant.name,
    propertyName: property.name,
    type: document.getElementById("receiptType").value,
    amount: Number.parseFloat(document.getElementById("receiptAmount").value),
    paymentMethod: document.getElementById("receiptPaymentMethod").value,
    notes: document.getElementById("receiptNotes").value,
    date: new Date().toISOString(),
    ownerId: currentUser.id,
  }

  receipts.push(receipt)
  saveData()

  // Generate receipt preview
  const receiptContent = `
        <div style="max-width: 800px; margin: 0 auto;">
            <div class="text-center mb-4">
                <h2 style="color: #2c3e50; font-weight: bold;">DALLAH HOME</h2>
                <p class="text-muted">Property Management Services</p>
                <hr>
            </div>
            
            <div class="receipt-stamp">
                <div class="stamp-text">
                    <div style="font-size: 18px;">DALLAH</div>
                    <div style="font-size: 14px;">HOME</div>
                    <div style="font-size: 10px; margin-top: 5px;">OFFICIAL</div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-6">
                    <strong>Receipt #:</strong> ${receipt.id}<br>
                    <strong>Date:</strong> ${new Date(receipt.date).toLocaleDateString()}<br>
                    <strong>Payment Method:</strong> ${receipt.paymentMethod.toUpperCase()}
                </div>
                <div class="col-6 text-end">
                    <strong>Issued By:</strong><br>
                    ${currentUser.name}<br>
                    ${currentUser.company || "Dallah Home"}<br>
                    ${currentUser.email}
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">Payment Details</h5>
                    <table class="table">
                        <tr>
                            <td><strong>Tenant/Buyer:</strong></td>
                            <td>${receipt.tenantName}</td>
                        </tr>
                        <tr>
                            <td><strong>Property:</strong></td>
                            <td>${receipt.propertyName}</td>
                        </tr>
                        <tr>
                            <td><strong>Payment Type:</strong></td>
                            <td>${receipt.type.toUpperCase()}</td>
                        </tr>
                        ${receipt.notes ? `<tr><td><strong>Notes:</strong></td><td>${receipt.notes}</td></tr>` : ""}
                    </table>
                </div>
            </div>
            
            <div class="card bg-light">
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <h4>Total Amount Paid:</h4>
                        </div>
                        <div class="col-6 text-end">
                            <h3 class="text-success">$${receipt.amount.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <p class="text-muted"><small>This is an official receipt from Dallah Home. For any queries, please contact us.</small></p>
                <p class="text-muted"><small>Thank you for your business!</small></p>
            </div>
        </div>
    `

  document.getElementById("receiptContent").innerHTML = receiptContent
  document.getElementById("receiptPreview").style.display = "block"

  showToast("Success", "Receipt generated successfully!", "success")
}

function printReceipt() {
  const content = document.getElementById("receiptContent").innerHTML
  const printWindow = window.open("", "", "height=600,width=800")
  printWindow.document.write("<html><head><title>Receipt</title>")
  printWindow.document.write(
    '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">',
  )
  printWindow.document.write(
    "<style>.receipt-stamp { width: 150px; height: 150px; border: 3px solid #e74c3c; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-15deg); opacity: 0.7; position: absolute; right: 50px; top: 50px; } .receipt-stamp .stamp-text { font-weight: bold; color: #e74c3c; text-align: center; line-height: 1.2; }</style>",
  )
  printWindow.document.write("</head><body>")
  printWindow.document.write(content)
  printWindow.document.write("</body></html>")
  printWindow.document.close()
  printWindow.print()
}

function downloadReceipt() {
  showToast("Info", "PDF download feature requires backend integration", "info")
}

function loadReceipts() {
  const table = document.getElementById("receiptsTable")
  table.innerHTML = ""

  if (receipts.length === 0) {
    table.innerHTML = '<tr><td colspan="7" class="text-center">No receipts found</td></tr>'
    return
  }

  receipts.forEach((receipt) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${receipt.id}</td>
            <td>${receipt.tenantName}</td>
            <td>${receipt.propertyName}</td>
            <td>$${receipt.amount.toLocaleString()}</td>
            <td>${new Date(receipt.date).toLocaleDateString()}</td>
            <td><span class="badge bg-primary">${receipt.type.toUpperCase()}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewReceipt('${receipt.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="printReceiptById('${receipt.id}')">
                    <i class="bi bi-printer"></i>
                </button>
            </td>
        `
    table.appendChild(row)
  })
}

function viewReceipt(receiptId) {
  const receipt = receipts.find((r) => r.id === receiptId)
  if (!receipt) return

  // Populate form and generate preview
  document.getElementById("receiptTenant").value = receipt.tenantId
  document.getElementById("receiptType").value = receipt.type
  document.getElementById("receiptAmount").value = receipt.amount
  document.getElementById("receiptPaymentMethod").value = receipt.paymentMethod
  document.getElementById("receiptNotes").value = receipt.notes || ""

  generateReceipt()

  const modal = new bootstrap.Modal(document.getElementById("receiptModal"))
  modal.show()
}

function printReceiptById(receiptId) {
  viewReceipt(receiptId)
  setTimeout(() => printReceipt(), 500)
}

// Map functionality
let mapInitialized = false

function initMap() {
  if (mapInitialized || !google) {
    console.log("[v0] Map already initialized or Google Maps not loaded")
    return
  }

  const mapElement = document.getElementById("map")
  if (!mapElement) return

  // Default center (you can change this)
  const defaultCenter = { lat: 40.7128, lng: -74.006 } // New York

  map = new google.maps.Map(mapElement, {
    zoom: 12,
    center: defaultCenter,
    mapTypeId: "roadmap",
  })

  // Add markers for properties
  properties.forEach((property) => {
    if (property.lat && property.lng) {
      const marker = new google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map: map,
        title: property.name,
        animation: google.maps.Animation.DROP,
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
                    <div style="padding: 10px;">
                        <h6>${property.name}</h6>
                        <p class="mb-1">${property.address}</p>
                        <p class="mb-1"><strong>$${property.price.toLocaleString()}</strong></p>
                        <span class="badge bg-${property.status === "available" ? "success" : property.status === "rented" ? "warning" : "danger"}">${property.status}</span>
                    </div>
                `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })

      markers.push(marker)
    }
  })

  // Center map on markers if any exist
  if (markers.length > 0) {
    const bounds = new google.maps.LatLngBounds()
    markers.forEach((marker) => bounds.extend(marker.getPosition()))
    map.fitBounds(bounds)
  }

  mapInitialized = true
  console.log("[v0] Map initialized with", markers.length, "markers")
}

function centerMap() {
  if (map && markers.length > 0) {
    const bounds = new google.maps.LatLngBounds()
    markers.forEach((marker) => bounds.extend(marker.getPosition()))
    map.fitBounds(bounds)
  }
}

function toggleMapType() {
  if (map) {
    const currentType = map.getMapTypeId()
    map.setMapTypeId(currentType === "roadmap" ? "satellite" : "roadmap")
  }
}

// Utility functions
function showToast(title, message, type = "info") {
  // Simple alert for now - can be replaced with a toast library
  alert(`${title}: ${message}`)
}

function exportFinancialReport() {
  showToast("Info", "Export feature requires backend integration", "info")
}

// Profile form submission
document.getElementById("profileForm")?.addEventListener("submit", (e) => {
  e.preventDefault()

  currentUser.name = document.getElementById("profileName").value
  currentUser.email = document.getElementById("profileEmail").value
  currentUser.phone = document.getElementById("profilePhone").value
  currentUser.company = document.getElementById("profileCompany").value

  localStorage.setItem("currentUser", JSON.stringify(currentUser))
  document.getElementById("ownerName").textContent = currentUser.name

  showToast("Success", "Profile updated successfully!", "success")
})

// Initialize Google Maps callback
window.initMap = initMap

console.log("[v0] App.js loaded successfully")
