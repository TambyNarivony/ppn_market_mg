import React, { useState } from 'react';

const AdminCategoryEditForm = ({ category, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.')) {
      onDelete(category.id);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-folder me-2"></i>
          {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h5>
      </div>
      
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <i className="bi bi-tag me-1"></i>Nom de la catégorie*
              </label>
              <input
                name="name"
                type="text"
                className="form-control form-control-lg"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Alimentation, Électronique..."
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <i className="bi bi-info-circle me-1"></i>Statut
              </label>
              <div className="d-flex align-items-center h-100">
                <span className="badge bg-success fs-6 p-2">
                  <i className="bi bi-check-circle me-1"></i>
                  Catégorie active
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-text-paragraph me-1"></i>Description
            </label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée de la catégorie (optionnel)"
            />
            <div className="form-text">
              Cette description aidera les utilisateurs à mieux comprendre cette catégorie.
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
            <div className="btn-group" role="group">
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="bi bi-check-lg me-2"></i>
                {category ? 'Mettre à jour' : 'Créer la catégorie'}
              </button>
              <button type="button" onClick={onCancel} className="btn btn-outline-secondary btn-lg">
                <i className="bi bi-x-lg me-2"></i>
                Annuler
              </button>
            </div>
            
            {category && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger btn-lg"
              >
                <i className="bi bi-trash me-2"></i>
                Supprimer la catégorie
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryEditForm;