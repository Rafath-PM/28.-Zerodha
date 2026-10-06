// ==========================================================================
// IPO Database (May 2023 - May 2026)
// ==========================================================================

let ipoData = [];

const fallbackIpoData = [
  {
    id: "tata-tech",
    name: "Tata Technologies Ltd",
    symbol: "TATATECH",
    listingDate: "2023-11-30",
    issuePrice: 500,
    listingPrice: 1200,
    currentPrice: 1020,
    sector: "Technology / ER&D",
    description: "Tata Technologies is a global engineering services company that provides product development and digital transformation solutions to the automotive, aerospace, and heavy machinery industries."
  },
  {
    id: "ireda",
    name: "Indian Renewable Energy Development Agency (IREDA)",
    symbol: "IREDA",
    listingDate: "2023-11-29",
    issuePrice: 32,
    listingPrice: 50,
    currentPrice: 215,
    sector: "Financial Services",
    description: "IREDA is a government-owned financial institution under the Ministry of New and Renewable Energy. It provides financial assistance, loans, and advisory services for projects promoting renewable sources of energy."
  },
  {
    id: "jsw-infra",
    name: "JSW Infrastructure Ltd",
    symbol: "JSWINFRA",
    listingDate: "2023-10-03",
    issuePrice: 119,
    listingPrice: 143,
    currentPrice: 310,
    sector: "Infrastructure / Ports",
    description: "JSW Infrastructure is one of India's fastest-growing private commercial port operators. It manages cargo handling, maritime transport logistics, and storage warehouses across strategic coastal locations."
  },
  {
    id: "honasa",
    name: "Honasa Consumer Ltd (Mamaearth)",
    symbol: "HONASA",
    listingDate: "2023-11-07",
    issuePrice: 324,
    listingPrice: 330,
    currentPrice: 410,
    sector: "Consumer Goods / Beauty",
    description: "Honasa Consumer is a digital-first, beauty and personal care house of brands, famously known for its flagship natural baby-care and personal care brand 'Mamaearth'."
  },
  {
    id: "cello-world",
    name: "Cello World Ltd",
    symbol: "CELLO",
    listingDate: "2023-11-06",
    issuePrice: 648,
    listingPrice: 829,
    currentPrice: 930,
    sector: "Consumer Goods / Houseware",
    description: "Cello World is a leading Indian consumer products company. It specializes in the manufacturing of writing instruments, plastic houseware, steel flasks, and glassware."
  },
  {
    id: "mankind",
    name: "Mankind Pharma Ltd",
    symbol: "MANKIND",
    listingDate: "2023-05-09",
    issuePrice: 1080,
    listingPrice: 1300,
    currentPrice: 2250,
    sector: "Healthcare / Pharmaceuticals",
    description: "Mankind Pharma develops, manufactures, and markets pharmaceutical formulations and consumer healthcare products. It owns popular household brands like Manforce and Prega News."
  },
  {
    id: "ola-electric",
    name: "Ola Electric Mobility Ltd",
    symbol: "OLAELEC",
    listingDate: "2024-08-09",
    issuePrice: 76,
    listingPrice: 76,
    currentPrice: 110,
    sector: "Automotive / EV",
    description: "Ola Electric is an electric vehicle manufacturer that builds EV two-wheelers, battery cell components, and charging grids. It owns the largest EV manufacturing plant in India."
  },
  {
    id: "bajaj-hfl",
    name: "Bajaj Housing Finance Ltd",
    symbol: "BAJAJHFL",
    listingDate: "2024-09-16",
    issuePrice: 70,
    listingPrice: 150,
    currentPrice: 135,
    sector: "Financial Services / Mortgages",
    description: "Bajaj Housing Finance is a leading non-banking financial company (NBFC) in India. It offers customized mortgage products, home loans, loans against property, and developer finance."
  },
  {
    id: "swiggy",
    name: "Swiggy Ltd",
    symbol: "SWIGGY",
    listingDate: "2024-11-13",
    issuePrice: 390,
    listingPrice: 412,
    currentPrice: 460,
    sector: "Technology / E-commerce",
    description: "Swiggy is a leading on-demand convenience platform. It offers food delivery, instant grocery delivery (Instamart), dining reservations, and parcel pick-and-drop services."
  },
  {
    id: "firstcry",
    name: "Brainbees Solutions Ltd (FirstCry)",
    symbol: "FIRSTCRY",
    listingDate: "2024-08-13",
    issuePrice: 465,
    listingPrice: 525,
    currentPrice: 580,
    sector: "Consumer Goods / Retail",
    description: "Brainbees Solutions operates FirstCry, India's largest multi-channel retail brand for maternal, baby, and kids' products. It hosts a network of physical stores, franchise hubs, and online shopping apps."
  },
  {
    id: "premier-energies",
    name: "Premier Energies Ltd",
    symbol: "PREMIERENE",
    listingDate: "2024-09-03",
    issuePrice: 450,
    listingPrice: 850,
    currentPrice: 1150,
    sector: "Energy / Solar",
    description: "Premier Energies is a solar cell and solar module manufacturer. It provides engineering, procurement, and construction (EPC) solutions for solar installations across India."
  },
  {
    id: "waaree-energies",
    name: "Waaree Energies Ltd",
    symbol: "WAAREE",
    listingDate: "2024-10-28",
    issuePrice: 1503,
    listingPrice: 2550,
    currentPrice: 2900,
    sector: "Energy / Solar",
    description: "Waaree Energies is India's largest manufacturer of solar modules. It supplies high-efficiency photovoltaic panels and provides clean energy power generation services."
  },
  {
    id: "afcons",
    name: "Afcons Infrastructure Ltd",
    symbol: "AFCONS",
    listingDate: "2024-11-04",
    issuePrice: 463,
    listingPrice: 426,
    currentPrice: 510,
    sector: "Infrastructure / Engineering",
    description: "Afcons Infrastructure is part of the Shapoorji Pallonji Group. It executes heavy engineering construction projects, including marine ports, metro systems, tunnels, and oil & gas facilities."
  },
  {
    id: "ntpc-green",
    name: "NTPC Green Energy Ltd",
    symbol: "NTPCGREEN",
    listingDate: "2024-11-27",
    issuePrice: 108,
    listingPrice: 111.5,
    currentPrice: 130,
    sector: "Energy / Renewables",
    description: "NTPC Green Energy is the renewable energy arm of India's largest power utility, NTPC. It focuses on the generation of power from solar, wind, and green hydrogen projects."
  },
  {
    id: "tata-capital",
    name: "Tata Capital Ltd",
    symbol: "TATACAPITAL",
    listingDate: "2025-10-13",
    issuePrice: 326,
    listingPrice: 330,
    currentPrice: 299.7,
    sector: "Financial Services",
    description: "Tata Capital is the financial services arm of the Tata Group. It offers a diversified portfolio of consumer loans, wealth management advice, corporate finance, and mutual funds distribution."
  },
  {
    id: "hdb-finance",
    name: "HDB Financial Services Ltd",
    symbol: "HDBFS",
    listingDate: "2025-07-02",
    issuePrice: 740,
    listingPrice: 835,
    currentPrice: 654.3,
    sector: "Financial Services",
    description: "HDB Financial Services is a high-volume non-banking financial company (NBFC) subsidiary of HDFC Bank. It provides commercial loans, asset finance, personal credits, and insurance products."
  },
  {
    id: "icici-pru-amc",
    name: "ICICI Prudential Asset Management Company",
    symbol: "ICICIAMC",
    listingDate: "2025-12-18",
    issuePrice: 2165,
    listingPrice: 2165,
    currentPrice: 3229.8,
    sector: "Financial Services / Mutual Funds",
    description: "ICICI Prudential AMC is a joint venture between ICICI Bank and Prudential plc. It is one of India's largest mutual fund operators, managing retail and portfolio asset classes."
  },
  {
    id: "onemi-tech",
    name: "OnEMI Technology Solutions Ltd (Kissht)",
    symbol: "KISSHT",
    listingDate: "2026-05-15",
    issuePrice: 171,
    listingPrice: 208.62,
    currentPrice: 231.74,
    sector: "Financial Services / FinTech",
    description: "OnEMI Technology operates 'Kissht', a prominent fintech platform providing instant credit loans, buy-now-pay-later (BNPL) schemes, and microfinance to self-employed and retail shoppers."
  }
];

