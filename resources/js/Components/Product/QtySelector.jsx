import React from 'react';

export default function QtySelector({ qty, setQty }) {
    return (
        <div className="qty-selector">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <input type="text" value={qty} readOnly />
            <button type="button" onClick={() => setQty(qty + 1)}>+</button>
        </div>
    );
}