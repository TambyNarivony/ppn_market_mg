import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PaymentSimulator from '../components/PaymentMethodSelector';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [address, setAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          sub_product_id: item.id,
          quantity: item.quantity
        })),
        payment_method: paymentMethod,
        total: cartTotal,
        address
      };
      
      const response = await api.post('/orders', orderData);
      setOrderSuccess(true);
      setOrderId(response.data.order.id);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      setError(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card border-0 shadow-lg text-center">
                  <div className="card-body p-5">
                    <div className="empty-state">
                      <div className="text-muted mb-4">
                        <i className="bi bi-cart" style={{fontSize: '5rem'}}></i>
                      </div>
                      <h2 className="section-title h3 mb-3">Votre panier est vide</h2>
                      <p className="text-muted mb-4">Ajoutez des produits avant de passer à la caisse</p>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/')}
                      >
                        <i className="bi bi-shop me-2"></i>Continuer vos achats
                      </button>
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
  }

  if (orderSuccess) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 d-flex align-items-center py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow-lg">
                  <div className="card-body text-center p-5">
                    <div className="mb-4">
                      <div className="text-success mb-4" style={{fontSize: '5rem'}}>
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                      <h1 className="section-title h2 text-success mb-3">Commande confirmée !</h1>
                      <p className="lead text-muted mb-4">
                        Votre commande #{orderId} a été passée avec succès.
                      </p>
                      <p className="text-muted mb-5">
                        Un email de confirmation a été envoyé à {currentUser?.email || 'votre adresse email'}.
                      </p>
                    </div>
                    
                    <div className="card bg-light border-0 mb-5">
                      <div className="card-body p-4">
                        <h3 className="h5 fw-bold mb-3">
                          <i className="bi bi-receipt me-2"></i>Détails de la commande
                        </h3>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <small className="text-muted">Adresse de livraison</small>
                            <p className="fw-medium mb-0">{address}</p>
                          </div>
                          <div className="col-md-6">
                            <small className="text-muted">Méthode de paiement</small>
                            <p className="fw-medium mb-0">
                              {paymentMethod === 'mvola' ? 'MVola' : 'Orange Money'}
                            </p>
                          </div>
                          <div className="col-12">
                            <small className="text-muted">Montant total</small>
                            <p className="h5 price-large fw-bold mb-0">{cartTotal.toLocaleString()} Ar</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/')}
                      >
                        <i className="bi bi-shop me-2"></i>Continuer vos achats
                      </button>
                      <button 
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => navigate('/orders')}
                      >
                        <i className="bi bi-list-check me-2"></i>Voir mes commandes
                      </button>
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
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="mb-5">
            <h1 className="section-title display-6">
              <i className="bi bi-credit-card me-3"></i>Validation de commande
            </h1>
            <p className="lead text-muted">Finalisez votre achat en quelques étapes</p>
          </div>
          
          {error && (
            <div className="alert alert-danger fade-in mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          
          <div className="row g-4">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit}>
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white py-3">
                    <h2 className="h5 fw-bold mb-0">
                      <i className="bi bi-truck me-2"></i>Informations de livraison
                    </h2>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-0">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-geo-alt me-2"></i>Adresse de livraison complète
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="4"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Veuillez saisir votre adresse complète de livraison..."
                        required
                      ></textarea>
                      <small className="text-muted">
                        Incluez tous les détails nécessaires (quartier, rue, numéro, point de repère)
                      </small>
                    </div>
                  </div>
                </div>
                
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white py-3">
                    <h2 className="h5 fw-bold mb-0">
                      <i className="bi bi-credit-card me-2"></i>Méthode de paiement
                    </h2>
                  </div>
                  <div className="card-body p-4">
                    <PaymentSimulator onPaymentSelect={handlePaymentSelect} />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg w-100 ${
                    isProcessing ? 'disabled' : ''
                  }`}
                  disabled={isProcessing || !paymentMethod}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Confirmer la commande
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{top: '120px'}}>
                <div className="card-header primary text-white py-3" style={{backgroundColor: '#D2691E'}}>
                  <h2 className="h5 fw-bold mb-0">
                    <i className="bi bi-receipt me-2"></i>Récapitulatif
                  </h2>
                </div>
                
                <div className="card-body p-4">
                  <div className="mb-4">
                    {cart.slice(0, 3).map(item => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                        <div className="flex-grow-1">
                          <small className="fw-medium">
                            {item.quantity} × {item.brand} {item.name}
                          </small>
                        </div>
                        <small className="fw-semibold price">
                          {(item.price * item.quantity).toLocaleString()} Ar
                        </small>
                      </div>
                    ))}
                    
                    {cart.length > 3 && (
                      <div className="text-center text-muted small mb-3">
                        +{cart.length - 3} autres articles
                      </div>
                    )}
                  </div>
                  
                  <div className="border-top pt-3 mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Sous-total</span>
                      <span className="fw-semibold">{cartTotal.toLocaleString()} Ar</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Livraison</span>
                      <span className="text-success fw-semibold">Gratuite</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="h6 fw-bold">Total</span>
                      <span className="h5 fw-bold price-large">{cartTotal.toLocaleString()} Ar</span>
                    </div>
                  </div>
                  
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Paiement sécurisé • Livraison rapide
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

export default CheckoutPage;