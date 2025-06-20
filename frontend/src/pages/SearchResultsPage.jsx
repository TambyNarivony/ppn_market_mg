
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/search?q=${searchTerm}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Une erreur est survenue lors de la récupération des résultats de recherche.");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* En-tête de recherche */}
          <div className="row mb-5">
            <div className="col-12">
              <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-decoration-none">Accueil</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Résultats de recherche
                  </li>
                </ol>
              </nav>
              
              <h1 className="section-title display-6">
                🔍 Résultats pour "{searchTerm}"
              </h1>
              
              {!loading && !error && (
                <p className="lead text-muted">
                  {searchResults.length} produit{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* État de chargement */}
          {loading && (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="text-center fade-in">
                  <div className="spinner mx-auto mb-4"></div>
                  <h3 className="text-muted">Recherche en cours...</h3>
                  <p className="text-muted">Nous cherchons les meilleurs produits pour vous</p>
                </div>
              </div>
            </div>
          )}

          {/* État d'erreur */}
          {error && (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="alert alert-danger text-center" role="alert">
                  <i className="bi bi-exclamation-triangle display-4 mb-3 d-block"></i>
                  <h4 className="alert-heading">Erreur de recherche</h4>
                  <p>{error}</p>
                  
                  <p className="mb-0">
                    <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aucun résultat */}
          {!loading && !error && searchResults.length === 0 && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="empty-state">
                  <div className="icon">🔍</div>
                  <h3>Aucun produit trouvé</h3>
                  <p className="text-muted mb-4">
                    Nous n'avons trouvé aucun produit correspondant à "<strong>{searchTerm}</strong>".
                  </p>
                  
                  <div className="card bg-light border-0 p-4 mb-4">
                    <h6 className="fw-semibold mb-3">💡 Suggestions :</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">• Vérifiez l'orthographe de votre recherche</li>
                      <li className="mb-2">• Essayez des mots-clés plus généraux</li>
                      <li className="mb-2">• Utilisez des synonymes</li>
                      <li>• Parcourez nos catégories de produits</li>
                    </ul>
                  </div>
                  
                  <div className="d-flex gap-3 justify-content-center">
                    <Link to="/" className="btn btn-primary">
                      <i className="bi bi-house me-2"></i>Retour à l'accueil
                    </Link>
                    <Link to="/categories" className="btn btn-outline-secondary">
                      <i className="bi bi-grid me-2"></i>Voir les catégories
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Résultats de recherche */}
          {!loading && !error && searchResults.length > 0 && (
            <>
              {/* Filtres et tri */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card bg-light border-0 p-3">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <i className="bi bi-funnel text-primary"></i>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Filtrer par :</small>
                        <div className="d-flex gap-2 flex-wrap">
                          <button className="btn btn-sm btn-outline-secondary">Prix</button>
                          <button className="btn btn-sm btn-outline-secondary">Marque</button>
                          <button className="btn btn-sm btn-outline-secondary">Stock</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card bg-light border-0 p-3">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <i className="bi bi-sort-down text-primary"></i>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Trier par :</small>
                        <select className="form-select form-select-sm">
                          <option>Pertinence</option>
                          <option>Prix croissant</option>
                          <option>Prix décroissant</option>
                          <option>Nouveautés</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grille de produits */}
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {searchResults.map((product, index) => (
                  <div key={product.id} className="col">
                    <div className="fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination (exemple) */}
              {searchResults.length > 12 && (
                <nav className="mt-5" aria-label="Pagination des résultats">
                  <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                      <span className="page-link">Précédent</span>
                    </li>
                    <li className="page-item active">
                      <span className="page-link">1</span>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">2</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">3</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">Suivant</a>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;