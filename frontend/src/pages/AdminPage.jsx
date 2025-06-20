import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AdminProductForm from '../components/AdminProductForm';
import AdminCategoryEditForm from '../components/AdminCategoryEditForm';
import SubProductEditForm from '../components/SubProductEditForm';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [editingSubProduct, setEditingSubProduct] = useState(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loadingPendingOrders, setLoadingPendingOrders] = useState(false);
  const [showProductCreateForm, setShowProductCreateForm] = useState(false);
  const [, setCategoryDropdowns] = useState({});

  useEffect(() => {
    const handleClickOutside = () => {
      setCategoryDropdowns({});
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchPendingOrders = async () => {
    setLoadingPendingOrders(true);
    try {
      const response = await api.get('admin/orders/pending/nonValide');
      setPendingOrders(response.data);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de chargement des commandes en attente");
    } finally {
      setLoadingPendingOrders(false);
    }
  };

  const handleValidateOrder = async (orderId) => {
    try {
      await api.put(`admin/orders/${orderId}/validate`);
      fetchPendingOrders();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Échec de la validation de la commande");
    }
  };

  useEffect(() => {
    if (selectedTab === 'orders') {
      fetchPendingOrders();
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("ERREUR:", error.response?.data || error.message);
        alert("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) fetchData();
  }, [isAdmin, selectedTab]);

  const handleCreateProduct = async (productData) => {
    try {
      const response = await api.post('/admin/products', productData);
      setProducts([...products, {
        ...response.data,
        categoryId: response.data.category_id,
        subProducts: response.data.sub_products || [] 
      }]);
      return { success: true };
    } catch (error) {
      console.error('Error creating product:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors de la création' 
      };
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      const response = await api.put(`/admin/products/${productId}`, productData);
      setProducts(products.map(p => 
        p.id === productId ? {
          ...response.data,
          categoryId: response.data.category_id,
          subProducts: response.data.sub_products || response.data.subProducts || []
        } : p
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.response?.data?.message || 'Erreur lors de la mise à jour' };
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit et tous ses sous-produits ?')) {
      return { success: false };
    }
    
    try {
      await api.delete(`/admin/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.response?.data?.message || 'Erreur lors de la suppression' };
    }
  };

  const handleUpdateSubProduct = async (subProductId, updatedData) => {
    try {
      const response = await api.put(`/admin/sub_products/${subProductId}`, updatedData);
      setProducts(products.map(p => ({
        ...p,
        subProducts: (p.subProducts || p.sub_products || []).map(sp => 
          sp.id === subProductId ? response.data : sp
        ),
        sub_products: (p.subProducts || p.sub_products || []).map(sp => 
          sp.id === subProductId ? response.data : sp
        )
      })));
      setEditingSubProduct(null);
      return { success: true };
    } catch (error) {
      console.error('Error updating subproduct:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
      return { success: false };
    }
  };

  const handleDeleteSubProduct = async (subProductId) => {
    try {
      await api.delete(`/admin/sub_products/${subProductId}`);
      setProducts(products.map(product => ({
        ...product,
        subProducts: (product.subProducts || []).filter(sp => sp.id !== subProductId),
        sub_products: (product.sub_products || []).filter(sp => sp.id !== subProductId)
      })));
      setEditingSubProduct(null);
      return { success: true };
    } catch (error) {
      console.error('Error deleting subproduct:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
      return { success: false };
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await api.post('/admin/categories', categoryData);
      setCategories([...categories, response.data]);
      setShowCategoryForm(false);
      return { success: true };
    } catch (error) {
      console.error('Error creating category:', error);
      alert(error.response?.data?.message || 'Erreur de création');
      return { success: false };
    }
  };

  const handleUpdateCategory = async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
      setCategories(categories.map(c => 
        c.id === categoryId ? response.data : c
      ));
      setEditingCategory(null);
      return { success: true };
    } catch (error) {
      console.error('Error updating category:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
      return { success: false };
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/admin/categories/${categoryId}`);
      setCategories(categories.filter(c => c.id !== categoryId));
      setEditingCategory(null);
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
      return { success: false };
    }
  };

  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };


  if (!currentUser) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg border-0 text-center" style={{maxWidth: '400px'}}>
            <div className="card-body p-5">
              <div className="text-warning mb-4">
                <i className="bi bi-shield-lock fs-1"></i>
              </div>
              <h3 className="card-title text-muted mb-3">Accès requis</h3>
              <p className="card-text mb-4">Veuillez vous connecter pour accéder à cette page</p>
              <Link to="/login" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Se connecter
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg border-0 text-center" style={{maxWidth: '400px'}}>
            <div className="card-body p-5">
              <div className="text-danger mb-4">
                <i className="bi bi-shield-x fs-1"></i>
              </div>
              <h3 className="card-title text-muted mb-3">Accès interdit</h3>
              <p className="card-text mb-4">Accès réservé aux administrateurs</p>
              <Link to="/" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-house me-2"></i>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column admin-page">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-speedometer2 me-3"></i>
                Tableau de bord administrateur
              </h1>
              <p className="lead mb-0">Gérez vos produits, catégories et commandes en toute simplicité</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="d-flex flex-column align-items-lg-end">
                <span className="badge bg-light text-dark fs-6 mb-2">
                  <i className="bi bi-person-circle me-1"></i>
                  {currentUser.name}
                </span>
                <small className="text-white-50">Administrateur connecté</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Navigation Tabs */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-0">
              <ul className="nav nav-pills nav-fill" style={{borderRadius: '0.375rem'}}>
                <li className="nav-item">
                  <button
                    className={`nav-link ${selectedTab === 'products' ? 'active' : ''} d-flex align-items-center justify-content-center py-3`}
                    onClick={() => setSelectedTab('products')}
                  >
                    <i className="bi bi-box-seam me-2"></i>
                    <span className="fw-semibold">Produits</span>
                    <span className="badge bg-light text-dark ms-2">{products.length}</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${selectedTab === 'categories' ? 'active' : ''} d-flex align-items-center justify-content-center py-3`}
                    onClick={() => setSelectedTab('categories')}
                  >
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    <span className="fw-semibold">Catégories</span>
                    <span className="badge bg-light text-dark ms-2">{categories.length}</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${selectedTab === 'orders' ? 'active' : ''} d-flex align-items-center justify-content-center py-3`}
                    onClick={() => setSelectedTab('orders')}
                  >
                    <i className="bi bi-cart-check me-2"></i>
                    <span className="fw-semibold">Commandes</span>
                    <span className="badge bg-warning text-dark ms-2">{pendingOrders.length}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {loading ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <h5 className="text-muted">Chargement des données...</h5>
                </div>
              </div>
            ) : (
              <>
                {/* Products Tab */}
                {selectedTab === 'products' && (
                  <div className="fade-in">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white border-0 py-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="h4 mb-1 fw-bold primary">
                              <i className="bi bi-box-seam me-2"></i>
                              Gestion des produits
                            </h3>
                            <p className="text-muted mb-0">Ajoutez, modifiez ou supprimez vos produits</p>
                          </div>
                          <button
                            className="btn btn-primary btn-lg shadow-sm"
                            onClick={() => {
                              setShowProductCreateForm(!showProductCreateForm);
                              setSelectedProduct(null);
                            }}
                          >
                            <i className={`bi ${showProductCreateForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
                            {showProductCreateForm ? 'Annuler l\'ajout' : 'Ajouter un produit'}
                          </button>
                        </div>
                      </div>

                      <div className="card-body">
                        {showProductCreateForm && !selectedProduct && (
                          <div className="mb-4">
                            <AdminProductForm
                              categories={categories}
                              onSave={handleCreateProduct}
                              onCancel={() => setShowProductCreateForm(false)}
                            />
                          </div>
                        )}

                        {selectedProduct && (
                          <div className="mb-4">
                            <button
                              className="btn btn-outline-primary mb-4"
                              onClick={() => {
                                setSelectedProduct(null);
                                setShowProductCreateForm(false);
                              }}
                            >
                              <i className="bi bi-arrow-left me-2"></i>
                              Retour à la liste
                            </button>

                            <AdminProductForm
                              product={products.find(p => p.id === selectedProduct)}
                              categories={categories}
                              onSave={(updatedProduct) => {
                                handleUpdateProduct(selectedProduct, updatedProduct);
                                setSelectedProduct(null);
                              }}
                              onDelete={handleDeleteProduct}
                            />
                          </div>
                        )}

                        {!showProductCreateForm && !selectedProduct && (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <h5 className="fw-semibold text-dark mb-0">
                                <i className="bi bi-list-ul me-2 "></i>
                                Liste des produits ({products.length})
                              </h5>
                            </div>

                            {products.length === 0 ? (
                              <div className="text-center py-5">
                                <div className="text-muted mb-4">
                                  <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                  <h5>Aucun produit enregistré</h5>
                                  <p>Commencez par ajouter votre premier produit</p>
                                </div>
                              </div>
                            ) : (
                              <div className="row g-4">
                                {products.map(product => (
                                  <div key={product.id} className="col-12">
                                    <div className="card border-0 shadow-sm product-card">
                                      <div className="card-header bg-light border-0 py-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-1 text-dark">{product.name}</h5>
                                            <div className="d-flex align-items-center gap-3 text-muted">
                                              <span>
                                                <i className="bi bi-tag me-1"></i>
                                                {categories.find(c => c.id === product.category_id)?.name || 'Inconnue'}
                                              </span>
                                              <span>
                                                <i className="bi bi-collection me-1"></i>
                                                {(product.sub_products || product.subProducts || []).length} marques
                                              </span>
                                            </div>
                                          </div>
                                          <div className="d-flex align-items-center gap-2">
                                            <button
                                              onClick={() => toggleProductExpansion(product.id)}
                                              className="btn btn-outline-primary btn-sm"
                                            >
                                              <i className={`bi ${expandedProducts[product.id] ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>
                                              {expandedProducts[product.id] ? 'Masquer' : 'Détails'}
                                            </button>
                                            <button
                                              onClick={() => setSelectedProduct(product.id)}
                                              className="btn btn-primary btn-sm"
                                            >
                                              <i className="bi bi-pencil me-1"></i>
                                              Modifier
                                            </button>
                                            <button
                                              onClick={() => handleDeleteProduct(product.id)}
                                              className="btn btn-outline-danger btn-sm"
                                            >
                                              <i className="bi bi-trash"></i>
                                              supprimer
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {expandedProducts[product.id] && (
                                        <div className="card-body">
                                          <p className="text-muted mb-4">{product.description}</p>

                                          <h6 className="fw-semibold mb-3 ">
                                            <i className="bi bi-tags me-2"></i>
                                            Marques disponibles:
                                          </h6>

                                          {(product.sub_products || product.subProducts || []).length === 0 ? (
                                            <div className="text-center py-3">
                                              <i className="bi bi-exclamation-triangle text-warning fs-4 mb-2 d-block"></i>
                                              <p className="text-muted mb-0">Aucune marque ajoutée</p>
                                            </div>
                                          ) : (
                                            <div className="table-responsive">
                                              <table className="table table-hover align-middle">
                                                <thead className="table-dark">
                                                  <tr>
                                                    <th><i className="bi bi-tag me-1"></i>Marque</th>
                                                    <th className="text-end"><i className="bi bi-currency-exchange me-1"></i>Prix</th>
                                                    <th className="text-end"><i className="bi bi-boxes me-1"></i>Stock</th>
                                                    <th className="text-center">Actions</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {(product.sub_products || product.subProducts || []).map(subProduct => (
                                                    <React.Fragment key={subProduct.id}>
                                                      {editingSubProduct === subProduct.id ? (
                                                        <SubProductEditForm
                                                          subProduct={subProduct}
                                                          onSave={(updatedData) => handleUpdateSubProduct(subProduct.id, updatedData)}
                                                          onCancel={() => setEditingSubProduct(null)}
                                                          onDelete={() => handleDeleteSubProduct(subProduct.id)}
                                                        />
                                                      ) : (
                                                        <tr>
                                                          <td className="fw-semibold">{subProduct.brand}</td>
                                                          <td className="text-end">
                                                            <span className="fw-bold ">
                                                              {parseFloat(subProduct.price).toLocaleString()} Ar
                                                            </span>
                                                          </td>
                                                          <td className="text-end">
                                                            <span className={`badge ${subProduct.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                              {subProduct.stock}
                                                            </span>
                                                          </td>
                                                          <td className="text-center">
                                                            <div className="btn-group btn-group-sm">
                                                              <button
                                                                onClick={() => setEditingSubProduct(subProduct.id)}
                                                                className="btn btn-outline-primary"
                                                              >
                                                                <i className="bi bi-pencil"></i>
                                                                Modifier
                                                              </button>
                                                              <button
                                                                onClick={() => handleDeleteSubProduct(subProduct.id)}
                                                                className="btn btn-outline-danger"
                                                              >
                                                                <i className="bi bi-trash"></i>
                                                                Supprimer
                                                              </button>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      )}
                                                    </React.Fragment>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Tab */}
                {selectedTab === 'categories' && (
                  <div className="fade-in">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white border-0 py-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="h4 mb-1 fw-bold ">
                              <i className="bi bi-grid-3x3-gap me-2"></i>
                              Gestion des catégories
                            </h3>
                            <p className="text-muted mb-0">Organisez vos produits par catégories</p>
                          </div>
                          <button
                            onClick={() => {
                              setShowCategoryForm(!showCategoryForm);
                              setEditingCategory(null);
                            }}
                            className="btn btn-primary btn-lg shadow-sm"
                          >
                            <i className={`bi ${showCategoryForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
                            {showCategoryForm ? 'Annuler' : 'Nouvelle Catégorie'}
                          </button>
                        </div>
                      </div>

                      <div className="card-body">
                        {showCategoryForm && (
                          <div className="mb-4">
                            <AdminCategoryEditForm
                              onSave={handleCreateCategory}
                              onCancel={() => setShowCategoryForm(false)}
                            />
                          </div>
                        )}

                        {editingCategory && (
                          <div className="mb-4">
                            <AdminCategoryEditForm
                              category={categories.find(c => c.id === editingCategory)}
                              onSave={(categoryData) => handleUpdateCategory(editingCategory, categoryData)}
                              onCancel={() => setEditingCategory(null)}
                              onDelete={handleDeleteCategory}
                            />
                          </div>
                        )}

                        <div className="row g-4">
                          {categories.map(category => (
                            <div key={category.id} className="col-lg-4 col-md-6">
                              <div className="card border-0 shadow-sm h-100 category-card">
                                <div className="card-body p-4">
                                  <div className="d-flex align-items-start justify-content-between mb-3">
                                    <div className="text-primary">
                                      <i className="bi bi-folder fs-2"></i>
                                    </div>
                                  </div>
                                  <h5 className="fw-bold mb-2">{category.name}</h5>
                                  <p className="text-muted small mb-3">{category.description || 'Aucune description'}</p>
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="badge bg-light text-dark">
                                      {products.filter(p => p.category_id === category.id).length} produits
                                    </span>
                                    <span className="badge bg-success">Active</span>
                                  </div>
                                  <div className="d-flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingCategory(category.id);
                                        setShowCategoryForm(false);
                                      }}
                                      className="btn btn-outline-primary btn-sm"
                                    >
                                      <i className="bi bi-pencil me-1"></i>
                                      Modifier
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(category.id)}
                                      className="btn btn-outline-danger btn-sm"
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {selectedTab === 'orders' && (
                  <div className="fade-in">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white border-0 py-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="h4 mb-1 fw-bold">
                              <i className="bi bi-cart-check me-2"></i>
                              Commandes en attente
                            </h3>
                            <p className="text-muted mb-0">Gérez les commandes en attente de validation</p>
                          </div>
                          <button
                            className="btn btn-outline-secondary btn-lg"
                            onClick={fetchPendingOrders}
                          >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Actualiser
                          </button>
                        </div>
                      </div>

                      <div className="card-body">
                        {loadingPendingOrders ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status">
                              <span className="visually-hidden">Chargement...</span>
                            </div>
                            <p className="text-muted">Chargement des commandes...</p>
                          </div>
                        ) : pendingOrders.length === 0 ? (
                          <div className="text-center py-5">
                            <div className="text-muted">
                              <i className="bi bi-check-circle fs-1 text-success mb-3 d-block"></i>
                              <h5>Aucune commande en attente</h5>
                              <p>Toutes les commandes ont été traitées</p>
                            </div>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover align-middle">
                              <thead className="table-dark">
                                <tr>
                                  <th><i className="bi bi-hash me-1"></i>ID</th>
                                  <th><i className="bi bi-person me-1"></i>Client</th>
                                  <th><i className="bi bi-calendar me-1"></i>Date</th>
                                  <th><i className="bi bi-currency-exchange me-1"></i>Total</th>
                                  <th><i className="bi bi-bag me-1"></i>Articles</th>
                                  <th className="text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pendingOrders.map(order => (
                                  <tr key={order.id}>
                                    <td>
                                      <span className="fw-bold text-primary">#{order.id}</span>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                                          <i className="bi bi-person"></i>
                                        </div>
                                        <span className="fw-semibold">{order.user?.name}</span>
                                      </div>
                                    </td>
                                    <td>
                                      <small className="text-muted">
                                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </small>
                                    </td>
                                    <td>
                                      <span className="fw-bold text-success">
                                        {order.total.toLocaleString()} Ar
                                      </span>
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        {order.items.slice(0, 2).map(item => (
                                          <small key={item.id} className="text-muted">
                                            {item.quantity}× {item.sub_product?.brand}
                                          </small>
                                        ))}
                                        {order.items.length > 2 && (
                                          <small className="text-primary">+{order.items.length - 2} autres</small>
                                        )}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <button
                                        onClick={() => handleValidateOrder(order.id)}
                                        className="btn btn-success btn-sm"
                                      >
                                        <i className="bi bi-check-lg me-1"></i>
                                        Valider
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;