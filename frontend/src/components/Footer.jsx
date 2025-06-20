import React from 'react';
import { FaFacebook, FaWhatsapp, FaMobileAlt } from 'react-icons/fa';

const Footer = () => {


return (
  <footer className="btn-primary text-white py-5 mt-auto">
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-4 mb-md-0">
          <h3 className="h5 mb-3">Modes de paiement</h3>
          <div className="d-flex gap-2" >
            <span className="btn-secondary rounded fw-bold" style={{height:"70px", padding:'20px'}}>MVola</span>
            <span className="btn-secondary  rounded p-2 fw-bold" style={{height:"70px", padding:'20px'}}>Orange Money</span>
            <span className="btn-secondary  rounded p-2 fw-bold" style={{height:"70px", padding:'20px'}}>Airtel Money</span> 
            <img src="../../public/image/visa.jpg" className="img-fluid" style={{ maxWidth: '100px', height:"70px" }} />
          </div>
        </div>
        
        <div className="col-md-4 mb-4 mb-md-0">
          <h3 className="h5 mb-3">Contact</h3>
          <p className="mb-2">
            <FaMobileAlt className="me-2" />
            +261 34 00 000 00
          </p>
          <p>Lundi - Vendredi: 8h - 18h</p>
          <p>Samedi: 8h - 12h</p>
        </div>
        
        <div className="col-md-4">
          <h3 className="h5 mb-3">Suivez-nous</h3>
          <div className="d-flex gap-3">
            <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center"
                style={{color: '#D2691E'}}
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-green-500 rounded-full w-10 h-10 flex items-center justify-center"
                style={{color: '#D2691E'}}
              >
                <FaWhatsapp size={20} />
              </a>
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-top border-white text-center">
        <p>&copy; {new Date().getFullYear()} PPN Market Madagascar. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
);
};

export default Footer;



