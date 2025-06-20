import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BrandSelector from '../components/BrandSelector';
import StockBadge from '../components/StockBadge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        const subProducts = fetchedProduct.subProducts || fetchedProduct.sub_products || [];

        if (subProducts.length > 0) {
          setSelectedBrand({
            ...subProducts[0],
            image: subProducts[0].image || subProducts[0].image_url || null
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError("Erreur lors de la récupération du produit. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand({
      ...brand,
      image: brand.image || brand.image_url || null
    });
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedBrand && quantity > 0 && quantity <= selectedBrand.stock) {
      addToCart({
        id: selectedBrand.id,
        productId: product.id,
        productName: product.name,
        brand: selectedBrand.brand,
        price: selectedBrand.price,
        image: selectedBrand.image,
        stock: selectedBrand.stock,
        quantity: quantity,
      });
      alert(`${quantity} ${product.name} (${selectedBrand.brand}) ajouté au panier!`);
      setQuantity(1);
    } else if (selectedBrand && quantity > selectedBrand.stock) {
      alert(`La quantité demandée (${quantity}) dépasse le stock disponible (${selectedBrand.stock}) pour cette marque.`);
    } else {
      alert("Veuillez sélectionner une marque et une quantité valide.");
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center fade-in">
            <div className="spinner mx-auto mb-4"></div>
            <h3 className="text-muted">Chargement du produit...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="empty-state">
              <div className="icon text-danger">⚠️</div>
              <h3 className="text-danger">{error}</h3>
              <Link to="/" className="btn btn-primary mt-3">Retour à l'accueil</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>Produit non trouvé</h3>
              <p className="text-muted">Ce produit n'existe pas ou a été supprimé.</p>
              <Link to="/" className="btn btn-primary mt-3">Retour à l'accueil</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subProducts = product.subProducts || product.sub_products || [];

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Accueil</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="row g-5">
            {/* Section Image */}
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body d-flex align-items-center justify-content-center p-5" style={{minHeight: '500px'}}>
                  {selectedBrand?.image ? (
                      <img
    src={selectedBrand.image}
    alt={product.name}
    className="img-fluid rounded"
    style={{maxHeight: '400px', objectFit: 'contain'}}
    onError={(e) => {
      e.target.onerror = null;
      e.target.parentNode.innerHTML = `
        <div className="text-center text-muted">
          <i className="bi bi-image display-1 mb-3"></i>
          <p>Image non disponible</p>
        </div>
      `;
    }}
  />
                  ) : (
                    <div className="text-center text-muted">
                      <i className="bi bi-image display-1 mb-3"></i>
                      <p>Image non disponible</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section Détails */}
            <div className="col-lg-6">
              <div className="fade-in">
                <h1 className="display-6 fw-bold mb-3">{product.name}</h1>
                
                {product.category && (
                  <div className="mb-4">
                    <span className="badge bg-light text-dark border px-3 py-2">
                      📂 {product.category.name}
                    </span>
                  </div>
                )}

                {/* Sélecteur de marques amélioré */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3">Choisir une marque :</h5>
                  <BrandSelector
                    brands={subProducts}
                    onSelect={handleBrandSelect}
                    selectedBrand={selectedBrand}
                  />
                </div>

                {/* Détails de la marque sélectionnée */}
                {selectedBrand && (
                  <div className="card bg-light border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">🏷️ {selectedBrand.brand}</h5>
                        <StockBadge stock={selectedBrand.stock} />
                      </div>
                      
                      <div className="price price-large text-primary mb-4">
                        {selectedBrand.price?.toLocaleString() || '0'} Ar
                      </div>

                      {selectedBrand.stock > 0 && (
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Quantité :</label>
                          <div className="quantity-control d-inline-flex">
                            <button
                              type="button"
                              onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={selectedBrand.stock}
                              value={quantity}
                              onChange={(e) => setQuantity(Math.max(1, Math.min(selectedBrand.stock, parseInt(e.target.value) || 1)))}
                              className="form-control text-center"
                              style={{width: '80px'}}
                            />
                            <button
                              type="button"
                              onClick={() => setQuantity(q => Math.min(selectedBrand.stock, q + 1))}
                            >
                              +
                            </button>
                          </div>
                          <div className="form-text">Stock disponible: {selectedBrand.stock} unités</div>
                        </div>
                      )}

                      <button
                        className="btn btn-primary btn-lg w-100 py-3"
                        onClick={handleAddToCart}
                        disabled={!selectedBrand || selectedBrand.stock === 0 || quantity <= 0 || quantity > selectedBrand.stock}
                      >
                        {selectedBrand.stock === 0 ? (
                          <>🚫 Rupture de stock</>
                        ) : (
                          <>🛒 Ajouter au panier</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Description du produit */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">📋 Description du produit</h5>
                    <p className="card-text lh-lg">{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;