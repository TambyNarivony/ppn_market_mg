
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/login', {
        email: email,
        password: password,
      });
      
      const { user, token } = response.data;
      
      localStorage.setItem('ppn_token', token);
      localStorage.setItem('ppn_user', JSON.stringify(user));
      
      login(user, token);
      
      navigate(user.role === 'admin' ? '/admin' : '/');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1 d-flex align-items-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h1 className="section-title h2 mb-3">Connexion</h1>
                    <p className="text-muted">Accédez à votre compte PPM Market</p>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger fade-in" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="fade-in">
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="email">
                        <i className="bi bi-envelope me-2"></i>Adresse email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-semibold" htmlFor="password">
                        <i className="bi bi-lock me-2"></i>Mot de passe
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 mb-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>Se connecter
                        </>
                      )}
                    </button>
                  </form>
                  
                  <div className="text-center mb-4">
                    <p className="text-muted mb-2">
                      Pas encore de compte?{' '}
                      <Link to="/register" className="text-decoration-none fw-semibold">
                        Créer un compte
                      </Link>
                    </p>
                    
                    <Link to="/forgot-password" className="text-muted small text-decoration-none">
                      Mot de passe oublié?
                    </Link>
                  </div>
                  
                  <div className="border-top pt-4">
                    <h6 className="text-muted mb-3">
                      <i className="bi bi-gear me-2"></i>Comptes de démonstration
                    </h6>
                    <div className="d-grid gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('client@ppnmarket.mg');
                          setPassword('demo1234');
                        }}
                        className="btn btn-outline-secondary btn-sm text-start"
                      >
                        <i className="bi bi-person me-2"></i>
                        <strong>Client:</strong> client@ppnmarket.mg
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('admin@ppnmarket.mg');
                          setPassword('demo1234');
                        }}
                        className="btn btn-outline-secondary btn-sm text-start"
                      >
                        <i className="bi bi-shield-check me-2"></i>
                        <strong>Admin:</strong> admin@ppnmarket.mg
                      </button>
                    </div>
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

export default LoginPage;