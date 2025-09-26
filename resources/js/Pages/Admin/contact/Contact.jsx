import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import './contact.css';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';

export default function Contact({ contact, flash }) {
  const { data, setData, put, processing, errors } = useForm({
    street: contact?.street || '',
    state: contact?.state || '',
    city: contact?.city || '',
    country_code: contact?.country_code || '',
    zip_code: contact?.zip_code || '',
    street_number: contact?.street_number || '', 
    email: contact?.email || '',
    phone_number: contact?.phone_number || '',
  });

  const getMapSrc = () => {
    if (!data.street && !data.city) {
      return `https://maps.google.com/maps?q=Paris,France&hl=es&z=14&output=embed`;
    }
    
    const addressParts = [
        `${data.street_number} ${data.street}`,
        data.city,
        data.state,
        data.zip_code,
        data.country_code
    ];
    const address = addressParts.filter(part => part.trim()).join(', ');
    const encodedAddress = encodeURIComponent(address);
    
    return `https://maps.google.com/maps?q=${encodedAddress}&hl=en&z=17&output=embed`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/contact/${contact?.id}`);
  };

  return (
    <>
        <NavAdmin/>
        <AdminHeader title="Contact"/>

    <div className="contact-page">
      <div className="map-wrap">
        <iframe
          title="company-location"
          width="100%"
          height="360"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={getMapSrc()}
          loading="lazy"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="contact-container">
        <div className="contact-left">
          <h2 className="contact-title">Update your contact datas</h2>

          {flash?.success && (
            <div className="success-message">
              {flash.success}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="input-icon">
                <input 
                  name="street" 
                  value={data.street}
                  onChange={e => setData('street', e.target.value)}
                  placeholder="10 Rue de la Paix" 
                />
              </div>
              <div className="input-icon">
                <input 
                  name="state" 
                  value={data.state}
                  onChange={e => setData('state', e.target.value)}
                  placeholder="Île-de-France" 
                />
              </div>
              <div className="input-icon">
                <input 
                  name="city" 
                  value={data.city}
                  onChange={e => setData('city', e.target.value)}
                  placeholder="Paris" 
                />
              </div>
            </div>

            <div className="row">
              <div className="input-icon">
                <input 
                  name="country_code" 
                  value={data.country_code}
                  onChange={e => setData('country_code', e.target.value)}
                  placeholder="FR" 
                />
              </div>
              <div className="input-icon">
                <input 
                  name="zip_code" 
                  value={data.zip_code}
                  onChange={e => setData('zip_code', e.target.value)}
                  placeholder="75002" 
                />
              </div>
              <div className="input-icon">
                <input 
                  name="street_number" 
                  value={data.street_number}
                  onChange={e => setData('street_number', e.target.value)}
                  placeholder="N° de rue" 
                />
              </div>
            </div>

            <div className="row">
              <div className="input-icon wide">
                <input 
                  name="email" 
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="Type your email" 
                />
              </div>
              <div className="input-icon wide">
                <input 
                  name="phone_number" 
                  value={data.phone_number}
                  onChange={e => setData('phone_number', e.target.value)}
                  placeholder="Enter your phone number" 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={processing}>
              {processing ? 'UPDATING...' : 'UPDATE CONTACT'}
            </button>
          </form>

          {errors && Object.keys(errors).length > 0 && (
            <div className="error-messages">
              {Object.entries(errors).map(([key, message]) => (
                <p key={key} className="error-message">{message}</p>
              ))}
            </div>
          )}
        </div>

        <aside className="contact-right">
          <div className="contact-card">
            <div>
              <h4>{contact?.street || 'Place de la minoterie, Molenbeek.'}</h4>
              <p>{contact?.city || 'Bruxelles'}, {contact?.country_code || 'BE'} {contact?.zip_code || '1080'}</p>
            </div>
          </div>

          <div className="contact-card">
            <div>
              <h4>{contact?.phone_number || '0477 88 99 00'}</h4>
              <p>Mon to Fri 9am to 6pm</p>
            </div>
          </div>

          <div className="contact-card">
            <div>
              <h4>{contact?.email || 'mouss@mouss.be'}</h4>
              <p>Send us your query anytime!</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}