// Inventory data
const inventoryItems = [
  {
    id: 1,
    name: "Product A",
    category: "Electronics",
    quantity: 150,
    price: 299.99,
    status: "In Stock",
    stockLevel: "optimal",
    prediction: "stable",
    lastUpdated: "2023-11-15",
  },
  {
    id: 2,
    name: "Product B",
    category: "Furniture",
    quantity: 45,
    price: 599.99,
    status: "Low Stock",
    stockLevel: "low",
    prediction: "understocked",
    lastUpdated: "2023-11-10",
  },
  {
    id: 3,
    name: "Product C",
    category: "Clothing",
    quantity: 200,
    price: 49.99,
    status: "In Stock",
    stockLevel: "optimal",
    prediction: "stable",
    lastUpdated: "2023-11-12",
  },
  {
    id: 4,
    name: "Product D",
    category: "Electronics",
    quantity: 75,
    price: 199.99,
    status: "In Stock",
    stockLevel: "optimal",
    prediction: "stable",
    lastUpdated: "2023-11-14",
  },
  {
    id: 5,
    name: "Product E",
    category: "Home Goods",
    quantity: 10,
    price: 129.99,
    status: "Low Stock",
    stockLevel: "low",
    prediction: "understocked",
    lastUpdated: "2023-11-08",
  },
  {
    id: 6,
    name: "Product F",
    category: "Clothing",
    quantity: 0,
    price: 79.99,
    status: "Out of Stock",
    stockLevel: "out",
    prediction: "understocked",
    lastUpdated: "2023-11-01",
  },
  {
    id: 7,
    name: "Product G",
    category: "Electronics",
    quantity: 350,
    price: 899.99,
    status: "In Stock",
    stockLevel: "high",
    prediction: "overstocked",
    lastUpdated: "2023-11-05",
  },
  {
    id: 8,
    name: "Product H",
    category: "Furniture",
    quantity: 5,
    price: 1299.99,
    status: "Low Stock",
    stockLevel: "low",
    prediction: "understocked",
    lastUpdated: "2023-11-03",
  }
];

// Function to render stock level indicator
function renderStockIndicator(level) {
  let color, text;
  switch (level) {
    case "high":
      color = "bg-blue-500";
      text = "High";
      break;
    case "optimal":
      color = "bg-green-500";
      text = "Optimal";
      break;
    case "low":
      color = "bg-yellow-500";
      text = "Low";
      break;
    case "out":
      color = "bg-red-500";
      text = "Out";
      break;
    default:
      return "";
  }
  return `<div class="flex items-center">
    <div class="w-3 h-3 rounded-full ${color} mr-2"></div>
    <span>${text}</span>
  </div>`;
}

// Function to render prediction badge
function renderPredictionBadge(prediction) {
  let bgColor, textColor, borderColor, icon;
  switch (prediction) {
    case "overstocked":
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      borderColor = "border-blue-200";
      icon = "exclamation-triangle";
      text = "Overstocked";
      break;
    case "stable":
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      borderColor = "border-green-200";
      icon = "check-circle";
      text = "Stable";
      break;
    case "understocked":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      borderColor = "border-red-200";
      icon = "times-circle";
      text = "Understocked";
      break;
    default:
      return "";
  }
  return `<span class="px-2 py-1 text-xs rounded-full ${bgColor} ${textColor} border ${borderColor}">
    <i class="fas fa-${icon} mr-1"></i> ${text}
  </span>`;
}

// Populate the inventory table
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('inventoryTable');
  
  inventoryItems.forEach(item => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${item.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">${item.category}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">${item.quantity}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">$${item.price.toFixed(2)}</td>
      <td class="px-6 py-4 whitespace-nowrap">${renderStockIndicator(item.stockLevel)}</td>
      <td class="px-6 py-4 whitespace-nowrap">${renderPredictionBadge(item.prediction)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">${item.lastUpdated}</td>
      <td class="px-6 py-4 whitespace-nowrap text-right">
        <div class="relative inline-block text-left">
          <button class="text-gray-400 hover:text-gray-600 focus:outline-none">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
});
