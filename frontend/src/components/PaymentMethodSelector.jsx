import React, { useState } from 'react';

const PaymentMethodSelector = ({ onPaymentSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    onPaymentSelect(method);
    setPhoneNumber('');
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-light border-bottom-0">
        <h5 className="card-title mb-0">
          <i className="bi bi-phone me-2 text-primary"></i>
          Paiement mobile
        </h5>
      </div>
      
      <div className="card-body p-4">
        <div className="row g-3 mb-4">
          <div className="col-6">
            <button
              type="button"
              className={`btn w-100 d-flex flex-column align-items-center p-3 border-2 ${
                selectedMethod === 'mvola' 
                  ? 'btn-primary border-primary shadow-sm' 
                  : 'btn-outline-primary border-primary-subtle'
              }`}
              onClick={() => handleMethodSelect('mvola')}
              style={{
                transform: selectedMethod === 'mvola' ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="bg-primary text-white rounded-circle p-2 mb-2">
                <i className="bi bi-phone fs-5"></i>
              </div>
              <span className="fw-semibold">MVola</span>
              <small className="text-muted">Telma</small>
            </button>
          </div>
          
          <div className="col-6">
            <button
              type="button"
              className={`btn w-100 d-flex flex-column align-items-center p-3 border-2 ${
                selectedMethod === 'orange' 
                  ? 'btn-warning border-warning shadow-sm text-dark' 
                  : 'btn-outline-warning border-warning-subtle'
              }`}
              onClick={() => handleMethodSelect('orange')}
              style={{
                transform: selectedMethod === 'orange' ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="bg-warning text-dark rounded-circle p-2 mb-2">
                <i className="bi bi-phone fs-5"></i>
              </div>
              <span className="fw-semibold">Orange Money</span>
              <small className="text-muted">Orange</small>
            </button>
          </div>
        </div>
        
        {selectedMethod && (
          <div className="fade-in">
            <div className="alert alert-info border-0 bg-info-subtle">
              <div className="d-flex align-items-center">
                <i className="bi bi-info-circle me-2"></i>
                <small>
                  Vous serez redirigé vers {selectedMethod === 'mvola' ? 'MVola' : 'Orange Money'} 
                  pour finaliser votre paiement
                </small>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-phone me-2"></i>
                Numéro de téléphone ({selectedMethod === 'mvola' ? 'MVola' : 'Orange Money'})
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-telephone text-primary"></i>
                </span>
                <input
                  type="tel"
                  className="form-control border-start-0"
                  placeholder="Ex: 034 00 000 00"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  pattern="[0-9\s\-]+"
                  required
                />
              </div>
              <div className="form-text">
                <i className="bi bi-shield-check text-success me-1"></i>
                Vos informations sont sécurisées et chiffrées
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;