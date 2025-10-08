import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Nav from '@/Components/nav/Nav';
import './checkout.css';

export default function Checkout() {
    const { items = [], subtotal = 0, discount = 0, total = 0, appliedCoupon, userInfo = {} } = usePage().props;
    const [paymentMethod, setPaymentMethod] = useState('check');
    const [isProcessing, setIsProcessing] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    
    // États pour les données de facturation - PRÉ-REMPLIR AVEC LES INFOS UTILISATEUR
    const [billingData, setBillingData] = useState({
        firstname: userInfo.firstname || '',
        lastname: userInfo.lastname || '',
        company: userInfo.company || '',
        phone: userInfo.phone || '',
        email: userInfo.email || '',
        country: userInfo.country || 'Belgium',
        address: userInfo.address || '',
        number: userInfo.number || '',
        city: userInfo.city || '',
        postcode: userInfo.postcode || ''
    });

    const handleBillingChange = (field, value) => {
        setBillingData(prev => ({ ...prev, [field]: value }));
    };

    const simulatePayment = async () => {
        // Validation basique
        if (!billingData.firstname || !billingData.lastname || !billingData.email || !billingData.address) {
            alert('Please fill in all required fields');
            return;
        }

        if (!acceptTerms) {
            alert('Please accept the terms and conditions');
            return;
        }

        setIsProcessing(true);

        // Simulation d'un délai de traitement
        setTimeout(() => {
            // Préparer les données de commande
            const orderData = {
                billing: billingData,
                payment_method: paymentMethod,
                items: items,
                subtotal: subtotal,
                discount: discount,
                total: total,
                coupon_code: appliedCoupon?.code || null
            };

            // Envoyer la commande au backend
            router.post('/orders/simulate-payment', orderData, {
                onSuccess: () => {
                    // Redirection sera gérée par le backend
                },
                onError: (errors) => {
                    console.error('Payment simulation errors:', errors);
                    alert('Payment simulation failed: ' + JSON.stringify(errors));
                    setIsProcessing(false);
                }
            });
        }, 2000);
    };

    return (
        <>
            <Nav />
            <div className="checkout-page">
                <div className="container">
                    <div className="checkout-grid">
                        {/* Colonne gauche - Billing Details */}
                        <div className="billing-details">
                            <h2>Billing Details</h2>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="firstname"
                                        value={billingData.firstname}
                                        onChange={(e) => handleBillingChange('firstname', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="lastname"
                                        value={billingData.lastname}
                                        onChange={(e) => handleBillingChange('lastname', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="company"
                                    value={billingData.company}
                                    onChange={(e) => handleBillingChange('company', e.target.value)}
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Phone number"
                                        value={billingData.phone}
                                        onChange={(e) => handleBillingChange('phone', e.target.value)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="nexagray@gmail.com"
                                        value={billingData.email}
                                        onChange={(e) => handleBillingChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <select
                                    value={billingData.country}
                                    onChange={(e) => handleBillingChange('country', e.target.value)}
                                    className="country-select"
                                >
                                    <option value="Belgium">Belgium</option>
                                    <option value="France">France</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Netherlands">Netherlands</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                </select>
                            </div>

                            <div className="form-grid">
                                <div className="form-group address-group">
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={billingData.address}
                                        onChange={(e) => handleBillingChange('address', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group number-group">
                                    <input
                                        type="text"
                                        placeholder="Number"
                                        value={billingData.number}
                                        onChange={(e) => handleBillingChange('number', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="city"
                                    value={billingData.city}
                                    onChange={(e) => handleBillingChange('city', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Postcode/ZIP"
                                    value={billingData.postcode}
                                    onChange={(e) => handleBillingChange('postcode', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Colonne droite - Your Order */}
                        <div className="order-summary">
                            <div className="order-box">
                                <h3>Your Order</h3>
                                
                                <div className="order-header">
                                    <span>Product</span>
                                    <span>Total</span>
                                </div>

                                <div className="order-items">
                                    {items.map(item => (
                                        <div key={item.id} className="order-item">
                                            <span className="item-name">
                                                {item.name} <span className="quantity">x {item.quantity}</span>
                                            </span>
                                            <span className="item-total">$ {item.total}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-totals">
                                    <div className="total-row subtotal">
                                        <span>SUBTOTAL</span>
                                        <span>$ {subtotal.toFixed(1)}</span>
                                    </div>
                                    
                                    <div className="total-row shipping">
                                        <span>SHIPPING</span>
                                        <span>FREE SHIPPING WORLD WIDE !</span>
                                    </div>
                                    
                                    <div className="total-row final-total">
                                        <span>TOTAL</span>
                                        <span>$ {total.toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="payment-methods">
                                    <div className="payment-option">
                                        <label>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="check"
                                                checked={paymentMethod === 'check'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>CHECK PAYMENTS</span>
                                        </label>
                                        
                                        {paymentMethod === 'check' && (
                                            <div className="payment-description">
                                                <p>Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="payment-option">
                                        <label>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="paypal"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>PAYPAL</span>
                                            <img src="/images/paypal-cards.png" alt="PayPal" className="paypal-logo" />
                                        </label>
                                        
                                        {paymentMethod === 'paypal' && (
                                            <div className="payment-description">
                                                <p>Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="terms-section">
                                    <label className="terms-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => setAcceptTerms(e.target.checked)}
                                        />
                                        <span>I've read and accept the <a href="/terms">terms & conditions</a>*</span>
                                    </label>
                                </div>

                                {/* Checkout Button */}
                                <button 
                                    className={`checkout-btn ${isProcessing ? 'processing' : ''}`}
                                    onClick={simulatePayment}
                                    disabled={isProcessing || !acceptTerms}
                                >
                                    {isProcessing ? 'Processing...' : 'CHECK AND PAY'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}