// Helper to pre-calculate gains & returns
function processIpoData(data) {
  data.forEach(stock => {
    stock.listingGain = ((stock.listingPrice - stock.issuePrice) / stock.issuePrice) * 100;
    stock.currentReturn = ((stock.currentPrice - stock.issuePrice) / stock.issuePrice) * 100;
  });
}

// ==========================================================================
// Application Core Logic
// ==========================================================================

let activeFilter = "all";
let activeCategory = "all";
let activeSort = "date-desc";
let searchQuery = "";
let activeTab = "home";
let activeChart = null;

// Watchlist state backed by localStorage
let watchlist = JSON.parse(localStorage.getItem("ipo_watchlist") || "[]");

function saveWatchlist() {
  localStorage.setItem("ipo_watchlist", JSON.stringify(watchlist));
}

function toggleWatchlist(stockId, event) {
  if (event) event.stopPropagation();
  const idx = watchlist.indexOf(stockId);
  if (idx > -1) {
    watchlist.splice(idx, 1);
  } else {
    watchlist.push(stockId);
  }
  saveWatchlist();
  renderStocks();
  
  // Update detail drawer star icon if drawer is open
  const drawerBookmarkBtn = document.getElementById("drawer-bookmark-btn");
  if (drawerBookmarkBtn && drawerBookmarkBtn.getAttribute("data-stock-id") === stockId) {
    const isSaved = watchlist.includes(stockId);
    drawerBookmarkBtn.innerHTML = `<i class="${isSaved ? 'fas' : 'far'} fa-star"></i>`;
    drawerBookmarkBtn.classList.toggle("active", isSaved);
  }
}

