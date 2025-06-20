

import React, { useState, useEffect } from 'react';

const AdminProductForm = ({ product, categories, onSave }) => {
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    subProducts: []
  });
  
  const [newSubProduct, setNewSubProduct] = useState({
    brand: '',
    price: '',
    stock: '',
    image_url: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.category_id || product.categoryId || '',
        subProducts: (product.sub_products || product.subProducts || []).map(sp => ({
          id: sp.id,
          brand: sp.brand,
          price: sp.price,
          stock: sp.stock,
          image_url: sp.image_url || sp.image || ''
        }))
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: categories[0]?.id || '',
        subProducts: []
      });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubProductChange = (e) => {
    const { name, value } = e.target;
    setNewSubProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubProduct = () => {
    if (!newSubProduct.brand || !newSubProduct.price) {
      alert('Veuillez remplir au moins la marque et le prix');
      return;
    }
    
    const subProduct = {
      id: isEditing ? null : Math.max(0, ...formData.subProducts.map(sp => sp.id || 0)) + 1,
      brand: newSubProduct.brand,
      price: parseFloat(newSubProduct.price),
      stock: parseInt(newSubProduct.stock) || 0,
      image_url: newSubProduct.image_url || null
    };
    
    setFormData(prev => ({
      ...prev,
      subProducts: [...prev.subProducts, subProduct]
    }));
    
    setNewSubProduct({
      brand: '',
      price: '',
      stock: '',
      image_url: ''
    });
  };

  const handleRemoveSubProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      subProducts: prev.subProducts.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateSubProduct = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      subProducts: prev.subProducts.map((sp, i) => 
        i === index ? { ...sp, [field]: value } : sp
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.subProducts.length === 0) {
      alert('Veuillez ajouter au moins un sous-produit');
      return;
    }
    
    setLoading(true);
    
    const productData = {
      name: formData.name,
      description: formData.description,
      category_id: formData.categoryId,
      sub_products: formData.subProducts.map(sp => ({
        id: sp.id || null,
        brand: sp.brand,
        price: parseFloat(sp.price),
        stock: parseInt(sp.stock) || 0,
        image_url: sp.image_url || null
      }))
    };

    const result = await onSave(productData);
    setLoading(false);
    
    if (result && result.success) {
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          categoryId: categories[0]?.id || '',
          subProducts: []
        });
      }
    } else if (result && result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="card border-0 shadow-lg">
      <div className="card-header bg-primary text-white py-3">
        <h4 className="mb-0">
          <i className="bi bi-box me-2"></i>
          {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
        </h4>
      </div>
      
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Product Information */}
            <div className="col-lg-6">
              <div className="card bg-light border-0">
                <div className="card-header bg-secondary text-white">
                  <h6 className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Informations du produit
                  </h6>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-tag me-1"></i>Nom du produit*
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Huile de tournesol"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-grid-3x3-gap me-1"></i>Catégorie*
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="form-select form-select-lg"
                      required
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-0">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-text-paragraph me-1"></i>Description
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Description détaillée du produit..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sub-products Management */}
            <div className="col-lg-6">
              <div className="card bg-light border-0">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">
                    <i className="bi bi-tags me-2"></i>
                    Marques / Sous-produits
                  </h6>
                </div>
                <div className="card-body">
                  {/* Add new sub-product form */}
                  <div className="border rounded p-3 mb-4" style={{backgroundColor: '#f8f9fa'}}>
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-plus-circle me-1"></i>
                      Ajouter une marque
                    </h6>
                    
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Marque*</label>
                        <input
                          type="text"
                          name="brand"
                          className="form-control form-control-sm"
                          value={newSubProduct.brand}
                          onChange={handleSubProductChange}
                          placeholder="Ex: Lesieur"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Prix (Ar)*</label>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          className="form-control form-control-sm"
                          value={newSubProduct.price}
                          onChange={handleSubProductChange}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Stock</label>
                        <input
                          type="number"
                          name="stock"
                          className="form-control form-control-sm"
                          value={newSubProduct.stock}
                          onChange={handleSubProductChange}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Image URL</label>
                   <input
  type="text"
  name="image_url"
  className="form-control form-control-sm"
  value={newSubProduct.image_url}
  onChange={handleSubProductChange}
  placeholder="https://i.ibb.co/.../image.jpg" 
/>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-primary btn-sm w-100"
                      onClick={handleAddSubProduct}
                    >
                      <i className="bi bi-plus-lg me-1"></i>
                      Ajouter cette marque
                    </button>
                  </div>
                  
                  {/* List of existing sub-products */}
                  {formData.subProducts.length > 0 ? (
                    <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                      <h6 className="text-success mb-3">
                        <i className="bi bi-check-circle me-1"></i>
                        Marques ajoutées ({formData.subProducts.length})
                      </h6>
                      
                      <div className="table-responsive">
                        <table className="table table-sm table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th>Marque</th>
                              <th className="text-end">Prix</th>
                              <th className="text-end">Stock</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.subProducts.map((sp, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm border-0"
                                    value={sp.brand}
                                    onChange={(e) => handleUpdateSubProduct(index, 'brand', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="form-control form-control-sm border-0 text-end"
                                    value={sp.price}
                                    onChange={(e) => handleUpdateSubProduct(index, 'price', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm border-0 text-end"
                                    value={sp.stock}
                                    onChange={(e) => handleUpdateSubProduct(index, 'stock', e.target.value)}
                                  />
                                </td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveSubProduct(index)}
                                  >
                                    <i className="bi bi-trash"></i>
                                    Supprimer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted py-3">
                      <i className="bi bi-inbox fs-1 mb-2 d-block"></i>
                      <p className="mb-0 small">Aucune marque ajoutée</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-4 pt-4 border-top d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-success btn-lg px-5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  {isEditing ? 'Mise à jour...' : 'Enregistrement...'}
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  {isEditing ? 'Mettre à jour le produit' : 'Enregistrer le produit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;