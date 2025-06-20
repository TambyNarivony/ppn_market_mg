
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/pending');
        setOrders(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors du chargement des commandes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 d-flex align-items-center">
          <div className="container">
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <h3 className="text-muted">Chargement des commandes...</h3>
              <p className="text-muted">Veuillez patienter quelques instants</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
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
                      <i className="bi bi-exclamation-triangle-fill" style={{fontSize: '4rem'}}></i>
                    </div>
                    <h2 className="section-title h3 mb-3">Erreur</h2>
                    <p className="text-danger mb-4">{error}</p>
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate('/')}
                    >
                      <i className="bi bi-house me-2"></i>Retour à l'accueil
                    </button>
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
              <div className="mb-5">
                <h1 className="section-title display-6">
                  <i className="bi bi-bag-check me-3"></i>Mes commandes
                </h1>
                <p className="lead text-muted">Suivez l'état de vos commandes en temps réel</p>
              </div>
              
              {orders.length === 0 ? (
                <div className="card border-0 shadow-lg">
                  <div className="card-body text-center p-5">
                    <div className="empty-state">
                      <div className="text-muted mb-4">
                        <i className="bi bi-bag" style={{fontSize: '5rem'}}></i>
                      </div>
                      <h3 className="h4 mb-3">Aucune commande en cours</h3>
                      <p className="text-muted mb-4">Vous n'avez pas encore passé de commande.</p>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/')}
                        style={{border: 'none'}}
                      >
                        <i className="bi bi-shop me-2"></i>Commencer vos achats
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row g-4">
                  {orders.map(order => (
                    <div key={order.id} className="col-12">
                      <div className="card border-0 shadow-sm fade-in">
                        <div className="card-header bg-white border-bottom">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h3 className="h5 fw-bold mb-1">
                                <i className="bi bi-receipt me-2"></i>Commande #{order.id}
                              </h3>
                              <small className="text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                Passée le {new Date(order.created_at).toLocaleDateString('fr-FR')}
                              </small>
                            </div>
                            <span className="badge bg-warning text-dark px-3 py-2">
                              <i className="bi bi-clock me-1"></i>{order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="card-body p-4">
                          <h4 className="h6 fw-semibold mb-3">
                            <i className="bi bi-box me-2"></i>Articles commandés
                          </h4>
                          <div className="row g-2 mb-4">
                            {order.items.map(item => (
                              <div key={item.id} className="col-12">
                                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                                  <div>
                                    <span className="fw-medium">
                                      {item.quantity} × {item.sub_product?.brand} {item.sub_product?.name}
                                    </span>
                                  </div>
                                  <span className="fw-semibold price">
                                    {(item.sub_product?.price * item.quantity).toLocaleString()} Ar
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <span className="h6 fw-bold mb-0">Total de la commande</span>
                            <span className="h5 fw-bold price-large mb-0">
                              {order.total.toLocaleString()} Ar
                            </span>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;