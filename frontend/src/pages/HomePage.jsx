import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';


const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
    const [setMobileMenuOpen] = useState(false);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);
        
        const productsResponse = await api.get('/products');
        setProducts(productsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrer les produits par catégorie et par recherche
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || 
      product.categoryId === selectedCategory || 
      product.category_id === selectedCategory;
    
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sub_products || product.subProducts || []).some(subProduct =>
        subProduct.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoriesDropdown(false);
  };

   const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      Navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center fade-in">
            <div className="spinner mx-auto mb-4"></div>
            <h3 className="text-muted">Chargement des produits...</h3>
            <p className="text-muted">Veuillez patienter quelques instants</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      {/* Bannière promo améliorée */}
      <section className="promo-banner">
        <div className="container">
          <div className="align-items-center">
            <div>
              <h2>PPM Market Madagascar</h2>
              <p className="opacity-70">Votre marketplace de produits de première nécessité. <br /> Comparez les marques, trouvez les meilleurs prix, commandez en ligne.</p>
            </div>
            <div>
              <span className="badge white px-3 py-3 fs-6" style={{backgroundColor:'#D2691E'}}>🎉 Livraison gratuite à Antananarivo pour les commandes de plus de 50 000 Ar</span>
            </div>
          </div>
        </div>
      </section>
      
      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Section titre améliorée */}
          
          
          {/* Section de filtrage avec dropdown et recherche */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                {/* Dropdown des catégories */}
                <div className="dropdown position-relative">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                    style={{ minWidth: '200px',backgroundColor: '#bc692f', color:"black", fontSize: "15px"}}

                  >
                    <i className="bi bi-grid-3x3-gap"></i>
                    {selectedCategory 
                      ? categories.find(c => c.id === selectedCategory)?.name 
                      : 'Toutes les catégories'
                    }
                  </button>
                  
                  {showCategoriesDropdown && (
                    <div className="dropdown-menu show position-absolute w-100 shadow-lg border-0 mt-2" style={{ zIndex: 1050 }}>
                      <button
                        className={`dropdown-item d-flex align-items-center gap-2 ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(null)}
                        style={{backgroundColor: 'white', color: 'black'}}
                      >
                        <i className="bi bi-check-circle-fill text-success"></i>
                        Toutes les catégories
                      </button>
                      <div className="dropdown-divider"></div>
                      {categories.map(category => (
                        <button
                          key={category.id}
                          className={`dropdown-item d-flex align-items-center gap-2 ${selectedCategory === category.id ? 'active' : ''}`}
                          onClick={() => handleCategorySelect(category.id)}
                          style={{backgroundColor: 'white', color: 'black'}}
                        >
                          {selectedCategory === category.id && (
                            <i className="bi bi-check-circle-fill text-success"></i>
                          )}
                          {selectedCategory !== category.id && (
                            <span style={{ width: '16px' }}></span>
                          )}
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Barre de recherche */}
                <div className="d-none d-md-flex flex-grow-1 justify-content-center mx-4">
            <form onSubmit={handleSearch} className="position-relative w-100" style={{maxWidth: '500px'}}>
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="form-control form-control-lg rounded-pill pe-5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{backgroundColor: '#bc692f', color:"white", fontSize: "15px"}}
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

                {/* Indicateur de résultats */}
                {/* <div className="text-muted">
                  <small>{filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}</small>
                </div> */}
              </div>
            </div>
          </div>
          
          {/* Grille produits améliorée */}
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <h3>Aucun produit trouvé</h3>
              <p className="text-muted">Aucun produit ne correspond à vos critères de recherche.</p>
              {(selectedCategory || searchTerm) && (
                <button 
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchTerm('');
                  }}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="col">
                  <div className="fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Section statistiques */}
          <div className="row mt-5 pt-5 border-top">
            <div className="col-md-4 text-center mb-4">
              <div className="h2 primary fw-bold">{products.length}+</div>
              <p className="text-muted">Produits disponibles</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="h2 primary fw-bold">{categories.length}+</div>
              <p className="text-muted">Catégories</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="h2 primary fw-bold">24h</div>
              <p className="text-muted">Livraison rapide</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;