// DOM Elements
const stocksListContainer = document.getElementById("stocks-list");
const stockCountEl = document.getElementById("stock-count");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const filterChips = document.querySelectorAll(".filter-chip");
const sortSelect = document.getElementById("sort-select");
const statusTimeEl = document.getElementById("status-time");

// Modal Drawer Elements
const drawerBackdrop = document.getElementById("drawer-backdrop");
const detailDrawer = document.getElementById("detail-drawer");
const drawerContent = document.getElementById("drawer-content");
const closeDrawerBtn = document.getElementById("close-drawer");

// Stats Dashboard Elements
const avgGainEl = document.getElementById("avg-gain");
const topPerfEl = document.getElementById("top-perf");
const lowPerfEl = document.getElementById("low-perf");

// Update clock helper
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  statusTimeEl.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Calculate Stats for Dashboard based on filtered list
function updateDashboardStats(data) {
  if (data.length === 0) {
    avgGainEl.textContent = "0.0%";
    topPerfEl.textContent = "N/A";
    lowPerfEl.textContent = "N/A";
    return;
  }
  
  // Avg Listing Gain
  const sumGain = data.reduce((acc, curr) => acc + curr.listingGain, 0);
  const avgGain = sumGain / data.length;
  avgGainEl.textContent = `${avgGain > 0 ? '+' : ''}${avgGain.toFixed(1)}%`;
  
  // Top Listing Performer
  const topStock = [...data].sort((a, b) => b.listingGain - a.listingGain)[0];
  topPerfEl.textContent = topStock.symbol;
  topPerfEl.className = `stat-value ${topStock.listingGain >= 0 ? 'text-green' : 'text-red'}`;
  document.querySelector(".top-performer .positive").textContent = `${topStock.listingGain > 0 ? '+' : ''}${topStock.listingGain.toFixed(0)}% Listing Gain`;
  
  // Underperformer (lowest current return)
  const lowStock = [...data].sort((a, b) => a.currentReturn - b.currentReturn)[0];
  lowPerfEl.textContent = lowStock.symbol;
  lowPerfEl.className = `stat-value ${lowStock.currentReturn >= 0 ? 'text-green' : 'text-red'}`;
  document.querySelector(".low-performer .negative").textContent = `${lowStock.currentReturn > 0 ? '+' : ''}${lowStock.currentReturn.toFixed(0)}% Current Return`;
}

