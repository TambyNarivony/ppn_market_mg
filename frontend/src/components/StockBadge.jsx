import React from 'react';

const StockBadge = ({ stock }) => {
  const getStockStatus = () => {
    if (stock > 10) return 'high';
    if (stock > 0 && stock <= 10) return 'medium';
    return 'low';
  };

  const status = getStockStatus();
  const statusText = {
    high: 'En stock',
    medium: `Stock faible (${stock})`,
    low: 'Rupture'
  }[status];

  return (
    <span className={`stock-badge stock-${status}`}>
      {statusText}
    </span>
  );
};

export default StockBadge;