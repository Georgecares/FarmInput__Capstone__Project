// Simple seasonal forecast utility

/* formular
avgUsagePerHectare: { category: 'fertilizer', unit: 'bags', quantityPerHa: 2 } */
const forecastInputs = (farmSize, cropType, usageCatalog = []) => {
  const forecasts = usageCatalog.map((u) => ({
    crop: cropType,
    category: u.category,
    unit: u.unit,
    estimated_quantity: Math.round(farmSize * u.quantityPerHa),
    estimated_cost: null // to be filled with pricing data
  }));
  return forecasts;
};

module.exports = { forecastInputs };
