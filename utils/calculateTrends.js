// Trend percent = ((current - previous) / previous) * 100
const trendPercent = (current, previous) => {
  if (!previous || previous === 0) return 0;
  const percentage = ((current - previous) / previous) * 100;
  return Math.round(percentage);
};

module.exports = { trendPercent };
