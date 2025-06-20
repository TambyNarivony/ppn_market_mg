
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandSelector from './BrandSelector';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { addToCart } = useCart();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const subProducts = product.subProducts || product.sub_products || [];

    // Sélection automatique du premier sous-produit au chargement
  useEffect(() => {
    if (subProducts.length > 0 && !selectedBrand) {
      setSelectedBrand({
        ...subProducts[0],
        image: subProducts[0].image || subProducts[0].image_url || null
      });
    }
  }, [product, selectedBrand, subProducts]); 

  const handleBrandSelect = (brand) => {
    setSelectedBrand({
      ...brand,
      image: brand.image || brand.image_url || null
    });
  };

  const handleAddToCart = () => {
    if (selectedBrand) {
      addToCart({
        ...selectedBrand,
        productId: product.id,
        productName: product.name
      });
      
      // Animation de feedback
      const button = document.activeElement;
      if (button) {
        button.classList.add('btn-success');
        button.innerHTML = '<i class="bi bi-check-lg me-1"></i>Ajouté !';
        setTimeout(() => {
          button.classList.remove('btn-success');
          button.classList.add('btn-secondary');
          button.innerHTML = 'Ajouter';
        }, 1500);
      }
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm product-card" 
         style={{transition: 'all 0.3s ease'}}>
      {/* Image Container */}
      <div className="card-img-top position-relative overflow-hidden" 
           style={{height: '200px', backgroundColor: '#f8f9fa'}}>
        {selectedBrand?.image ? (
          <img 
            src={selectedBrand.image} 
            alt={product.name} 
            className="w-100 h-100 object-fit-cover"
            loading="lazy"
            style={{transition: 'transform 0.3s ease'}}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <div className="text-center">
              <i className="bi bi-image fs-1 mb-2"></i>
              <p className="mb-0 small">Image non disponible</p>
            </div>
          </div>
        )}
        
        {/* Stock Badge */}
        {selectedBrand && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className={`badge ${
              selectedBrand.stock > 10 ? 'bg-success' : 
              selectedBrand.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'
            } rounded-pill`}>
              {selectedBrand.stock > 0 ? `${selectedBrand.stock} en stock` : 'Rupture'}
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="text-decoration-none">
          <h5 className="card-title text-dark mb-3 fw-bold hover-primary" 
              style={{transition: 'color 0.2s ease'}}>
            {product.name}
          </h5>
        </Link>
        
        {/* Category Badge */}
        {product.category && (
          <span className="badge bg-light text-dark border mb-3 align-self-start">
            <i className="bi bi-tag me-1"></i>
            {product.category.name}
          </span>
        )}
        
        {/* Brand Selector */}
        <div className="mb-3 flex-grow-1">
          <BrandSelector 
            brands={subProducts} 
            onSelect={handleBrandSelect}
            selectedBrand={selectedBrand}
          />
        </div>
        
        {/* Price and Add to Cart */}
        {selectedBrand && (
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="h4 primary fw-bold mb-0">
                  {selectedBrand.price?.toLocaleString() || '0'} Ar
                </p>
                <small className="text-muted">
                  <i className="bi bi-tag me-1"></i>
                  {selectedBrand.brand}
                </small>
              </div>
            </div>
            
            <div className="d-grid">
              <button 
                onClick={handleAddToCart}
                className="btn btn-secondary fw-semibold"
                disabled={!selectedBrand || selectedBrand.stock === 0}
                style={{transition: 'all 0.3s ease'}}
              >
                {selectedBrand.stock === 0 ? (
                  <>
                    <i className="bi bi-x-circle me-1"></i>
                    Rupture de stock
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-plus me-1"></i>
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* View Details Link */}
        <div className="mt-3">
          <Link 
            to={`/product/${product.id}`} 
            className="btn btn-outline-primary btn-sm w-100"
            style={{
              color: "white", 
              backgroundColor: "#236b44",
              border: "none"
            }}
          >
            <i className="bi bi-eye me-1"></i>
            Voir les détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;