// Render dynamic stock card list
function renderStocks() {
  // 1. Filter
  let filtered = ipoData.filter(stock => {
    // Search query match
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Year match
    const listingYear = new Date(stock.listingDate).getFullYear().toString();
    const matchesYear = activeFilter === "all" || listingYear === activeFilter;

    // Category match (listed vs unlisted)
    const matchesCategory = activeCategory === "all" || stock.status === activeCategory;

    // Watchlist tab match
    const matchesWatchlist = activeTab !== "watchlist" || watchlist.includes(stock.id);
    
    return matchesSearch && matchesYear && matchesCategory && matchesWatchlist;
  });

  // 2. Sort
  filtered.sort((a, b) => {
    switch (activeSort) {
      case "date-desc":
        return new Date(b.listingDate) - new Date(a.listingDate);
      case "date-asc":
        return new Date(a.listingDate) - new Date(b.listingDate);
      case "gain-desc":
        return b.listingGain - a.listingGain;
      case "gain-asc":
        return a.listingGain - b.listingGain;
      case "current-desc":
        return b.currentReturn - a.currentReturn;
      case "current-asc":
        return a.currentReturn - b.currentReturn;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Update Stock Count
  stockCountEl.textContent = filtered.length;

  // Clear container
  stocksListContainer.innerHTML = "";

  if (filtered.length === 0) {
    stocksListContainer.innerHTML = `
      <div class="loader" style="padding: 60px 20px; flex-direction: column;">
        <i class="fas ${activeTab === 'watchlist' ? 'fa-bookmark' : 'fa-search-minus'}" style="font-size: 2.2rem; margin-bottom: 12px; color: var(--text-muted);"></i>
        <p style="font-weight: 500;">${activeTab === 'watchlist' ? 'Your watchlist is empty.' : 'No IPO stocks matched your search.'}</p>
        <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">${activeTab === 'watchlist' ? 'Tap the star icon on any stock card to add it to your watchlist.' : 'Try a different keyword or year filter.'}</span>
      </div>
    `;
    return;
  }

  // Populate list
  filtered.forEach(stock => {
    const isGainListing = stock.listingGain >= 0;
    const isCurrentReturnPositive = stock.currentReturn >= 0;
    const isSaved = watchlist.includes(stock.id);
    const isUnlisted = stock.status === "unlisted";
    const isUpcoming = stock.status === "upcoming";
    
    const card = document.createElement("div");
    card.className = "stock-card";
    card.innerHTML = `
      <div class="stock-card-left">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="watchlist-star-btn ${isSaved ? 'active' : ''}" data-id="${stock.id}" title="${isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}">
            <i class="${isSaved ? 'fas' : 'far'} fa-star"></i>
          </button>
          <h4>${stock.name}</h4>
        </div>
        <span class="listing-date"><i class="far fa-calendar-alt"></i> ${isUpcoming ? 'Status:' : (isUnlisted ? 'Listing Expected:' : 'Listed:')} ${isUpcoming ? stock.listingDate : formatDate(stock.listingDate)}</span>
        <div class="price-row">
          ${isUpcoming ? `<span>Price Band: ${stock.priceBand || 'TBA'}</span> • <span>Size: ${stock.issueSize || 'TBA'}</span>` : `<span>Issue Price: ₹${stock.issuePrice}</span> ${!isUnlisted ? `• <span>List: ₹${stock.listingPrice} (<span class="${isGainListing ? 'text-green' : 'text-red'}" style="font-weight: 600;">${isGainListing ? '+' : ''}${stock.listingGain.toFixed(1)}%</span>)</span>` : ''}`}
        </div>
      </div>
      <div class="stock-card-right">
        ${isUpcoming ? `
          <span class="badge" style="background-color: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.3); color: #818cf8; font-size: 0.72rem; padding: 4px 10px;">
            <i class="fas fa-file-contract"></i> DRHP Filed
          </span>
        ` : (isUnlisted ? `
          <span class="badge" style="background-color: rgba(255, 193, 7, 0.12); border: 1px solid rgba(255, 193, 7, 0.3); color: #f59e0b; font-size: 0.72rem; padding: 4px 10px;">
            <i class="fas fa-clock"></i> Awaiting Listing
          </span>
        ` : `
          <span class="current-price">₹${stock.currentPrice.toFixed(1)}</span>
          <span class="badge ${isCurrentReturnPositive ? 'positive' : 'negative'}">
            <i class="fas ${isCurrentReturnPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
            ${isCurrentReturnPositive ? '+' : ''}${stock.currentReturn.toFixed(1)}%
          </span>
        `)}
      </div>
    `;
    
    // Add star click listener
    const starBtn = card.querySelector(".watchlist-star-btn");
    starBtn.addEventListener("click", (e) => toggleWatchlist(stock.id, e));

    // Add Click listener to open drawer
    card.addEventListener("click", () => openStockDetail(stock));
    stocksListContainer.appendChild(card);
  });
}

// Open Stock Detail Bottom Drawer
function openStockDetail(stock) {
  const isListingGainPos = stock.listingGain >= 0;
  const isCurrentReturnPos = stock.currentReturn >= 0;
  const isSaved = watchlist.includes(stock.id);
  
  // Calculate relative progress bar width
  const baselineMin = -60;
  const baselineMax = 150;
  const clampedReturn = Math.max(baselineMin, Math.min(baselineMax, stock.currentReturn));
  const progressPercent = ((clampedReturn - baselineMin) / (baselineMax - baselineMin)) * 100;

  drawerContent.innerHTML = `
    <div class="company-details-header">
      <div class="company-details-title" style="flex: 1;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <h3>${stock.name}</h3>
          <button id="drawer-bookmark-btn" class="watchlist-star-btn ${isSaved ? 'active' : ''}" data-stock-id="${stock.id}" style="font-size: 1.2rem; padding: 4px 8px;">
            <i class="${isSaved ? 'fas' : 'far'} fa-star"></i>
          </button>
        </div>
        <span class="sub-heading">${stock.symbol} • ${stock.sector}</span>
      </div>
      <div class="performance-pill-container">
        <span class="current-val">₹${stock.currentPrice.toFixed(1)}</span>
        <span class="badge ${isCurrentReturnPos ? 'positive' : 'negative'}">
          <i class="fas ${isCurrentReturnPos ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
          ${isCurrentReturnPos ? '+' : ''}${stock.currentReturn.toFixed(1)}% Return
        </span>
      </div>
    </div>

    <!-- Company Description -->
    <div class="drawer-desc-box">
      <h5>Business Overview</h5>
      <p class="drawer-desc-text">${stock.description}</p>
    </div>

    <!-- Buy Recommendation -->
    <div class="drawer-desc-box" style="margin-top: 15px;">
      <h5>Chittorgarh Author Recommendation</h5>
      <p class="drawer-desc-text" style="color: var(--accent-blue); font-weight: 600; font-size: 0.95rem; margin-bottom: 8px;">
        Author Rating: <span class="badge ${stock.authorRecommendation && stock.authorRecommendation.toLowerCase().includes('apply') ? 'positive' : 'negative'}" style="font-size: 0.85rem; padding: 4px 10px;">${stock.authorRecommendation || "Not Rated"}</span>
      </p>
      <p class="drawer-desc-text" style="color: var(--primary-color); font-weight: 500; font-size: 0.82rem;">
        ${stock.recommendation || "No recommendation data available on Chittorgarh."}
      </p>
    </div>

    <!-- Pricing Summary Table -->
    <div class="pricing-table-container">
      <h5>Pricing Summary</h5>
      <table class="pricing-table">
        <thead>
          <tr>
            <th>Metrics</th>
            <th class="right-align">Value (₹)</th>
            <th class="right-align">Return (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>IPO Offer Issue Price</td>
            <td class="right-align">₹${stock.issuePrice}</td>
            <td class="right-align">Benchmark</td>
          </tr>
          <tr>
            <td>Debut Listing Price</td>
            <td class="right-align">₹${stock.listingPrice}</td>
            <td class="right-align ${isListingGainPos ? 'text-green' : 'text-red'}">
              ${isListingGainPos ? '+' : ''}${stock.listingGain.toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td>Current Market Price</td>
            <td class="right-align">₹${stock.currentPrice.toFixed(1)}</td>
            <td class="right-align ${isCurrentReturnPos ? 'text-green' : 'text-red'}">
              ${isCurrentReturnPos ? '+' : ''}${stock.currentReturn.toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Price History Line Chart -->
    <div class="chart-container-group">
      <h5>Price Performance Chart</h5>
      <div class="chart-canvas-wrapper">
        <canvas id="stock-chart"></canvas>
      </div>
    </div>

    <!-- Visual Performance Gauge -->
    <div class="perf-metric-bar-group">
      <h5>Stock Performance Spectrum</h5>
      <div class="metric-bar-container">
        <div class="metric-bar-fill" style="width: ${progressPercent}%; background-color: ${isCurrentReturnPos ? 'var(--green-color)' : 'var(--red-color)'};"></div>
      </div>
      <div class="metric-bar-labels">
        <span>-60% Downside</span>
        <span style="color: var(--text-primary); font-weight: 600;">Issue Price (₹${stock.issuePrice})</span>
        <span>+150% Upside</span>
      </div>
    </div>
  `;

  // Add drawer star button click listener
  const drawerBookmarkBtn = document.getElementById("drawer-bookmark-btn");
  if (drawerBookmarkBtn) {
    drawerBookmarkBtn.addEventListener("click", (e) => toggleWatchlist(stock.id, e));
  }

  // Destroy previous chart if any
  if (activeChart) {
    activeChart.destroy();
    activeChart = null;
  }

  // Draw chart in the next animation frame after the drawer slide animation completes (350ms)
  setTimeout(() => {
    const canvas = document.getElementById('stock-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Generate simulated price timeline points (10 points from listingPrice to currentPrice)
    const pCount = 10;
    const dataPoints = [];
    const labels = [];
    
    const listDate = new Date(stock.listingDate);
    const today = new Date();
    
    // Calculate timeframe to show daily or monthly dates
    const timeSpanMs = today.getTime() - listDate.getTime();
    const isLongTerm = timeSpanMs > 365 * 24 * 60 * 60 * 1000; // More than 1 year
    
    for (let i = 0; i < pCount; i++) {
      const d = new Date(listDate.getTime() + (today.getTime() - listDate.getTime()) * (i / (pCount - 1)));
      if (isLongTerm) {
        labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }).replace(' ', '-'));
      } else {
        labels.push(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
      }
    }
    
    // Populate dataPoints starting at listingPrice and ending at currentPrice
    dataPoints.push(stock.listingPrice);
    const step = (stock.currentPrice - stock.listingPrice) / (pCount - 1);
    for (let i = 1; i < pCount - 1; i++) {
      const basePrice = stock.listingPrice + step * i;
      // Add realistic volatility (e.g. +/- 6% of the current base price)
      const volatilityRange = basePrice * 0.06;
      const randomOffset = (Math.random() - 0.5) * volatilityRange;
      dataPoints.push(Math.max(1, basePrice + randomOffset));
    }
    dataPoints.push(stock.currentPrice);
    
    const chartColor = isCurrentReturnPos ? '#00e676' : '#ff3b30';
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 150);
    gradientFill.addColorStop(0, isCurrentReturnPos ? 'rgba(0, 230, 118, 0.22)' : 'rgba(255, 59, 48, 0.22)');
    gradientFill.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Custom plugins for Chart.js
    const neonGlowPlugin = {
      id: 'neonGlow',
      beforeDatasetDraw(chart, args) {
        if (args.index === 0) {
          const ctx = chart.ctx;
          ctx.save();
          ctx.shadowColor = chartColor;
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
        }
      },
      afterDatasetDraw(chart, args) {
        if (args.index === 0) {
          chart.ctx.restore();
        }
      }
    };

    const issuePriceLinePlugin = {
      id: 'issuePriceLine',
      afterDraw(chart) {
        const yScale = chart.scales.y;
        const xScale = chart.scales.x;
        const yVal = yScale.getPixelForValue(stock.issuePrice);
        
        // Draw the reference line if it falls within the current y-axis bounds
        if (yVal >= yScale.top && yVal <= yScale.bottom) {
          const ctx = chart.ctx;
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.moveTo(xScale.left, yVal);
          ctx.lineTo(xScale.right, yVal);
          ctx.stroke();
          
          // Draw label above the reference line
          ctx.fillStyle = '#9ca3af';
          ctx.font = '500 10px "Inter", sans-serif';
          ctx.fillText('IPO Issue Price (₹' + stock.issuePrice + ')', xScale.left + 8, yVal - 6);
          ctx.restore();
        }
      }
    };

    // Calculate Y-axis scaling to guarantee issue price and chart values fit in view
    const allPrices = [stock.issuePrice, stock.listingPrice, stock.currentPrice, ...dataPoints];
    const minVal = Math.min(...allPrices);
    const maxVal = Math.max(...allPrices);
    const padding = (maxVal - minVal) * 0.1 || 10;
    const suggestedMin = Math.max(0, minVal - padding);
    const suggestedMax = maxVal + padding;
    
    activeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price',
          data: dataPoints,
          borderColor: chartColor,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: chartColor,
          fill: true,
          backgroundColor: gradientFill,
          tension: 0.35
        }]
      },
      plugins: [neonGlowPlugin, issuePriceLinePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1c2229',
            titleColor: '#9ca3af',
            bodyColor: '#f3f4f6',
            borderColor: '#242c35',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return '₹' + context.parsed.y.toFixed(1);
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#6b7280',
              font: { size: 9 },
              maxTicksLimit: 4
            }
          },
          y: {
            suggestedMin: suggestedMin,
            suggestedMax: suggestedMax,
            grid: {
              color: 'rgba(36, 44, 53, 0.3)'
            },
            ticks: {
              color: '#6b7280',
              font: { size: 9 },
              callback: function(value) {
                return '₹' + value;
              }
            }
          }
        }
      }
    });
  }, 350);

  // Display Drawer and Backdrop
  drawerBackdrop.classList.add("active");
  detailDrawer.classList.add("active");
}

