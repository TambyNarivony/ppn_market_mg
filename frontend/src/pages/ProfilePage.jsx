import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        try {
          const response = await api.get('/orders/history');
          setOrders(response.data);
        } catch (err) {
          console.error("Erreur de chargement des commandes:", err);
          setError("Impossible de charger l'historique des commandes. Veuillez réessayer.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser && !loading) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card border-0 shadow-lg text-center">
                  <div className="card-body p-5">
                    <div className="text-danger mb-4">
                      <i className="bi bi-shield-exclamation" style={{fontSize: '4rem'}}></i>
                    </div>
                    <h2 className="section-title h3 mb-3">Accès non autorisé</h2>
                    <p className="text-muted mb-4">Vous devez être connecté pour accéder à cette page.</p>
                    <Link to="/login" className="btn btn-primary btn-lg">
                      <i className="bi bi-box-arrow-in-right me-2"></i>Se connecter
                    </Link>
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
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg">
                <div className="card-header bg-secondary text-white py-4">
                  <h1 className="h2 mb-0">
                    <i className="bi bi-person-circle me-3"></i>Mon Profil
                  </h1>
                </div>
                
                <div className="card-body p-5">
                  {currentUser && (
                    <div className="row mb-5">
                      <div className="col-md-8">
                        <h2 className="section-title h4 mb-4">Informations Personnelles</h2>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="bg-light rounded p-3">
                              <label className="text-muted small">Nom</label>
                              <p className="fw-semibold mb-0">{currentUser.name}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="bg-light rounded p-3">
                              <label className="text-muted small">Email</label>
                              <p className="fw-semibold mb-0">{currentUser.email}</p>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="bg-light rounded p-3">
                              <label className="text-muted small">Rôle</label>
                              <p className="fw-semibold mb-0">
                                <span className={`badge ${currentUser.role === 'admin' ? 'bg-warning' : 'bg-success'}`}>
                                  {currentUser.role === 'admin' ? 'Administrateur' : 'Client'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <h2 className="section-title h4 mb-4">
                    <i className="bi bi-bag-check me-2"></i>Historique des commandes
                  </h2>

                  {loading && (
                    <div className="text-center py-5">
                      <div className="spinner mb-4"></div>
                      <p className="text-muted">Chargement des commandes...</p>
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger text-center" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  {!loading && !error && orders.length === 0 ? (
                    <div className="empty-state text-center py-5">
                      <div className="text-muted mb-4">
                        <i className="bi bi-bag" style={{fontSize: '4rem'}}></i>
                      </div>
                      <h3 className="h5 mb-3">Aucune commande</h3>
                      <p className="text-muted mb-4">Vous n'avez pas encore passé de commande.</p>
                      <Link to="/" className="btn btn-secondary">
                        <i className="bi bi-shop me-2"></i>Découvrir nos produits
                      </Link>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {!loading && orders.map(order => (
                        <div key={order.id} className="col-12">
                          <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-bottom">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h3 className="h6 fw-bold mb-1">
                                    <i className="bi bi-receipt me-2"></i>Commande #{order.id}
                                  </h3>
                                  <small className="text-muted">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                  </small>
                                </div>
                                <span className={`badge ${order.validation === 1 ? 'bg-success' : 'bg-warning'}`}>
                                  {order.validation === 1 ? 'Validée' : 'En attente'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="card-body">
                              <h4 className="h6 fw-semibold mb-3">Articles commandés:</h4>
                              <div className="row g-2 mb-4">
                                {order.items.map(item => (
                                  <div key={item.id} className="col-12">
                                    <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                      <div>
                                        <span className="fw-medium">
                                          {item.quantity} × {item.sub_product?.product?.name || 'Produit Inconnu'}
                                        </span>
                                        <small className="text-muted d-block">
                                          ({item.sub_product?.brand || 'Marque Inconnue'})
                                        </small>
                                      </div>
                                      <span className="fw-semibold price">
                                        {(item.sub_product?.price * item.quantity).toLocaleString()} Ar
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="border-top pt-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <span className="fw-bold">Total de la commande:</span>
                                    <small className="text-muted d-block">
                                      <i className="bi bi-credit-card me-1"></i>
                                      Paiement: {order.payment_method}
                                    </small>
                                  </div>
                                  <span className="h5 fw-bold price-large">
                                    {order.total?.toLocaleString() || '0'} Ar
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

export default Profile;