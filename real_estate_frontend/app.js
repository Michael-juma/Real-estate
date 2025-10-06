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
const bootstrap = window.bootstrap
const google = window.google

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
    image: `/placeholder.svg?height=200&width=300&query=${type} building`,
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
