const calculateSavingsPercent = (retailPrice, targetPrice) => {
  
  if (!retailPrice || retailPrice <= 0) return 0;
  const percentage = ((retailPrice - targetPrice) / retailPrice) * 100;
  return Math.max(0, Math.round(percentage))
};

module.exports = { calculateSavingsPercent };