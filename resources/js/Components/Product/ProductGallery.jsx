import React, { useState } from 'react';


const getValidImageUrl = (url) => {
    if (!url) return '/images/placeholder.png';
    if (url === 'public/images/placeholder.png') return '/images/placeholder.png';
    return url;
};


export default function ProductGallery({ gallery = [], main }) {
    const [active, setActive] = useState(0);
    const thumbs = gallery.length ? gallery : [main];
    

    return (
        <div className="product-gallery">
            <div className="gallery-main">
                <img src={getValidImageUrl(thumbs[active])} alt="product" onError={(e) => {
                    console.log('Gallery image failed:', e.target.src);
                    e.target.src = '/images/placeholder.png';
                }} />
            </div>
            <div className="gallery-thumbs">
                {thumbs.map((t, i) => (
                    <button key={i} className={`thumb ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                        <img src={t} alt={`thumb-${i}`} onError={(e)=> e.target.src='public/images/placeholder.png'} />
                    </button>
                ))}
            </div>
        </div>
    );
}