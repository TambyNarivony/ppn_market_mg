import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { cartItemCount, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="primary text-white shadow-lg fixed-top">
      <div className="">
        <div className="d-flex justify-content-between align-items-center py-3">
          {/* Logo */}
          <Link to="/" className="navbar-brand text-white text-decoration-none d-flex align-items-center">
            <i className="bi bi-shop me-2 fs-4"></i>
            <span className="fw-bold fs-5">PPM Market MG</span>
          </Link>

          {/* Desktop Search Bar - Center */}
          <div className="d-none d-md-flex flex-grow-1 justify-content-center mx-4">
            <form onSubmit={handleSearch} className="position-relative w-100" style={{maxWidth: '500px'}}>
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="form-control form-control-lg rounded-pill pe-5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{backgroundColor: 'rgba(74, 134, 100, 0.95)', color:"white", fontSize: "15px"}}
              />
              <button 
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-2 border-0"
                style={{backgroundColor: 'transparent'}}
              >
                <Search size={20} className="" style={{color:"white"}}/>
              </button>
            </form>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <Link to="/" className="text-white text-decoration-none d-flex align-items-center hover-scale">
              <i className="bi bi-house me-1"></i>
              <span>Accueil</span>
            </Link>
            
            {/* <Link to="/categories" className="text-white text-decoration-none d-flex align-items-center hover-scale">
              <i className="bi bi-grid-3x3-gap me-1"></i>
              <span>Catégories</span>
            </Link> */}

            {/* Cart */}
            <Link to="/cart" className="position-relative text-white text-decoration-none hover-scale">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                  <span className="visually-hidden">articles dans le panier</span>
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {currentUser ? (
              <div className="dropdown">
                <button className="btn btn-link text-white text-decoration-none d-flex align-items-center dropdown-toggle" 
                        type="button" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false">
                  <User size={20} className="me-1" />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <i className="bi bi-person me-2"></i>Profil
                    </Link>
                  </li>
                  {currentUser.role === 'admin' && (
                    <li>
                      <Link to="/admin" className="dropdown-item">
                        <i className="bi bi-shield-check me-2"></i>Admin
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="text-white text-decoration-none d-flex align-items-center hover-scale">
                <User size={20} className="me-1" />
                <span>Connexion</span>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button 
            className="btn btn-link text-white d-md-none p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="d-md-none bg-white text-dark rounded-3 mb-3 shadow-lg">
            <div className="p-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="position-relative">
                  <input
                    type="text"
                    placeholder="Rechercher des produits..."
                    className="form-control form-control-lg rounded-pill pe-5"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-2 border-0"
                  >
                    <Search size={20} className="text-primary" />
                  </button>
                </div>
              </form>
              
              <div className="d-flex flex-column gap-3">
                <Link 
                  to="/" 
                  className="btn btn-outline-primary text-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="bi bi-house me-2"></i>Accueil
                </Link>
                
                {/* <Link 
                  to="/categories" 
                  className="btn btn-outline-primary text-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>Catégories
                </Link> */}
                
                <Link 
                  to="/cart" 
                  className="btn btn-outline-primary text-start d-flex align-items-center justify-content-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span><i className="bi bi-cart me-2"></i>Panier</span>
                  {cartItemCount > 0 && (
                    <span className="badge bg-danger rounded-pill">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                
                <hr className="my-2" />
                
                {currentUser ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="btn btn-outline-secondary text-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="bi bi-person me-2"></i>Profil
                    </Link>
                    {currentUser.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="btn btn-outline-secondary text-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="bi bi-shield-check me-2"></i>Admin
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="btn btn-outline-danger text-start"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="btn btn-primary text-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>Connexion
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;