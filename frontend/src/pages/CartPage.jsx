import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartTotal,
    cartItemCount,
    clearCart
  } = useCart();

  if (cartItemCount === 0) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="empty-state">
                  <div className="icon">🛒</div>
                  <h2 className="fw-bold mb-4">Votre panier est vide</h2>
                  <p className="text-muted mb-4">Découvrez nos produits et commencez vos achats dès maintenant</p>
                  <Link to="/" className="btn btn-primary btn-lg">
                    <i className="bi bi-arrow-left me-2"></i>Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* En-tête du panier */}
          <div className="row mb-5">
            <div className="col-12">
              <h1 className="section-title display-6">Mon Panier</h1>
              <p className="lead text-muted">
                {cartItemCount} article{cartItemCount > 1 ? 's' : ''} dans votre panier
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            {/* Articles du panier */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-semibold">Articles sélectionnés</h5>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={clearCart}
                    >
                      <i className="bi bi-trash me-1"></i>Vider le panier
                    </button>
                  </div>
                </div>
                
                <div className="card-body p-0">
                  {cart.map((item, index) => (
                    <div key={item.id} className="cart-item border-bottom mx-3" style={{marginBottom: index === cart.length - 1 ? '20px' : '0'}}>
                      <div className="row align-items-center g-3">
                        {/* Image du produit */}
                        <div className="col-3 col-md-2">
                          <div className="ratio ratio-1x1 bg-light rounded overflow-hidden">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.brand} 
                                className="object-fit-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center text-muted">
                                <i className="bi bi-image"></i>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Détails du produit */}
                        <div className="col-9 col-md-6">
                          <h6 className="fw-semibold mb-1">{item.brand}</h6>
                          <p className="text-muted small mb-2">{item.productName}</p>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-light text-dark me-2">En stock</span>
                            <span className="text-muted small">Stock: {item.stock}</span>
                          </div>
                        </div>
                        
                        {/* Contrôles quantité */}
                        <div className="col-6 col-md-2">
                          <div className="quantity-control">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                              className="form-control"
                              min="1"
                              max={item.stock}
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Prix et suppression */}
                        <div className="col-6 col-md-2 text-end">
                          <div className="price fw-bold mb-2">
                            {(item.price * item.quantity).toLocaleString()} Ar
                          </div>
                          <div className="text-muted small mb-2">
                            {item.price.toLocaleString()} Ar × {item.quantity}
                          </div>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item.id)}
                            title="Supprimer cet article"
                          >
                            <i className="bi bi-trash"></i>
                            supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Récapitulatif de la commande */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{top: '120px'}}>
                <div className="card-header primary text-white" style={{backgroundColor: '#D2691E'}}>
                  <h5 className="mb-0 fw-semibold">💳 Récapitulatif</h5>
                </div>
                
                <div className="card-body">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-3">
                      <span>Sous-total ({cartItemCount} articles)</span>
                      <span className="fw-semibold">{cartTotal.toLocaleString()} Ar</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Frais de livraison</span>
                      <span className="text-success fw-semibold">Gratuit</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Réduction</span>
                      <span className="text-muted">-</span>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold fs-5">Total</span>
                      <span className="fw-bold fs-5 price">{cartTotal.toLocaleString()} Ar</span>
                    </div>
                  </div>
                  
                  <Link 
                    to="/checkout" 
                    className="btn btn-primary lg w-100 mb-3"
                    style={{border: 'none'}}
                  >
                    <i className="bi bi-credit-card me-2"></i>Passer la commande
                  </Link>
                  
                  <Link 
                    to="/" 
                    className="btn btn-outline-secondary w-100"
                  >
                    <i className="bi bi-arrow-left me-2"></i>Continuer mes achats
                  </Link>
                </div>
                
                <div className="card-footer bg-light text-center">
                  <small className="text-muted">
                    <i className="bi bi-truck me-1"></i>
                    Livraison estimée sous 1-3 jours ouvrés à Antananarivo
                  </small>
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

export default CartPage;