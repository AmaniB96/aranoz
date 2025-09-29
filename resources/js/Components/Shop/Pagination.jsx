import React from 'react';

export default function Pagination({ meta = {}, links = [] }) {
    const changePage = (url) => {
        if (!url) return;
        // preserve filters in query string (backend will keep with withQueryString)
        Inertia.get(url, {}, { preserveState: true });
    };

    return (
        <nav className="pagination">
            <button onClick={() => changePage(meta.links && meta.links.prev)} disabled={!meta.links || !meta.links.prev}>Prev</button>
            <span className="page-info">Page {meta.current_page} / {meta.last_page}</span>
            <button onClick={() => changePage(meta.links && meta.links.next)} disabled={!meta.links || !meta.links.next}>Next</button>
        </nav>
    );
}