function closeStockDetail() {
  drawerBackdrop.classList.remove("active");
  detailDrawer.classList.remove("active");
}

// Helpers
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
}

// ==========================================================================
// Event Listeners & Bootstrapping
// ==========================================================================

// Search Input Listener
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  if (searchQuery.length > 0) {
    clearSearchBtn.style.display = "block";
  } else {
    clearSearchBtn.style.display = "none";
  }
  renderStocks();
});

// Clear Search
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  clearSearchBtn.style.display = "none";
  renderStocks();
});

// Category Chips Selection
const categoryChips = document.querySelectorAll(".category-chip");
categoryChips.forEach(chip => {
  chip.addEventListener("click", (e) => {
    categoryChips.forEach(c => c.classList.remove("active"));
    e.target.classList.add("active");
    activeCategory = e.target.getAttribute("data-category");
    renderStocks();
  });
});

// Filter Chips Selection
filterChips.forEach(chip => {
  chip.addEventListener("click", (e) => {
    // Remove active class
    filterChips.forEach(c => c.classList.remove("active"));
    // Add to clicked
    e.target.classList.add("active");
    // Apply Filter
    activeFilter = e.target.getAttribute("data-filter");
    renderStocks();
  });
});

// Sort Selection
sortSelect.addEventListener("change", (e) => {
  activeSort = e.target.value;
  renderStocks();
});

