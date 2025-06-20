import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    address: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await api.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        address: formData.address
      });
      
      if (response.data) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
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
                    <h1 className="section-title h2 mb-3">Créer un compte</h1>
                    <p className="text-muted">Rejoignez PPM Market Madagascar</p>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger fade-in" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="fade-in">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">
                        <i className="bi bi-person me-2"></i>Nom complet
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        placeholder="Votre nom complet"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2"></i>Adresse email
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label fw-semibold">
                        <i className="bi bi-geo-alt me-2"></i>Adresse
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="address"
                        name="address"
                        placeholder="Votre adresse complète"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">
                        <i className="bi bi-lock me-2"></i>Mot de passe
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password_confirmation" className="form-label fw-semibold">
                        <i className="bi bi-lock-fill me-2"></i>Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="••••••••"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 mb-4"
                    >
                      <i className="bi bi-person-plus me-2"></i>Créer mon compte
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Déjà inscrit?{' '}
                      <Link to="/login" className="text-decoration-none fw-semibold">
                        Connectez-vous
                      </Link>
                    </p>
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

export default RegisterPage;