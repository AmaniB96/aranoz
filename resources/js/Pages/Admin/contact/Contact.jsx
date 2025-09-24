import React from 'react';
import './contact.css';

export default function Contact() {
  return (
    <div className="contact-page">
      <div style={{ width: '100%' }}>
        <iframe
          title="company-location"
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=place%20de%20la%20minoterie%2010+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          loading="lazy"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="contact-container">
        <div className="contact-left">
          <h2 className="contact-title">Update your contact datas</h2>

          <form className="contact-form" action="/contact/update" method="POST">
            <div className="row">
              <div className="input-icon">
                <input name="street" placeholder="Buttonwood street" />
              </div>
              <div className="input-icon">
                <input name="state" placeholder="California" />
              </div>
              <div className="input-icon">
                <input name="city" placeholder="Rosemead city" />
              </div>
            </div>

            <div className="row">
              <div className="input-icon">
                <input name="country_code" placeholder="Country code" />
              </div>
              <div className="input-icon">
                <input name="zip" placeholder="zip code" />
              </div>
              <div className="input-icon">
                <input name="number" placeholder="number" />
              </div>
            </div>

            <div className="row">
              <div className="input-icon wide">
                <input name="email" placeholder="Type your email" />
              </div>
              <div className="input-icon wide">
                <input name="phone" placeholder="Enter your phone number" />
              </div>
            </div>

            <button type="submit" className="btn-primary">UPDATE CONTACT</button>
          </form>
        </div>

        <aside className="contact-right">
          <div className="contact-card">
            <div className="ci"></div>
            <div>
              <h4>Place de la minoterie, Molenbeek.</h4>
              <p>Bruxelles, BE 1080</p>
            </div>
          </div>

          <div className="contact-card">
            <div className="ci"></div>
            <div>
              <h4>0477 88 99 00</h4>
              <p>Mon to Fri 9am to 6pm</p>
            </div>
          </div>

          <div className="contact-card">
            <div className="ci"></div>
            <div>
              <h4>mouss@mouss.be</h4>
              <p>Send us your query anytime!</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}