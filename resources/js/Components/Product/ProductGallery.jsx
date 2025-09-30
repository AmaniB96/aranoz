import React, { useState } from 'react';

export default function ProductGallery({ gallery = [], main }) {
    const [active, setActive] = useState(0);
    const thumbs = gallery.length ? gallery : [main];

    return (
        <div className="product-gallery">
            <div className="gallery-main">
                <img src={thumbs[active] || main} alt="product" onError={(e)=> e.target.src='/storage/products/default.png'} />
            </div>
            <div className="gallery-thumbs">
                {thumbs.map((t, i) => (
                    <button key={i} className={`thumb ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                        <img src={t} alt={`thumb-${i}`} onError={(e)=> e.target.src='/storage/products/default.png'} />
                    </button>
                ))}
            </div>
        </div>
    );
}