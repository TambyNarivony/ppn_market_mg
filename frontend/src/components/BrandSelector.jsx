
import React, { useState } from 'react';
import StockBadge from './StockBadge';

const BrandSelector = ({ brands = [], onSelect, selectedBrand }) => {
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);

  const handleBrandSelect = (brand) => {
    onSelect(brand);
    setShowBrandsDropdown(false);
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-semibold mb-3">
        <i className="bi bi-tags me-2 text-primary"></i>
        Marques disponibles
      </label>
      
      {brands.length > 0 ? (
        <div className="dropdown position-relative">
          <button
            className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center justify-content-between w-100 py-3"
            type="button"
            onClick={() => setShowBrandsDropdown(!showBrandsDropdown)}
            style={{ 
              borderRadius: '8px',
              border: '2px solid #28a745',
              backgroundColor: 'rgba(12, 114, 36, 0.38)'
            }}
          >
            <span className="fw-medium">
              {selectedBrand 
                ? `${selectedBrand.brand} `
                : 'Sélectionner une marque'
              }
            </span>
            <i className={`bi bi-chevron-${showBrandsDropdown ? 'up' : 'down'}`}></i>
          </button>
          
          {showBrandsDropdown && (
            <div 
              className="position-absolute w-100 mt-1" 
              style={{ 
                zIndex: 1050,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {brands.map((brand, index) => (
                <button
                  key={brand.id}
                  className={`w-100 d-flex align-items-center justify-content-between py-3 px-3 border-0 ${
                    selectedBrand?.id === brand.id 
                      ? 'bg-success text-white' 
                      : 'bg-light text-dark hover:bg-secondary'
                  } ${brand.stock === 0 ? 'disabled opacity-50' : ''}`}
                  onClick={() => handleBrandSelect(brand)}
                  disabled={brand.stock === 0}
                  style={{
                    borderRadius: index === 0 ? '8px 8px 0 0' : index === brands.length - 1 ? '0 0 8px 8px' : '0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBrand?.id !== brand.id && brand.stock > 0) {
                      e.target.style.backgroundColor = '#6c757d';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBrand?.id !== brand.id && brand.stock > 0) {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#212529';
                    }
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    {selectedBrand?.id === brand.id && (
                      <i className="bi bi-check-lg text-white"></i>
                    )}
                    <span className="fw-medium">
                      {brand.brand}  {brand.price?.toLocaleString() || '0'} Ar
                    </span>
                  </div>
                  <StockBadge stock={brand.stock} />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-muted">
            <i className="bi bi-exclamation-triangle fs-1 mb-2 d-block"></i>
            <p className="mb-0">Aucune marque disponible pour ce produit</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;