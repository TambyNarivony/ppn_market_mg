import React, { useState } from 'react';
import { FaImage, FaQuestionCircle } from 'react-icons/fa';


const SubProductEditForm = ({ subProduct, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    brand: subProduct?.brand || '',
    price: subProduct?.price || '',
    stock: subProduct?.stock || '',
    image_url: subProduct?.image_url || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0
    });
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sous-produit ?')) {
      onDelete(subProduct.id);
    }
  };

  return (
    <tr className="table-info">
      <td colSpan="4" className="p-4">
        <div className="card border-0 bg-light">
          <div className="card-header bg-primary text-white">
            <h6 className="mb-0">
              <i className="bi bi-pencil-square me-2"></i>
              {subProduct ? 'Modifier le sous-produit' : 'Nouveau sous-produit'}
            </h6>
          </div>
          
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-tag me-1"></i>Marque*
                  </label>
                  <input
                    name="brand"
                    type="text"
                    className="form-control"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Nom de la marque"
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-currency-exchange me-1"></i>Prix (Ar)*
                  </label>
                  <div className="input-group">
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                    <span className="input-group-text">Ar</span>
                  </div>
                </div>
              </div>
              
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-boxes me-1"></i>Stock
                  </label>
                  <input
                    name="stock"
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Quantité en stock"
                    min="0"
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-image me-1"></i>URL de l'image
                  </label>
                  <input
                    name="image_url"
                    type="url"
                    className="form-control"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://exemple.com/image.jpg"
                  />
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Lien vers l'image du produit (optionnel)
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <div className="btn-group" role="group">
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-lg me-1"></i>
                    Sauvegarder
                  </button>
                  <button type="button" onClick={onCancel} className="btn btn-secondary">
                    <i className="bi bi-x-lg me-1"></i>
                    Annuler
                  </button>
                </div>
                
                {subProduct && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger"
                  >
                    <i className="bi bi-trash me-1"></i>
                    Supprimer
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default SubProductEditForm;