// Bottom Navigation items interaction
const navItems = document.querySelectorAll(".bottom-nav .nav-item");
navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    navItems.forEach(n => n.classList.remove("active"));
    const target = e.currentTarget;
    target.classList.add("active");
    activeTab = target.getAttribute("data-nav") || "home";
    renderStocks();
  });
});

// Modal close handlers
closeDrawerBtn.addEventListener("click", closeStockDetail);
drawerBackdrop.addEventListener("click", closeStockDetail);

// Swipe down simulation for drawer (only close when scrolled to top)
let touchStart = 0;
const drawerHeader = document.querySelector(".drawer-header");

detailDrawer.addEventListener("touchstart", (e) => {
  touchStart = e.touches[0].clientY;
});

detailDrawer.addEventListener("touchmove", (e) => {
  let touchMove = e.touches[0].clientY;
  let diff = touchMove - touchStart;
  
  // Only trigger swipe-to-close if user is pulling down from top of scrollable content
  if (diff > 90 && drawerContent.scrollTop <= 0) { // swipe down threshold at top
    closeStockDetail();
  }
});

// Remote GitHub Pages dataset URL for live Over-The-Air updates
const LIVE_DATA_URL = "https://rafath-pm.github.io/28.-Zerodha/ipo_data.json?t=" + new Date().getTime();

// Initialize Application by fetching dynamic database (remote live URL with local fallback)
fetch(LIVE_DATA_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Loaded remote live IPO database with " + data.length + " stocks.");
    ipoData = data;
    processIpoData(ipoData);
    updateDashboardStats(ipoData);
    renderStocks();
  })
  .catch(error => {
    console.warn("Remote live fetch failed, trying local ipo_data.json. Error:", error);
    fetch("ipo_data.json?v=" + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        ipoData = data;
        processIpoData(ipoData);
        updateDashboardStats(ipoData);
        renderStocks();
      })
      .catch(() => {
        ipoData = fallbackIpoData;
        processIpoData(ipoData);
        updateDashboardStats(ipoData);
        renderStocks();
      });
  });

// Register Service Worker for PWA installation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}
