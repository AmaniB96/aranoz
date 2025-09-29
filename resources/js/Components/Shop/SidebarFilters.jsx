import React, { useState } from 'react';

export default function SidebarFilters({ categories = [], colors = [], filters = {}, onFilter }) {
    const [state, setState] = useState({
        category: filters.category || '',
        color: filters.color || '',
        search: filters.search || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        sort: filters.sort || '',
    });

    const submit = (e) => {
        e && e.preventDefault();
        onFilter(state);
    };

    return (
        <div className="sidebar-filters">
            <form onSubmit={submit}>
                <div className="filter-block">
                    <h4>Product filters</h4>
                    <ul className="category-list">
                        {categories.map(c => (
                            <li key={c.id}>
                                <button type="button" className={state.category == c.id ? 'active' : ''}
                                    onClick={() => setState(s => ({ ...s, category: s.category == c.id ? '' : c.id }))}>
                                    {c.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="filter-block">
                    <h4>Color Filter</h4>
                    <ul className="color-list">
                        {colors.map(c => (
                            <li key={c.id}>
                                <button type="button" className={state.color == c.id ? 'active' : ''}
                                    onClick={() => setState(s => ({ ...s, color: s.color == c.id ? '' : c.id }))}>
                                    {c.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="filter-block">
                    <input placeholder="Recherche" value={state.search}
                        onChange={e => setState(s => ({ ...s, search: e.target.value }))} />
                </div>

                <div className="filter-block price-range">
                    <input placeholder="Min" value={state.min_price} onChange={e => setState(s => ({ ...s, min_price: e.target.value }))} />
                    <input placeholder="Max" value={state.max_price} onChange={e => setState(s => ({ ...s, max_price: e.target.value }))} />
                </div>

                <div className="filter-block">
                    <select value={state.sort} onChange={e => setState(s => ({ ...s, sort: e.target.value }))}>
                        <option value="">Sort By</option>
                        <option value="newest">Newest</option>
                        <option value="price_asc">Price ↑</option>
                        <option value="price_desc">Price ↓</option>
                    </select>
                </div>

                <div className="filter-actions">
                    <button type="submit">Apply</button>
                    <button type="button" onClick={() => { setState({ category:'',color:'',search:'',min_price:'',max_price:'',sort:'' }); onFilter({}); }}>Reset</button>
                </div>
            </form>
        </div>
    );
}