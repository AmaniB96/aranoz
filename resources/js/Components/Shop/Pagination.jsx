import React from 'react';
import { router } from '@inertiajs/react';

export default function Pagination({ products }) {
    // Debug: vérifier la structure des données
    console.log('Pagination products:', products);

    if (!products || products.last_page <= 1) {
        return null;
    }

    const changePage = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    // Trouver les liens Previous et Next dans le tableau links
    const prevLink = products.links?.find(link => 
        link.label === '&laquo; Previous' || 
        link.label === 'Previous'
    );
    const nextLink = products.links?.find(link => 
        link.label === 'Next &raquo;' || 
        link.label === 'Next'
    );

    return (
        <nav className="pagination">
            <button 
                onClick={() => changePage(prevLink?.url)} 
                disabled={!prevLink?.url}
                className="pagination-btn prev"
            >
                Previous
            </button>
            
            <span className="page-info">
                Page {products.current_page} of {products.last_page} 
                ({products.total} products)
            </span>
            
            <button 
                onClick={() => changePage(nextLink?.url)} 
                disabled={!nextLink?.url}
                className="pagination-btn next"
            >
                Next
            </button>
        </nav>
    );
}