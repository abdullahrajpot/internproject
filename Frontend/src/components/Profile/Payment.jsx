import React, { useState } from 'react';
import './Payment.css';

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      name: 'Visa ending in 4242',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    // Here you would typically integrate with a payment processor
    console.log('Adding new card:', newCard);
    setShowAddCard(false);
    setNewCard({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleRemoveCard = (id) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return (
    <div className="payment-settings">
      <div className="payment-header">
        <h2>Payment Methods</h2>
        <p>Manage your payment methods for course fees and subscriptions</p>
      </div>

      <div className="payment-methods">
        <h3>Saved Payment Methods</h3>
        
        {paymentMethods.length === 0 ? (
          <div className="no-payment-methods">
            <div className="no-payment-icon">💳</div>
            <p>No payment methods added yet</p>
          </div>
        ) : (
          <div className="payment-list">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-item">
                <div className="payment-info">
                  <div className="card-icon">💳</div>
                  <div className="card-details">
                    <h4>{method.name}</h4>
                    <p>Expires {method.expiry}</p>
                    {method.isDefault && <span className="default-badge">Default</span>}
                  </div>
                </div>
                <div className="payment-actions">
                  {!method.isDefault && (
                    <button 
                      className="set-default-btn"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </button>
                  )}
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveCard(method.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          className="add-payment-btn"
          onClick={() => setShowAddCard(true)}
        >
          + Add New Payment Method
        </button>
      </div>

      {showAddCard && (
        <div className="add-card-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Card</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddCard(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddCard} className="add-card-form">
              <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={newCard.cardholderName}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={newCard.expiryDate}
                    onChange={handleInputChange}
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={newCard.cvv}
                    onChange={handleInputChange}
                    required
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddCard(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="add-btn">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="billing-info">
        <h3>Billing Information</h3>
        <div className="billing-item">
          <span>Current Plan:</span>
          <span className="plan-name">Free Tier</span>
        </div>
        <div className="billing-item">
          <span>Next Billing Date:</span>
          <span>N/A</span>
        </div>
        <div className="billing-item">
          <span>Billing History:</span>
          <button className="view-history-btn">View History</button>
        </div>
      </div>

      <div className="security-notice">
        <div className="security-icon">🔒</div>
        <div className="security-content">
          <h4>Secure Payments</h4>
          <p>
            All payment information is encrypted and processed securely. 
            We never store your complete card details on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;