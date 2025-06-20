import React, { useState } from 'react';
import api from '../services/api';

const AdminCategoryForm = ({ onCategoryCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/admin/categories', { name, description });
      onCategoryCreated(response.data);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Erreur lors de la création de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Nouvelle Catégorie
        </h5>
      </div>
      
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <i className="bi bi-tag me-1 text-primary"></i>
                Nom de la catégorie*
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Ex: Alimentation, Électronique..."
                required
              />
            </div>
            
            <div className="col-md-6 d-flex align-items-end">
              <button 
                type="submit" 
                className="btn btn-success btn-lg w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg me-2"></i>
                    Créer la catégorie
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-text-paragraph me-1 text-primary"></i>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              rows="3"
              placeholder="Description détaillée de la catégorie (optionnel)"
            />
            <div className="form-text">
              <i className="bi bi-info-circle me-1"></i>
              Cette description aidera les utilisateurs à mieux comprendre cette catégorie.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryForm;